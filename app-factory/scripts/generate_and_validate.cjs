/*
 * generate_and_validate.cjs
 * - Cross-platform wrapper that runs the template copier then runs the TypeScript validator.
 * - Usage: node generate_and_validate.cjs <templatePath> <destinationPath>
 */
const child = require('child_process')
const path = require('path')

function run(cmd, args) {
  const res = child.spawnSync(cmd, args, { stdio: 'inherit' })
  if (res.error) throw res.error
  if (res.status !== 0) process.exit(res.status)
}

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: node generate_and_validate.cjs <templatePath> <destinationPath>')
    process.exit(2)
  }
  const template = path.resolve(args[0])
  const dest = path.resolve(args[1])

  // 1) Run the template copier
  run(process.execPath, [path.join(__dirname, 'generate_from_template.cjs'), template, dest])

  // 2) Run the TypeScript validator (ts-node/esm loader)
  // Run validator and capture exit code so we can cleanup on failure
  const validator = child.spawnSync(process.execPath, ['--loader', 'ts-node/esm', path.join(__dirname, 'validate_generated_app.ts'), dest], { stdio: 'inherit' })
  if (validator.error) throw validator.error
  if (validator.status !== 0) {
    // Validation failed — perform cleanup to keep generation atomic
    try {
      const slug = path.basename(dest)
      // Delete generated app folder
      console.error(`Validation failed — removing generated app folder: ${dest}`)
      const fs = require('fs')
      fs.rmSync(dest, { recursive: true, force: true })

      // Delete app-config JSON if exists
      const appConfigPath = path.resolve(__dirname, '..', 'app-config', `${slug}.json`)
      if (fs.existsSync(appConfigPath)) {
        console.error(`Removing app-config: ${appConfigPath}`)
        fs.unlinkSync(appConfigPath)
      }

      // Remove slug from registry
      const registryPath = path.resolve(__dirname, '..', 'generated-apps', 'registry.ts')
      if (fs.existsSync(registryPath)) {
        let content = fs.readFileSync(registryPath, 'utf8')
        const lines = content.split(/\r?\n/)
        const filtered = lines.filter(line => !line.includes(`"${slug}"`))
        const newContent = filtered.join('\n')
        fs.writeFileSync(registryPath, newContent, 'utf8')
        console.error(`Removed ${slug} from registry: ${registryPath}`)
      }
    } catch (e) {
      console.error('Cleanup after failed validation encountered an error:', e)
    }

    process.exit(validator.status || 1)
  }
}

if (require.main === module) main()
