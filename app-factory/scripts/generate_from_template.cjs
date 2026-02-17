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

// Lightweight logger shim for this script — forwards to console and avoids
// ReferenceError when running in environments where `logger` isn't provided.
const logger = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }) } catch (e) {}
}

async function copyRecursive(src, dest) {
  logger.log("Copy Recusrsive", src, dest);
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

/**
 * Ensure a minimal services/capabilityClient.ts exists in the generated app.
 * This prevents validator failures when templates omit a runtime capability client.
 * The stub intentionally throws at runtime to force implementers to replace it.
 * @param {string} dest - absolute path to the generated app folder
 */
async function ensureCapabilityClientStub(dest) {
  try {
    const servicesDir = path.join(dest, 'services')
    const stubPath = path.join(servicesDir, 'capabilityClient.ts')
    try {
      await fs.access(stubPath)
      // stub already present
      logger.log('Capability client exists:', stubPath)
      return
    } catch (e) {
      // missing -> create
    }
    await fs.mkdir(servicesDir, { recursive: true })
    const now = new Date().toISOString()
    const stubContent = `/**\n * FILE OBJECTIVE:\n * - Minimal runtime stub for capability client used by generated apps.\n *\n * LINKED UNIT TEST:\n * - tests/unit/app-factory/scripts/generate_from_template.spec.ts\n *\n * EDIT LOG:\n * - ${now} | generator | created runtime stub for services/capabilityClient.ts to avoid validation failure\n */\n\nexport async function callCapability(capabilityName: string, payload: any): Promise<any> {\n  throw new Error('callCapability() stub: replace with real capability client in generated app.');\n}\n`
    await fs.writeFile(stubPath, stubContent, 'utf8')
    logger.log('Wrote capability client stub at', stubPath)
  } catch (err) {
    logger.error('Failed to create capability client stub:', err)
    // do not rethrow; generation should continue and validation will handle failures
  }
}

async function main() {
  logger.log('Starting generation from template...')
  console.log('Note: This script only copies files and does not perform validation. Run generate_and_validate.cjs for end-to-end generation with validation and cleanup on failure.')
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: node generate_from_template.cjs <templatePath> <destinationPath>')
    process.exit(2)
  }
  const template = path.resolve(args[0])
  const dest = path.resolve(args[1])
  const capability = args[2] || 'TODO_SELECT_CAPABILITY'
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
        capability: capability,
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
    logger.log("UPDATING REGISTRY FOR", appName);
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
      // Insert before the first closing `};` occurrence so we don't rely on EOF layout
      const insertPosition = registryContent.indexOf('};')
      if (insertPosition === -1) {
        console.error('Registry format invalid — could not find insertion point')
      } else {
        const updated = registryContent.slice(0, insertPosition) + newEntry + registryContent.slice(insertPosition)
        fsSync.writeFileSync(registryPath, updated, 'utf8')
        console.log('Updated registry with', appName)
      }
    } else {
      console.log('Registry already contains', appName)
    }
  } catch (e) {
    console.error('Failed to update registry:', e)
  }

  console.log('Done')
}

// Expose helpers for unit tests
module.exports = {
  main,
  copyRecursive,
  ensureCapabilityClientStub,
}

if (require.main === module) main().catch((err) => { console.error(err); process.exit(1) })
