import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Note: Using CommonJS require since init.js is CommonJS
const { detectExistingInstallation } = require('../lib/commands/init.js');

describe('Re-initialization Detection', () => {
  let testDir;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telos-reinit-test-'));
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should detect no existing installation in fresh directory', async () => {
    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(false);
    expect(result.hasClaudeCommands).toBe(false);
    expect(result.hasOpencodeCommands).toBe(false);
    expect(result.hasConfigFiles).toBe(false);
    expect(result.detectedPlatforms).toEqual([]);
  });

  it('should detect existing Claude Code installation', async () => {
    const claudeDir = path.join(testDir, '.claude', 'commands', 'telos');
    await fs.mkdir(claudeDir, { recursive: true });
    await fs.writeFile(path.join(claudeDir, 'init.md'), '# Test');

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(true);
    expect(result.hasClaudeCommands).toBe(true);
    expect(result.detectedPlatforms).toContain('claude');
  });

  it('should detect existing Opencode installation', async () => {
    const opencodeDir = path.join(testDir, '.opencode', 'command');
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, 'telos-init.md'), '# Test');

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(true);
    expect(result.hasOpencodeCommands).toBe(true);
    expect(result.detectedPlatforms).toContain('opencode');
  });

  it('should detect existing CLAUDE.md with Telos content', async () => {
    await fs.writeFile(
      path.join(testDir, 'CLAUDE.md'),
      '# My Project\n\n# Telos Framework\n\nSee `.telos/TELOS.md`'
    );

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(true);
    expect(result.hasConfigFiles).toBe(true);
    expect(result.detectedPlatforms).toContain('claude');
  });

  it('should detect existing AGENTS.md with Telos content', async () => {
    await fs.writeFile(
      path.join(testDir, 'AGENTS.md'),
      '# Agents\n\n# Telos Framework\n\nReference `.telos/TELOS.md`'
    );

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(true);
    expect(result.hasConfigFiles).toBe(true);
    expect(result.detectedPlatforms).toContain('other');
  });

  it('should detect multiple platform installations', async () => {
    // Create Claude commands
    const claudeDir = path.join(testDir, '.claude', 'commands', 'telos');
    await fs.mkdir(claudeDir, { recursive: true });
    await fs.writeFile(path.join(claudeDir, 'init.md'), '# Test');

    // Create Cursor config
    await fs.writeFile(
      path.join(testDir, '.cursorrules'),
      '# Telos Framework\n\nReference `.telos/TELOS.md`'
    );

    // Create Gemini config
    await fs.writeFile(
      path.join(testDir, 'GEMINI.md'),
      '# Telos Framework\n\nReference `.telos/TELOS.md`'
    );

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(true);
    expect(result.hasClaudeCommands).toBe(true);
    expect(result.hasConfigFiles).toBe(true);
    expect(result.detectedPlatforms).toContain('claude');
    expect(result.detectedPlatforms).toContain('cursor');
    expect(result.detectedPlatforms).toContain('gemini');
    expect(result.detectedPlatforms.length).toBeGreaterThanOrEqual(3);
  });

  it('should not detect CLAUDE.md without Telos content', async () => {
    await fs.writeFile(
      path.join(testDir, 'CLAUDE.md'),
      '# My Project\n\nSome regular content'
    );

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(false);
    expect(result.hasConfigFiles).toBe(false);
    expect(result.detectedPlatforms).toEqual([]);
  });

  it('should ignore .opencode/command without telos- prefixed files', async () => {
    const opencodeDir = path.join(testDir, '.opencode', 'command');
    await fs.mkdir(opencodeDir, { recursive: true });
    await fs.writeFile(path.join(opencodeDir, 'some-other.md'), '# Test');

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(false);
    expect(result.hasOpencodeCommands).toBe(false);
  });

  it('should detect all platform-specific config files', async () => {
    const platforms = [
      { file: '.cursorrules', platform: 'cursor' },
      { file: '.clinerules', platform: 'cline' },
      { file: '.windsurfrules', platform: 'windsurf' },
      { file: '.roocode', platform: 'roo' }
    ];

    for (const { file, platform } of platforms) {
      await fs.writeFile(
        path.join(testDir, file),
        '# Telos Framework\n\nReference `.telos/TELOS.md`'
      );
    }

    const result = await detectExistingInstallation(testDir);
    
    expect(result.hasExisting).toBe(true);
    expect(result.hasConfigFiles).toBe(true);
    expect(result.detectedPlatforms).toContain('cursor');
    expect(result.detectedPlatforms).toContain('cline');
    expect(result.detectedPlatforms).toContain('windsurf');
    expect(result.detectedPlatforms).toContain('roo');
  });
});
