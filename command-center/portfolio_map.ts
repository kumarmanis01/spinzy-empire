/* eslint-disable no-console, @typescript-eslint/no-unused-vars */
import fs from 'fs/promises'
import path from 'path'

/**
 * Portfolio map entry for a generated app
 */
export type AppEntry = {
  app: string
  filePath: string
  capability?: string
  status: 'ok' | 'invalid'
  errors?: string[]
}

/**
 * Portfolio map keyed by capability name
 */
export type PortfolioMap = Record<string, AppEntry[]>

/**
 * Build a portfolio map by reading app-config JSON files under `app-factory/app-config`.
 *
 * Rules:
 * - Each JSON file is expected to be named `<appName>.json`
 * - The config should contain either `capability: string` or `capabilities: string[]`.
 * - This utility makes no network or DB calls.
 */
export async function buildPortfolioMap(configDir?: string): Promise<PortfolioMap> {
  const dir = configDir ? path.resolve(configDir) : path.resolve(process.cwd(), 'app-factory', 'app-config')
  const map: PortfolioMap = {}
  let entries: string[] = []
  try {
    const stuff = await fs.readdir(dir, { withFileTypes: true })
    entries = stuff.filter((d) => d.isFile() && d.name.endsWith('.json')).map((d) => d.name)
  } catch (e) {
    // No config dir — return empty map
    return map
  }

  for (const fileName of entries) {
    const filePath = path.join(dir, fileName)
    const app = path.basename(fileName, '.json')
    const entry: AppEntry = { app, filePath, status: 'ok' }
    try {
      const raw = await fs.readFile(filePath, 'utf8')
      const obj = JSON.parse(raw)
      const errors: string[] = []
      let capability: string | undefined
      if (typeof obj.capability === 'string') {
        capability = obj.capability
      } else if (Array.isArray(obj.capabilities)) {
        if (obj.capabilities.length === 1) capability = String(obj.capabilities[0])
        else if (obj.capabilities.length > 1) {
          // keep first but mark as warning
          capability = String(obj.capabilities[0])
          errors.push(`config has ${obj.capabilities.length} capabilities; expected exactly 1`)
        }
      } else {
        errors.push('no capability found in config')
      }

      if (errors.length) {
        entry.status = 'invalid'
        entry.errors = errors
      }
      entry.capability = capability

      const key = capability || 'unknown'
      if (!map[key]) map[key] = []
      map[key].push(entry)
    } catch (err) {
      entry.status = 'invalid'
      entry.errors = [(err as Error).message]
      const key = 'invalid'
      if (!map[key]) map[key] = []
      map[key].push(entry)
    }
  }

  return map
}

/**
 * Convenience: return a simple capability -> app name list mapping.
 */
export async function buildCapabilityAppList(configDir?: string): Promise<Record<string, string[]>> {
  const map = await buildPortfolioMap(configDir)
  const out: Record<string, string[]> = {}
  for (const [cap, apps] of Object.entries(map)) {
    out[cap] = apps.map((a) => a.app)
  }
  return out
}

/**
 * Example CLI runner (when executed with ts-node). Not required by any runtime.
 */
if (require.main === module) {
  ;(async () => {
    const map = await buildCapabilityAppList()
    // Print a compact JSON map to stdout
    console.log(JSON.stringify(map, null, 2))
  })()
}
