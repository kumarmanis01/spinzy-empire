/* eslint-disable no-console, @typescript-eslint/no-unused-vars */
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

type Result = { ok: boolean; messages: string[] }

function fail(msg: string): Result { return { ok: false, messages: [msg] } }
function pass(msg?: string): Result { return { ok: true, messages: msg ? [msg] : [] } }

async function existsDir(p: string) {
  try {
    const st = await fs.stat(p)
    return st.isDirectory()
  } catch (e) { return false }
}

async function existsFile(p: string) {
  try {
    const st = await fs.stat(p)
    return st.isFile()
  } catch (e) { return false }
}

async function readAllFiles(dir: string, exts = ['.ts', '.tsx', '.js', '.jsx']) : Promise<string[]> {
  const out: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const e of entries) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) {
        const sub = await readAllFiles(p, exts)
        out.push(...sub)
      } else if (exts.includes(path.extname(e.name))) {
        out.push(p)
      }
    }
  } catch (e) {}
  return out
}

function findImportSpecs(content: string) {
  const specs: string[] = []
  const importRegex = /import\s+[\s\S]*?from\s+['\"]([^'\"]+)['\"]/g
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(content))) specs.push(m[1])
  const requireRegex = /require\(\s*['\"]([^'\"]+)['\"]\s*\)/g
  while ((m = requireRegex.exec(content))) specs.push(m[1])
  return specs
}

async function validate(dest: string): Promise<Result> {
  const messages: string[] = []
  const name = path.basename(dest)

  // 1. Structure check
  const required = ['onboarding', 'input-screen', 'result-screen', 'progress', 'services']
  const missing: string[] = []
  for (const r of required) {
    const p = path.join(dest, r)
    if (!(await existsDir(p))) missing.push(r)
  }
  if (missing.length) messages.push(`Missing required directories: ${missing.join(', ')}`)

  // 2. Service check
  const capabilityPath = path.join(dest, 'services', 'capabilityClient.ts')
  if (!(await existsFile(capabilityPath))) messages.push('Missing services/capabilityClient.ts')

  // 3. Import check
  const uiDirs = ['onboarding', 'input-screen', 'result-screen', 'progress']
  const importProblems: string[] = []
  for (const d of uiDirs) {
    const p = path.join(dest, d)
    if (!(await existsDir(p))) continue
    const files = await readAllFiles(p)
    for (const f of files) {
      const content = String(await fs.readFile(f))
      const specs = findImportSpecs(content)
      for (const s of specs) {
        if (s.startsWith('.')) {
          const norm = s.replace(/\\/g, '/')
          // Allowed relative imports:
          // - intra-UI imports between onboarding, input-screen, result-screen, progress
          // - ../services/capabilityClient(.ts|.js)
          // - relative imports that point to local app-config JSON (app-config/)
          const intraUiRegex = /^\.\.\/(onboarding|input-screen|result-screen|progress)(\/.*)?$/
          const serviceRegex = /^\.\.\/services\/capabilityClient(\.(ts|js))?$/
          const appConfigPattern = /app-config\//
          if (intraUiRegex.test(norm) || serviceRegex.test(norm) || appConfigPattern.test(norm)) {
            // allowed
          } else {
            importProblems.push(`${path.relative(dest, f)} imports disallowed relative module '${s}'`)
          }
        } else {
          // Non-relative imports: allow packages, but forbid legacy/core/backend paths
          const forbidden = ['@/', '@/lib', 'core-engine', 'prisma', 'worker', 'workers/', '/server', '/dist/', 'database', '/db', 'db/']
          const hit = forbidden.find((p) => s.includes(p) || s.startsWith(p))
          if (hit) {
            importProblems.push(`${path.relative(dest, f)} imports forbidden module '${s}'`)
          }
        }
      }
    }
  }
  if (importProblems.length) messages.push('Import rule violations:\n' + importProblems.join('\n'))

  // 4. Config check: app-factory/app-config/<name>.json must exist and contain exactly one capability
  const configPath = path.join(process.cwd(), 'app-factory', 'app-config', `${name}.json`)
  if (!(await existsFile(configPath))) {
    messages.push(`Missing app-config JSON at app-factory/app-config/${name}.json`)
  } else {
    try {
      const raw = await fs.readFile(configPath, 'utf8')
      const obj = JSON.parse(raw)
      if (Array.isArray(obj.capabilities)) {
        if (obj.capabilities.length !== 1) messages.push(`app-config: 'capabilities' must contain exactly one capability (found ${obj.capabilities.length})`)
      } else if (obj.capability) {
        // single capability field is OK
      } else {
        messages.push("app-config must contain either 'capabilities' (array length 1) or 'capability' (string)")
      }
    } catch (e) {
      messages.push(`Failed to parse app-config JSON: ${(e as Error).message}`)
    }
  }

  if (messages.length) return { ok: false, messages }
  return { ok: true, messages: ['All checks passed'] }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error('Usage: node validate_generated_app.ts <generatedAppPath>')
    process.exit(2)
  }
  const dest = path.resolve(process.cwd(), args[0])
  const res = await validate(dest)
  if (res.ok) {
    console.log('PASS')
    for (const m of res.messages) console.log('-', m)
    process.exit(0)
  } else {
    console.error('FAIL')
    for (const m of res.messages) console.error('-', m)
    process.exit(1)
  }
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) main().catch((e) => { console.error(e); process.exit(1) })
