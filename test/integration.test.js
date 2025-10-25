import { describe, it, expect, beforeEach, vi } from 'vitest';
import { McpClient, createMcpClient } from '../lib/integration/mcp-client.js';
import { CapabilityManager } from '../lib/integration/capability-abstraction.js';
import { getDegradationStrategy, createAgentInstructions } from '../lib/integration/graceful-degradation.js';
import { ToolInvoker } from '../lib/integration/tool-invoker.js';
import { writeToolConfig, hasConfigTemplate } from '../lib/integration/tool-config-writers.js';

describe('Tool Integration Layer', () => {
  describe('CapabilityManager', () => {
    it('should identify available capabilities', () => {
      const tools = [
        { name: 'eslint', category: 'linter' },
        { name: 'vitest', category: 'testing' }
      ];
      
      const manager = new CapabilityManager(tools);
      
      expect(manager.hasCapability('static-analysis')).toBe(true);
      expect(manager.hasCapability('unit-testing')).toBe(true);
      expect(manager.hasCapability('e2e-testing')).toBe(false);
    });

    it('should map capabilities to levels', () => {
      const tools = [
        { name: 'eslint', category: 'linter' },
        { name: 'playwright', category: 'e2e' }
      ];
      
      const manager = new CapabilityManager(tools);
      const l1Caps = manager.getCapabilitiesForLevel('L1');
      const l5Caps = manager.getCapabilitiesForLevel('L5');
      
      expect(l1Caps.some(c => c.capability === 'static-analysis' && c.available)).toBe(true);
      expect(l5Caps.some(c => c.capability === 'journey-validation' && c.available)).toBe(true);
    });

    it('should generate capability report', () => {
      const tools = [{ name: 'eslint', category: 'linter' }];
      const manager = new CapabilityManager(tools);
      const report = manager.getReport();
      
      expect(report).toHaveProperty('totalCapabilities');
      expect(report).toHaveProperty('availableCapabilities');
      expect(report).toHaveProperty('missingCapabilities');
      expect(report).toHaveProperty('byLevel');
      expect(report.totalCapabilities).toBeGreaterThan(0);
    });
  });

  describe('Graceful Degradation', () => {
    it('should provide fallback strategies for missing tools', () => {
      const capabilities = {
        'static-analysis': {
          available: false,
          fallback: 'manual-code-review'
        }
      };
      
      const strategy = getDegradationStrategy('static-analysis', capabilities);
      
      expect(strategy).toBeDefined();
      expect(strategy.type).toBe('manual');
      expect(strategy.instructions).toContain('manual');
    });

    it('should create agent instructions for missing tools', () => {
      const capabilities = [
        { capability: 'unit-testing', available: false, fallback: 'manual-testing' },
        { capability: 'static-analysis', available: true, fallback: null }
      ];
      
      const instructions = createAgentInstructions('L2', capabilities);
      
      expect(instructions.hasAllTools).toBe(false);
      expect(instructions.instructions).toHaveLength(1);
      expect(instructions.instructions[0].capability).toBe('unit-testing');
    });

    it('should indicate when all tools are available', () => {
      const capabilities = [
        { capability: 'unit-testing', available: true, fallback: null }
      ];
      
      const instructions = createAgentInstructions('L2', capabilities);
      
      expect(instructions.hasAllTools).toBe(true);
      expect(instructions.instructions).toHaveLength(0);
    });
  });

  describe('ToolInvoker', () => {
    it('should detect available tools', () => {
      const tools = [
        { name: 'eslint', category: 'linter' },
        { name: 'vitest', category: 'testing' }
      ];
      
      const invoker = new ToolInvoker(tools);
      
      expect(invoker.hasTool('eslint')).toBe(true);
      expect(invoker.hasTool('vitest')).toBe(true);
      expect(invoker.hasTool('jest')).toBe(false);
    });

    it('should list available actions for a tool', () => {
      const invoker = new ToolInvoker([{ name: 'eslint' }]);
      const actions = invoker.getAvailableActions('eslint');
      
      expect(actions).toContain('lint');
      expect(actions).toContain('fix');
      expect(actions).toContain('check');
    });

    it('should list all supported tools', () => {
      const invoker = new ToolInvoker([]);
      const tools = invoker.getSupportedTools();
      
      expect(tools).toContain('eslint');
      expect(tools).toContain('prettier');
      expect(tools).toContain('vitest');
      expect(tools).toContain('playwright');
    });
  });

  describe('Tool Config Writers', () => {
    it('should identify tools with config templates', () => {
      expect(hasConfigTemplate('eslint')).toBe(true);
      expect(hasConfigTemplate('prettier')).toBe(true);
      expect(hasConfigTemplate('vitest')).toBe(true);
      expect(hasConfigTemplate('unknown-tool')).toBe(false);
    });

    it('should throw error for unknown tool', async () => {
      await expect(
        writeToolConfig('unknown-tool', '/tmp')
      ).rejects.toThrow('No configuration template');
    });
  });
});
