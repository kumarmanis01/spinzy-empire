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
  const appName = path.basename(dest)
  console.log('Copying template', template, '->', dest)
  await copyRecursive(template, dest)
  // Ensure a matching app-config JSON exists (do not overwrite existing)
  try {
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

  // Post-process generated files: replace template placeholder import/comment
  // with a relative import path to the created app-config JSON.
  try {
    const replaceInFiles = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const e of entries) {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) {
          await replaceInFiles(p)
          continue
        }
        if (!/\.(ts|tsx|js|jsx)$/.test(e.name)) continue
        let content = String(await fs.readFile(p, 'utf8'))
        const placeholderImport = "import config from '@/app-factory/app-config/${APP_NAME}.json';"
        const placeholderComment = 'import config from \'@/app-factory/app-config/${APP_NAME}.json\';'
        if (content.includes("${APP_NAME}.json") || content.includes(placeholderImport)) {
          // compute relative path from file to app-factory/app-config/<appName>.json
          const target = path.resolve(process.cwd(), 'app-factory', 'app-config', `${appName}.json`)
          let rel = path.relative(path.dirname(p), target).replace(/\\/g, '/')
          if (!rel.startsWith('.')) rel = './' + rel
          const importLine = `import config from '${rel}';`
          // Replace explicit placeholder import if present
          if (content.indexOf(placeholderImport) !== -1) {
            content = content.replace(placeholderImport, importLine)
          }
          // Replace commented TEMPLATE PLACEHOLDER block if it contains the example import
          const tplRegex = /\/\* TEMPLATE PLACEHOLDER:[\s\S]*?\*\//g
          if (tplRegex.test(content)) {
            content = content.replace(tplRegex, importLine)
          }
          await fs.writeFile(p, content, 'utf8')
          console.log('Patched placeholder in', p)
        }
      }
    }
    await replaceInFiles(dest)
  } catch (e) {
    console.error('Post-process placeholder replacement failed:', e)
  }

  // Update registry.ts to include the new app so runtime imports are static-analysable.
  try {
    const fsSync = require('fs')
    const registryPath = path.resolve(process.cwd(), 'app-factory', 'generated-apps', 'registry.ts')
    const newEntry = `  "${appName}": () => import("./${appName}/onboarding/App"),\n`

    let registryContent = ''
    if (!fsSync.existsSync(registryPath)) {
      registryContent = 'export const GeneratedApps: Record<string, () => Promise<any>> = {\n};\n'
      fsSync.writeFileSync(registryPath, registryContent, 'utf8')
    }

    registryContent = fsSync.readFileSync(registryPath, 'utf8')
    if (!registryContent.includes(`"${appName}"`)) {
      // Insert before the closing `};` token
      const updated = registryContent.replace(/\};\s*$/, `${newEntry}};`)
      fsSync.writeFileSync(registryPath, updated, 'utf8')
      console.log('Updated registry with', appName)
    } else {
      console.log('Registry already contains', appName)
    }
  } catch (e) {
    console.error('Failed to update registry:', e)
  }

  console.log('Done')
}

if (require.main === module) main().catch((err) => { console.error(err); process.exit(1) })
