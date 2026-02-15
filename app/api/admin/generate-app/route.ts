import { NextResponse } from 'next/server';
import { exec } from 'child_process';

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

  const templatePath = 'app-factory/app-template';
  const destPath = `app-factory/generated-apps/${slug}`;

  const command = `npm run generate-app -- ${templatePath} ${destPath}`;

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(
          NextResponse.json({
            success: false,
            error: stderr || error.message,
          })
        );
      } else {
        resolve(
          NextResponse.json({
            success: true,
            slug,
            output: stdout?.toString?.() ?? null,
          })
        );
      }
    });
  });
}
