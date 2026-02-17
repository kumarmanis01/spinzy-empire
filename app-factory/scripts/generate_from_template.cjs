/* eslint-disable no-console, @typescript-eslint/no-require-imports */
/**
 * Strict deterministic generator
 * Rules enforced:
 * 1) Accept args: node generate_from_template.cjs <templatePath> <destPath> <capability>
 * 2) Compute appName = path.basename(destPath)
 * 3) Copy template recursively (overwrite existing files). Fail if dest already exists to avoid partial merges.
 * 4) Replace ${APP_NAME} with appName in all .ts, .tsx, .json files under dest
 * 5) Overwrite app-factory/app-config/<appName>.json with provided capability and humanized title
 * 6) Update registry.ts by inserting entry before first occurrence of '};'
 * 7) This script does not run validation. The wrapper generate_and_validate.cjs is responsible for validation and cleanup.
 */
const fs = require('fs')
const fsp = fs.promises
const path = require('path')

function humanize(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true })
}

async function copyRecursiveOverwrite(src, dest) {
  const stat = await fsp.stat(src)
  if (stat.isDirectory()) {
    await ensureDir(dest)
    const entries = await fsp.readdir(src)
    for (const e of entries) {
      const srcPath = path.join(src, e)
      const destPath = path.join(dest, e)
      await copyRecursiveOverwrite(srcPath, destPath)
    }
  } else {
    await ensureDir(path.dirname(dest))
    const content = await fsp.readFile(src)
    await fsp.writeFile(dest, content)
  }
}

async function replaceAppNamePlaceholders(dir, appName) {
  const entries = await fsp.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      await replaceAppNamePlaceholders(p, appName)
      continue
    }
    if (!/\.(ts|tsx|json)$/.test(e.name)) continue
    let content = String(await fsp.readFile(p, 'utf8'))
    if (content.includes('${APP_NAME}')) {
      content = content.split('${APP_NAME}').join(appName)
      await fsp.writeFile(p, content, 'utf8')
      console.log('Replaced ${APP_NAME} in', p)
    }
  }
}

function writeAppConfigSync(appName, capability) {
  const configDir = path.resolve(process.cwd(), 'app-factory', 'app-config')
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true })
  const configPath = path.join(configDir, `${appName}.json`)
  const payload = {
    capability: capability,
    title: humanize(appName),
    languageOptions: ['English', 'Hindi'],
  }
  fs.writeFileSync(configPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log('Wrote config:', configPath)
}

function updateRegistrySync(appName) {
  const registryPath = path.resolve(process.cwd(), 'app-factory', 'generated-apps', 'registry.ts')
  let content = ''
  if (!fs.existsSync(registryPath)) {
    content = 'export const GeneratedApps: Record<string, () => Promise<any>> = {\n};\n\nexport default GeneratedApps;\n'
    fs.writeFileSync(registryPath, content, 'utf8')
  }
  content = fs.readFileSync(registryPath, 'utf8')
  if (content.includes(`"${appName}"`)) {
    console.log('Registry already contains', appName)
    return
  }
  const newEntry = `  "${appName}": () => import("./${appName}/onboarding/App"),\n`
  const insertPosition = content.indexOf('};')
  if (insertPosition === -1) {
    throw new Error('Registry format invalid — could not find insertion point')
  }
  const updated = content.slice(0, insertPosition) + newEntry + content.slice(insertPosition)
  fs.writeFileSync(registryPath, updated, 'utf8')
  console.log('Updated registry with', appName)
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    console.error('Usage: node generate_from_template.cjs <templatePath> <destinationPath> <capability>')
    process.exit(2)
  }
  const template = path.resolve(args[0])
  const dest = path.resolve(args[1])
  const capability = args[2]
  const appName = path.basename(dest)

  // No partial merges: fail if destination already exists
  if (fs.existsSync(dest)) {
    console.error('Destination already exists — aborting to prevent partial merges:', dest)
    process.exit(1)
  }

  // 1) Copy template recursively (overwrite semantics applied by writing files)
  await copyRecursiveOverwrite(template, dest)
  console.log('Copied template', template, '->', dest)

  // 2) Replace placeholders in .ts/.tsx/.json files: ${APP_NAME} -> appName
  await replaceAppNamePlaceholders(dest, appName)

  // 3) Write app config (always overwrite)
  writeAppConfigSync(appName, capability)

  // 4) Update registry (insert before first '};')
  updateRegistrySync(appName)

  console.log('Done')
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = { main }
 