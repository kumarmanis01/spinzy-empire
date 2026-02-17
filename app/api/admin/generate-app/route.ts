import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { logger } from '@sentry/nextjs';

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
