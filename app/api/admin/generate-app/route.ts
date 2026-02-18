import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { logger } from '@sentry/nextjs';
import fs from 'fs'
import path from 'path'

function slugify(topic: string) {
  return (
    topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim() + '-explainer'
  );
}

export async function POST(req: Request) {
  const { topic, capability } = await req.json();

  if (!topic || !capability) {
    return NextResponse.json({ success: false, error: 'Invalid input' });
  }

  const slug = slugify(topic);

  logger.info("Generated slug:", slug);

  const templatePath = 'app-factory/app-template';
  const destPath = `app-factory/generated-apps/${slug}`;

  const child = spawn('npm', ['run', 'generate-app', '--', templatePath, destPath, capability], { shell: true });

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', (data) => {
    const s = data.toString();
    output += s;
    logger.info(s);
  });

  child.stderr.on('data', (data) => {
    const s = data.toString();
    errorOutput += s;
    logger.error(s);
  });

  return new Promise((resolve) => {
    child.on('close', (code) => {
      if (code !== 0) {
        resolve(
          NextResponse.json({
            success: false,
            error: errorOutput || output || `Process exited with code ${code}`,
          })
        );
      } else {
        try {
          const configPath = path.join(process.cwd(), 'app-factory', 'app-config', `${slug}.json`)
          const payload = {
            capability,
            languageOptions: ['English', 'Hindi'],
          }
          fs.writeFileSync(configPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
          logger.info('Wrote app-config for', slug, '->', configPath)
        } catch (e) {
          logger.error('Failed to write app-config for', slug, e)
        }

        resolve(
          NextResponse.json({
            success: true,
            slug,
            output,
          })
        );
      }
    });
  });
}
