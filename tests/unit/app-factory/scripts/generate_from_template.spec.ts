/**
 * FILE OBJECTIVE:
 * - Unit tests for generate_from_template.cjs ensureCapabilityClientStub helper.
 *
 * LINKED UNIT TEST:
 * - tests/unit/app-factory/scripts/generate_from_template.spec.ts
 *
 * EDIT LOG:
 * - 2026-02-17T00:00:00Z | copilot | added tests for capability client stub creation
 */

import fs from 'fs/promises'
import os from 'os'
import path from 'path'

const generator = require(path.resolve(process.cwd(), 'app-factory', 'scripts', 'generate_from_template.cjs'))

describe('generate_from_template ensureCapabilityClientStub', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gen-test-'))
  })

  afterEach(async () => {
    try { await fs.rm(tmpDir, { recursive: true, force: true }) } catch (e) {}
  })

  it('creates services/capabilityClient.ts when missing', async () => {
    const appDir = path.join(tmpDir, 'my-app')
    await fs.mkdir(appDir, { recursive: true })
    await generator.ensureCapabilityClientStub(appDir)
    const stubPath = path.join(appDir, 'services', 'capabilityClient.ts')
    const stat = await fs.stat(stubPath)
    expect(stat.isFile()).toBe(true)
    const content = await fs.readFile(stubPath, 'utf8')
    expect(content).toContain('export async function callCapability')
  })

  it('does not overwrite existing capability client', async () => {
    const appDir = path.join(tmpDir, 'my-app2')
    const servicesDir = path.join(appDir, 'services')
    await fs.mkdir(servicesDir, { recursive: true })
    const stubPath = path.join(servicesDir, 'capabilityClient.ts')
    await fs.writeFile(stubPath, '// existing implementation', 'utf8')
    await generator.ensureCapabilityClientStub(appDir)
    const content = await fs.readFile(stubPath, 'utf8')
    expect(content).toContain('// existing implementation')
  })
})
