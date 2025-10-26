import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const { setupMemoryFiles } = require('../lib/installers/memory-files.js');

describe('Template Injection', () => {
  let testDir;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telos-template-injection-'));
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should inject TELOS_CORE content into AGENTS.md', async () => {
    await setupMemoryFiles(testDir, ['other']);
    
    const agentsContent = await fs.readFile(path.join(testDir, 'AGENTS.md'), 'utf-8');
    
    // Should NOT contain the placeholder
    expect(agentsContent).not.toContain('{{TELOS_CORE}}');
    
    // Should contain core content that was injected
    expect(agentsContent).toContain('⚠️ TELOS FRAMEWORK - REQUIRED READING ⚠️');
    expect(agentsContent).toContain('HARD REQUIREMENT: Validate Before Any Significant Change');
    expect(agentsContent).toContain('Framework upgrades');
    expect(agentsContent).toContain('Dependency changes');
    expect(agentsContent).toContain('BEFORE Starting Work');
    expect(agentsContent).toContain('DURING Work');
    expect(agentsContent).toContain('BEFORE Committing');
    expect(agentsContent).toContain('Todo System Integration');
    expect(agentsContent).toContain('Agent Responsibilities');
  });

  it('should create CLAUDE.md with reference to AGENTS.md', async () => {
    await setupMemoryFiles(testDir, ['claude']);
    
    const claudeContent = await fs.readFile(path.join(testDir, 'CLAUDE.md'), 'utf-8');
    
    // Should reference AGENTS.md for complete instructions
    expect(claudeContent).toContain('AGENTS.md');
    expect(claudeContent).toContain('Claude-Specific Commands');
    expect(claudeContent).toContain('/telos-init');
    expect(claudeContent).toContain('/telos-validate');
    
    // Should be much shorter than before (no duplication)
    const lines = claudeContent.split('\n').length;
    expect(lines).toBeLessThan(50); // Should be concise
  });

  it('should create both AGENTS.md and CLAUDE.md for claude platform', async () => {
    // When 'other' is not selected, AGENTS.md might not be created unless explicitly needed
    // Let's test with 'other' + 'claude' to ensure both exist
    await setupMemoryFiles(testDir, ['other', 'claude']);
    
    const agentsExists = await fs.access(path.join(testDir, 'AGENTS.md'))
      .then(() => true)
      .catch(() => false);
    const claudeExists = await fs.access(path.join(testDir, 'CLAUDE.md'))
      .then(() => true)
      .catch(() => false);
    
    expect(agentsExists).toBe(true);
    expect(claudeExists).toBe(true);
  });

  it('should have core content only in AGENTS.md, not duplicated in CLAUDE.md', async () => {
    await setupMemoryFiles(testDir, ['other', 'claude']);
    
    const agentsContent = await fs.readFile(path.join(testDir, 'AGENTS.md'), 'utf-8');
    const claudeContent = await fs.readFile(path.join(testDir, 'CLAUDE.md'), 'utf-8');
    
    // AGENTS.md should have the full core content
    expect(agentsContent).toContain('HARD REQUIREMENT: Validate Before Any Significant Change');
    expect(agentsContent).toContain('BEFORE Starting Work');
    
    // CLAUDE.md should NOT have the full core content (just reference it)
    expect(claudeContent).not.toContain('HARD REQUIREMENT: Validate Before Any Significant Change');
    expect(claudeContent).not.toContain('BEFORE Starting Work');
    
    // CLAUDE.md should reference AGENTS.md
    expect(claudeContent).toContain('AGENTS.md');
  });

  it('should use CLAUDE.md template for other platforms', async () => {
    await setupMemoryFiles(testDir, ['cursor']);
    
    const cursorContent = await fs.readFile(path.join(testDir, '.cursorrules'), 'utf-8');
    
    // Should be based on CLAUDE.md template
    expect(cursorContent).toContain('Project Context for Claude');
    expect(cursorContent).toContain('AGENTS.md');
  });
});
