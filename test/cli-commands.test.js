import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { statusCommand } from '../lib/commands/status.js';
import { validateCommand } from '../lib/commands/validate.js';

describe('CLI Commands', () => {
  let testDir;
  let originalCwd;
  let consoleLogSpy;
  let exitSpy;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telos-test-'));
    originalCwd = process.cwd();
    process.chdir(testDir);
    
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(testDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe('status command', () => {
    it('should report not initialized when no telos directory exists', async () => {
      await statusCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('not initialized');
    });

    it('should report initialized status when telos exists', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'content'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, 'telos', 'content', 'TELOS.md'),
        '# Project Telos\n## L9: Ultimate Purpose\nTest purpose'
      );

      await statusCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('initialized');
    });

    it('should count agent files when present', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'content'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'agents'), { recursive: true });
      
      await fs.writeFile(path.join(testDir, 'telos', 'content', 'TELOS.md'), '# Telos');
      await fs.writeFile(path.join(testDir, 'telos', 'agents', 'l1-syntax.md'), '# L1');
      await fs.writeFile(path.join(testDir, 'telos', 'agents', 'l2-function.md'), '# L2');

      await statusCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('Agents');
      expect(output).toContain('2');
    });

    it('should show config when available', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'content'), { recursive: true });
      await fs.mkdir(path.join(testDir, '.telos'), { recursive: true });
      
      await fs.writeFile(path.join(testDir, 'telos', 'content', 'TELOS.md'), '# Telos');
      await fs.writeFile(
        path.join(testDir, '.telos', 'config.json'),
        JSON.stringify({
          platform: 'claude',
          timestamp: new Date().toISOString()
        })
      );

      await statusCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('claude');
    });
  });

  describe('validate command', () => {
    it('should fail when telos not initialized', async () => {
      await validateCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('not initialized');
    });

    it('should validate telos hierarchy', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'content'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'agents'), { recursive: true });
      
      await fs.writeFile(
        path.join(testDir, 'telos', 'content', 'TELOS.md'),
        `# Project Telos
## L9: Ultimate Purpose
Strategic purpose
## L8: Business Context
Business goals
## L1: Syntax
Code standards`
      );

      await fs.writeFile(path.join(testDir, 'telos', 'content', 'TOOLS.md'), '## Tools by Agent Level\n');
      await fs.writeFile(path.join(testDir, 'telos', 'content', 'AGENTS.md'), '# Agents\n');

      for (let i = 1; i <= 9; i++) {
        await fs.writeFile(
          path.join(testDir, 'telos', 'agents', `l${i}-agent.md`),
          `# L${i} Agent`
        );
      }

      await validateCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('Telos Hierarchy');
      expect(output).toContain('Agent Definitions');
      expect(output).toContain('Tool Configuration');
      expect(output).toContain('Platform Setup');
    });

    it('should fail when agents are missing', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'content'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'agents'), { recursive: true });
      
      await fs.writeFile(path.join(testDir, 'telos', 'content', 'TELOS.md'), '## L9:\n## L1:');
      await fs.writeFile(path.join(testDir, 'telos', 'agents', 'l1-agent.md'), '# L1');

      await validateCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toMatch(/failed|✗/);
    });
  });
});
