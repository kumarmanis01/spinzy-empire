/* eslint-disable no-console, @typescript-eslint/no-require-imports */
/**
 * generate_from_template.cjs
 * - Copies a full app template directory into a destination path.
 * - Preserves folder layout exactly and copies all files and subfolders.
 * - Skips files that already exist in the destination (non-destructive).
 * - Ensures `/services/capabilityClient.ts` (and other files) are copied when present
 * Usage: `node generate_from_template.cjs <templatePath> <destinationPath>`
 */
const fs = require('fs').promises
const path = require('path')

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }) } catch (e) {}
}

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    await ensureDir(dest)
    const entries = await fs.readdir(src)
    for (const e of entries) {
      const srcPath = path.join(src, e)
      const destPath = path.join(dest, e)
      try {
        await fs.access(destPath)
        continue
      } catch (err) {}
      await copyRecursive(srcPath, destPath)
    }
  } else {
    await ensureDir(path.dirname(dest))
    const content = await fs.readFile(src)
    await fs.writeFile(dest, content)
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: node generate_from_template.cjs <templatePath> <destinationPath>')
    process.exit(2)
  }
  const template = path.resolve(args[0])
  const dest = path.resolve(args[1])
  console.log('Copying template', template, '->', dest)
  await copyRecursive(template, dest)
  // Ensure a matching app-config JSON exists (do not overwrite existing)
  try {
    const appName = path.basename(dest)
    const configDir = path.resolve(process.cwd(), 'app-factory', 'app-config')
    const configPath = path.join(configDir, `${appName}.json`)
    try {
      await fs.access(configPath)
      // config exists — preserve it
      console.log('Config exists:', configPath)
    } catch (e) {
      // Create deterministic stub
      await fs.mkdir(configDir, { recursive: true })
      const stub = {
        capability: 'TODO_SELECT_CAPABILITY',
        languageOptions: ['English', 'Hindi']
      }
      const content = JSON.stringify(stub, Object.keys(stub), 2)
      await fs.writeFile(configPath, content + '\n')
      console.log('Created config stub:', configPath)
    }
  } catch (err) {
    console.error('Failed to ensure config stub:', err)
    // Non-fatal — continue
  }

  console.log('Done')
}

if (require.main === module) main().catch((err) => { console.error(err); process.exit(1) })
