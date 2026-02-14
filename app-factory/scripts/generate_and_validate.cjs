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
  run(process.execPath, ['--loader', 'ts-node/esm', path.join(__dirname, 'validate_generated_app.ts'), dest])
}

if (require.main === module) main()
