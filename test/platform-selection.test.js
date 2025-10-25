import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { installSlashCommands } from '../lib/installers/slash-commands.js';
import { setupMemoryFiles } from '../lib/installers/memory-files.js';

describe('Platform Selection', () => {
  let testDir;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telos-platform-test-'));
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('installSlashCommands', () => {
    it('should install commands for Claude Code platform', async () => {
      const results = await installSlashCommands(testDir, ['claude']);
      
      expect(results).toHaveLength(1);
      expect(results[0].platform).toBe('claude');
      expect(results[0].results).toHaveLength(5);
      
      const claudeDir = path.join(testDir, '.claude', 'commands', 'telos');
      const files = await fs.readdir(claudeDir);
      expect(files).toContain('init.md');
      expect(files).toContain('quick.md');
      expect(files).toContain('validate.md');
      expect(files).toContain('status.md');
      expect(files).toContain('reset.md');
      
      const initContent = await fs.readFile(path.join(claudeDir, 'init.md'), 'utf-8');
      expect(initContent).toContain('Telos Initialization');
    });

    it('should install commands for Opencode platform with frontmatter', async () => {
      const results = await installSlashCommands(testDir, ['opencode']);
      
      expect(results).toHaveLength(1);
      expect(results[0].platform).toBe('opencode');
      expect(results[0].results).toHaveLength(5);
      
      const opencodeDir = path.join(testDir, '.opencode', 'command', 'telos');
      const files = await fs.readdir(opencodeDir);
      expect(files).toContain('init.md');
      
      const initContent = await fs.readFile(path.join(opencodeDir, 'init.md'), 'utf-8');
      expect(initContent).toMatch(/^---\ndescription: Initialize Telos multi-agent system/);
      expect(initContent).toContain('---');
    });

    it('should install commands for multiple platforms', async () => {
      const results = await installSlashCommands(testDir, ['claude', 'opencode']);
      
      expect(results).toHaveLength(2);
      expect(results.map(r => r.platform)).toContain('claude');
      expect(results.map(r => r.platform)).toContain('opencode');
      
      const claudeDir = path.join(testDir, '.claude', 'commands', 'telos');
      const opencodeDir = path.join(testDir, '.opencode', 'command', 'telos');
      
      expect(await fs.access(claudeDir).then(() => true).catch(() => false)).toBe(true);
      expect(await fs.access(opencodeDir).then(() => true).catch(() => false)).toBe(true);
    });

    it('should add frontmatter to all Opencode command files', async () => {
      await installSlashCommands(testDir, ['opencode']);
      
      const opencodeDir = path.join(testDir, '.opencode', 'command', 'telos');
      const files = ['init.md', 'quick.md', 'validate.md', 'status.md', 'reset.md'];
      
      for (const file of files) {
        const content = await fs.readFile(path.join(opencodeDir, file), 'utf-8');
        expect(content).toMatch(/^---\ndescription: .+\n---/);
      }
    });
  });

  describe('setupMemoryFiles', () => {
    it('should create CLAUDE.md when Claude platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['claude']);
      
      expect(results.claude).toBeDefined();
      expect(results.claude.created || results.claude.updated).toBe(true);
      
      const claudeMdPath = path.join(testDir, 'CLAUDE.md');
      const exists = await fs.access(claudeMdPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
      
      const content = await fs.readFile(claudeMdPath, 'utf-8');
      expect(content).toContain('Telos Framework');
    });

    it('should create .cursorrules when Cursor platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['cursor']);
      
      expect(results.cursor).toBeDefined();
      expect(results.cursor.created).toBe(true);
      
      const cursorRulesPath = path.join(testDir, '.cursorrules');
      const exists = await fs.access(cursorRulesPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
      
      const content = await fs.readFile(cursorRulesPath, 'utf-8');
      expect(content).toContain('Telos Framework');
    });

    it('should create .clinerules when Cline platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['cline']);
      
      expect(results.cline).toBeDefined();
      expect(results.cline.created).toBe(true);
      
      const clineRulesPath = path.join(testDir, '.clinerules');
      const exists = await fs.access(clineRulesPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });

    it('should create .windsurfrules when Windsurf platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['windsurf']);
      
      expect(results.windsurf).toBeDefined();
      expect(results.windsurf.created).toBe(true);
      
      const windsurfRulesPath = path.join(testDir, '.windsurfrules');
      const exists = await fs.access(windsurfRulesPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });

    it('should create .roocode when Roo platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['roo']);
      
      expect(results.roo).toBeDefined();
      expect(results.roo.created).toBe(true);
      
      const rooCodePath = path.join(testDir, '.roocode');
      const exists = await fs.access(rooCodePath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });

    it('should create GEMINI.md when Gemini platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['gemini']);
      
      expect(results.gemini).toBeDefined();
      expect(results.gemini.created).toBe(true);
      
      const geminiMdPath = path.join(testDir, 'GEMINI.md');
      const exists = await fs.access(geminiMdPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });

    it('should create AGENTS.md when "other" platform selected', async () => {
      const results = await setupMemoryFiles(testDir, ['other']);
      
      expect(results.agents).toBeDefined();
      expect(results.agents.created).toBe(true);
      
      const agentsMdPath = path.join(testDir, 'AGENTS.md');
      const exists = await fs.access(agentsMdPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
      
      const content = await fs.readFile(agentsMdPath, 'utf-8');
      expect(content).toContain('Telos Framework');
    });

    it('should create multiple config files for multiple platforms', async () => {
      const results = await setupMemoryFiles(testDir, ['claude', 'cursor', 'gemini']);
      
      expect(results.claude).toBeDefined();
      expect(results.cursor).toBeDefined();
      expect(results.gemini).toBeDefined();
      
      const claudeExists = await fs.access(path.join(testDir, 'CLAUDE.md')).then(() => true).catch(() => false);
      const cursorExists = await fs.access(path.join(testDir, '.cursorrules')).then(() => true).catch(() => false);
      const geminiExists = await fs.access(path.join(testDir, 'GEMINI.md')).then(() => true).catch(() => false);
      
      expect(claudeExists).toBe(true);
      expect(cursorExists).toBe(true);
      expect(geminiExists).toBe(true);
    });

    it('should update existing config file with Telos content', async () => {
      const claudeMdPath = path.join(testDir, 'CLAUDE.md');
      await fs.writeFile(claudeMdPath, '# Existing Claude Config\n\nSome custom rules here.');
      
      const results = await setupMemoryFiles(testDir, ['claude']);
      
      expect(results.claude.updated).toBe(true);
      expect(results.claude.created).toBe(false);
      
      const content = await fs.readFile(claudeMdPath, 'utf-8');
      expect(content).toContain('Telos Framework');
      expect(content).toContain('Some custom rules here');
    });

    it('should not duplicate Telos content if already present', async () => {
      const claudeMdPath = path.join(testDir, 'CLAUDE.md');
      await fs.writeFile(claudeMdPath, '# Telos Framework\n\nAlready initialized');
      
      const results = await setupMemoryFiles(testDir, ['claude']);
      
      expect(results.claude.reason).toBe('already-exists');
      expect(results.claude.created).toBe(false);
      expect(results.claude.updated).toBe(false);
      
      const content = await fs.readFile(claudeMdPath, 'utf-8');
      const telosCount = (content.match(/Telos Framework/g) || []).length;
      expect(telosCount).toBe(1);
    });

    it('should prepend Telos content to existing files', async () => {
      const cursorRulesPath = path.join(testDir, '.cursorrules');
      await fs.writeFile(cursorRulesPath, 'Existing cursor rules\nMore rules');
      
      const results = await setupMemoryFiles(testDir, ['cursor']);
      
      expect(results.cursor.updated).toBe(true);
      
      const content = await fs.readFile(cursorRulesPath, 'utf-8');
      const telosIndex = content.indexOf('Telos Framework');
      const existingIndex = content.indexOf('Existing cursor rules');
      
      expect(telosIndex).toBeLessThan(existingIndex);
    });

    it('should handle empty platforms array gracefully', async () => {
      const results = await setupMemoryFiles(testDir, []);
      
      expect(results.agents).toBeDefined();
      expect(results.agents.created).toBe(true);
    });
  });

  describe('Command content validation', () => {
    it('should preserve command content for Claude', async () => {
      await installSlashCommands(testDir, ['claude']);
      
      const claudeDir = path.join(testDir, '.claude', 'commands', 'telos');
      const validateContent = await fs.readFile(path.join(claudeDir, 'validate.md'), 'utf-8');
      
      expect(validateContent).toContain('Validate current code against Telos purpose hierarchy');
    });

    it('should have correct frontmatter descriptions for Opencode', async () => {
      await installSlashCommands(testDir, ['opencode']);
      
      const opencodeDir = path.join(testDir, '.opencode', 'command', 'telos');
      
      const quickContent = await fs.readFile(path.join(opencodeDir, 'quick.md'), 'utf-8');
      expect(quickContent).toMatch(/description: Quick Telos initialization with auto-accepted AI proposals/);
      
      const validateContent = await fs.readFile(path.join(opencodeDir, 'validate.md'), 'utf-8');
      expect(validateContent).toMatch(/description: Validate current code against Telos purpose hierarchy/);
      
      const statusContent = await fs.readFile(path.join(opencodeDir, 'status.md'), 'utf-8');
      expect(statusContent).toMatch(/description: Show current Telos configuration and hierarchy/);
      
      const resetContent = await fs.readFile(path.join(opencodeDir, 'reset.md'), 'utf-8');
      expect(resetContent).toMatch(/description: Clear existing Telos installation and reinitialize/);
    });
  });
});
