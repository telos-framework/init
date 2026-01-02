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

    it('should report initialized status when telos specs exist', async () => {
      // Create 4-level SDD structure
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L4-purpose'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, 'telos', 'specs', 'L4-purpose', 'purpose.md'),
        '# L4: Purpose\nTest purpose'
      );
      await fs.writeFile(
        path.join(testDir, 'telos', '.telosrc.json'),
        JSON.stringify({ enforcement: { specs: 'hard' } })
      );

      await statusCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('initialized');
    });

    it('should count spec files when present', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L4-purpose'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L1-function'), { recursive: true });
      
      await fs.writeFile(path.join(testDir, 'telos', 'specs', 'L4-purpose', 'purpose.md'), '# L4');
      await fs.writeFile(path.join(testDir, 'telos', 'specs', 'L1-function', 'auth.md'), '# L1');
      await fs.writeFile(
        path.join(testDir, 'telos', '.telosrc.json'),
        JSON.stringify({ enforcement: { specs: 'hard' } })
      );

      await statusCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('Specs');
    });

    it('should show config when available', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L4-purpose'), { recursive: true });
      await fs.mkdir(path.join(testDir, '.telos'), { recursive: true });
      
      await fs.writeFile(path.join(testDir, 'telos', 'specs', 'L4-purpose', 'purpose.md'), '# Telos');
      await fs.writeFile(
        path.join(testDir, 'telos', '.telosrc.json'),
        JSON.stringify({ enforcement: { specs: 'hard' } })
      );
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

    it('should validate telos SDD structure', async () => {
      // Create 4-level SDD structure
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L4-purpose'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L3-experience'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L2-contract'), { recursive: true });
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L1-function'), { recursive: true });
      
      await fs.writeFile(
        path.join(testDir, 'telos', 'specs', 'L4-purpose', 'purpose.md'),
        `<!-- telos-metadata
id: L4:purpose
level: 4
title: Test Project
-->
# L4: Purpose
Test purpose`
      );

      await fs.writeFile(
        path.join(testDir, 'telos', '.telosrc.json'),
        JSON.stringify({ enforcement: { specs: 'hard', links: 'hard', tests: 'hard', orphans: 'soft' } })
      );

      await fs.writeFile(path.join(testDir, 'AGENTS.md'), '# AI Agent Instructions\n');

      await validateCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toContain('Spec Structure');
      expect(output).toContain('L4 Purpose');
      expect(output).toContain('Configuration');
      expect(output).toContain('Platform Setup');
    });

    it('should fail when L4 purpose is missing', async () => {
      await fs.mkdir(path.join(testDir, 'telos', 'specs', 'L4-purpose'), { recursive: true });
      await fs.writeFile(
        path.join(testDir, 'telos', '.telosrc.json'),
        JSON.stringify({ enforcement: { specs: 'hard' } })
      );

      await validateCommand({});
      
      const calls = consoleLogSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');
      
      expect(output).toMatch(/failed|✗|not found/i);
    });
  });
});
