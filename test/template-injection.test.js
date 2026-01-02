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
    
    // Should contain SDD core content that was injected
    expect(agentsContent).toContain('TELOS FRAMEWORK - REQUIRED READING');
    expect(agentsContent).toContain('Spec-Driven Development (SDD)');
    expect(agentsContent).toContain('L4');
    expect(agentsContent).toContain('L3');
    expect(agentsContent).toContain('L2');
    expect(agentsContent).toContain('L1');
    expect(agentsContent).toContain('@telos');
    expect(agentsContent).toContain('TDD Workflow');
    expect(agentsContent).toContain('BEFORE Writing Any Code');
  });

  it('should create CLAUDE.md with reference to AGENTS.md', async () => {
    await setupMemoryFiles(testDir, ['claude']);
    
    const claudeContent = await fs.readFile(path.join(testDir, 'CLAUDE.md'), 'utf-8');
    
    // Should reference AGENTS.md for complete instructions
    expect(claudeContent).toContain('AGENTS.md');
    expect(claudeContent).toContain('/telos-init');
    expect(claudeContent).toContain('/telos-validate');
    expect(claudeContent).toContain('@telos');
    
    // Should be much shorter than before (no duplication)
    const lines = claudeContent.split('\n').length;
    expect(lines).toBeLessThan(80); // Should be concise
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
    expect(agentsContent).toContain('Spec-Driven Development (SDD)');
    expect(agentsContent).toContain('BEFORE Writing Any Code');
    expect(agentsContent).toContain('Code Annotation Requirements');
    
    // CLAUDE.md should NOT have the full core content (just reference it)
    expect(claudeContent).not.toContain('BEFORE Writing Any Code');
    expect(claudeContent).not.toContain('Code Annotation Requirements');
    
    // CLAUDE.md should reference AGENTS.md
    expect(claudeContent).toContain('AGENTS.md');
  });

  it('should use CLAUDE.md template for other platforms', async () => {
    await setupMemoryFiles(testDir, ['cursor']);
    
    const cursorContent = await fs.readFile(path.join(testDir, '.cursorrules'), 'utf-8');
    
    // Should be based on CLAUDE.md template
    expect(cursorContent).toContain('Project Context for Claude');
    expect(cursorContent).toContain('AGENTS.md');
    expect(cursorContent).toContain('@telos');
  });
});
