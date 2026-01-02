import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const sdd = require('../lib/sdd');

describe('Telos-SDD', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'telos-sdd-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('spec-parser', () => {
    it('should parse spec metadata from content', () => {
      const content = `<!-- telos-metadata
id: L4:purpose
level: 4
title: Test Project
children: [L3:experience:auth]
-->

# L4:purpose: Test Project

## Purpose
This is a test project.
`;

      const metadata = sdd.parseMetadata(content);
      
      expect(metadata).toBeTruthy();
      expect(metadata.id).toBe('L4:purpose');
      expect(metadata.level).toBe(4);
      expect(metadata.title).toBe('Test Project');
      expect(metadata.children).toEqual(['L3:experience:auth']);
      expect(metadata.levelName).toBe('purpose');
    });

    it('should parse spec ID correctly', () => {
      const result = sdd.parseSpecId('L1:function:src/auth/validation:validateToken');
      
      expect(result.valid).toBe(true);
      expect(result.level).toBe(1);
      expect(result.levelName).toBe('function');
      expect(result.path).toBe('src/auth/validation');
      expect(result.name).toBe('validateToken');
    });

    it('should build spec ID from components', () => {
      expect(sdd.buildSpecId(4)).toBe('L4:purpose');
      expect(sdd.buildSpecId(3, 'auth-journey')).toBe('L3:experience:auth-journey');
      expect(sdd.buildSpecId(1, 'src/auth', 'validate')).toBe('L1:function:src/auth:validate');
    });
  });

  describe('spec-index', () => {
    it('should build index from spec files', async () => {
      // Create spec directory structure
      const specsDir = path.join(tempDir, 'telos', 'specs');
      await fs.mkdir(path.join(specsDir, 'L4-purpose'), { recursive: true });

      // Create a spec file
      const specContent = `<!-- telos-metadata
id: L4:purpose
level: 4
title: Test Project
-->

# L4:purpose: Test Project
`;
      await fs.writeFile(
        path.join(specsDir, 'L4-purpose', 'purpose.md'),
        specContent,
        'utf8'
      );

      const index = await sdd.buildIndex(tempDir);

      expect(index.specs['L4:purpose']).toBeTruthy();
      expect(index.specs['L4:purpose'].level).toBe(4);
      expect(index.specs['L4:purpose'].title).toBe('L4:purpose: Test Project');
      expect(index.byLevel[4]).toContain('L4:purpose');
    });

    it('should save and load index', async () => {
      await fs.mkdir(path.join(tempDir, 'telos'), { recursive: true });

      const testIndex = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        specs: { 'L4:purpose': { id: 'L4:purpose', level: 4 } },
        byLevel: { 4: ['L4:purpose'], 3: [], 2: [], 1: [] },
        byPath: {},
        errors: []
      };

      await sdd.saveIndex(tempDir, testIndex);
      const loaded = await sdd.loadIndex(tempDir);

      expect(loaded.specs['L4:purpose']).toBeTruthy();
      expect(loaded.specs['L4:purpose'].level).toBe(4);
    });
  });

  describe('annotation-scanner', () => {
    it('should scan TypeScript file for annotations', async () => {
      const tsContent = `// @telos L1:function:src/test:myFunc
export function myFunc() {
  return true;
}

// @telos-test L1:function:src/test:myFunc
describe('myFunc', () => {
  // @telos-scenario L1:function:src/test:myFunc:success
  it('should succeed', () => {});
});
`;
      const tsFile = path.join(tempDir, 'test.ts');
      await fs.writeFile(tsFile, tsContent, 'utf8');

      const result = await sdd.scanFile(tsFile);

      expect(result.supported).toBe(true);
      expect(result.language).toBe('typescript');
      expect(result.annotations).toHaveLength(3);
      expect(result.annotations[0].type).toBe('telos');
      expect(result.annotations[0].specId).toBe('L1:function:src/test:myFunc');
      expect(result.annotations[1].type).toBe('telos-test');
      expect(result.annotations[2].type).toBe('telos-scenario');
    });

    it('should scan Python file for annotations', async () => {
      const pyContent = `# @telos L1:function:src/utils:helper
def helper():
    pass

# @telos-test L1:function:src/utils:helper
class TestHelper:
    pass
`;
      const pyFile = path.join(tempDir, 'test.py');
      await fs.writeFile(pyFile, pyContent, 'utf8');

      const result = await sdd.scanFile(pyFile);

      expect(result.supported).toBe(true);
      expect(result.language).toBe('python');
      expect(result.annotations).toHaveLength(2);
    });
  });

  describe('spec-templates', () => {
    it('should generate L4 purpose spec', () => {
      const content = sdd.generateSpec(4, {
        title: 'My Project',
        purpose: 'To do amazing things'
      });

      expect(content).toContain('L4:purpose');
      expect(content).toContain('My Project');
      expect(content).toContain('To do amazing things');
      expect(content).toContain('level: 4');
    });

    it('should generate L1 function spec', () => {
      const content = sdd.generateSpec(1, {
        path: 'src/auth',
        title: 'Auth Functions',
        modulePath: 'src/auth.ts',
        functions: [{
          name: 'validate',
          signature: 'function validate(token: string): boolean',
          purpose: 'Validates a token'
        }]
      });

      expect(content).toContain('L1:function:src/auth');
      expect(content).toContain('Auth Functions');
      expect(content).toContain('validate');
      expect(content).toContain('level: 1');
    });
  });

  describe('test-generator', () => {
    it('should parse scenarios from spec content', () => {
      const content = `
## Scenarios

### Scenario: Valid input
- GIVEN a valid token
- WHEN validate is called
- THEN return true

### Scenario: Invalid input
- GIVEN an invalid token
- WHEN validate is called
- THEN return false
- AND log an error
`;

      const scenarios = sdd.parseScenarios(content);

      expect(scenarios).toHaveLength(2);
      expect(scenarios[0].name).toBe('Valid input');
      expect(scenarios[0].given).toContain('a valid token');
      expect(scenarios[0].when).toContain('validate is called');
      expect(scenarios[0].then).toContain('return true');
      
      expect(scenarios[1].name).toBe('Invalid input');
      expect(scenarios[1].then).toHaveLength(2);
    });
  });

  describe('config', () => {
    it('should load default config when none exists', async () => {
      const config = await sdd.loadConfig(tempDir);

      expect(config.enforcement.specs).toBe('hard');
      expect(config.enforcement.links).toBe('hard');
      expect(config.languages.typescript).toBeTruthy();
      expect(config.paths.specs).toBe('telos/specs');
    });

    it('should save and load custom config', async () => {
      await fs.mkdir(path.join(tempDir, 'telos'), { recursive: true });

      await sdd.saveConfig(tempDir, {
        version: '1.0',
        enforcement: { specs: 'soft' }
      });

      const config = await sdd.loadConfig(tempDir);
      expect(config.enforcement.specs).toBe('soft');
    });
  });

  describe('validator', () => {
    it('should validate empty project', async () => {
      await fs.mkdir(path.join(tempDir, 'telos', 'specs'), { recursive: true });
      
      const results = await sdd.validate(tempDir, { all: true });

      expect(results.valid).toBe(false); // No L4:purpose
      expect(results.sections.specs).toBeTruthy();
      expect(results.sections.specs.specCount).toBe(0);
    });

    it('should pass validation with valid L4 purpose', async () => {
      const specsDir = path.join(tempDir, 'telos', 'specs');
      await fs.mkdir(path.join(specsDir, 'L4-purpose'), { recursive: true });

      const specContent = `<!-- telos-metadata
id: L4:purpose
level: 4
title: Test
-->

# L4:purpose: Test
`;
      await fs.writeFile(
        path.join(specsDir, 'L4-purpose', 'purpose.md'),
        specContent,
        'utf8'
      );

      const results = await sdd.validate(tempDir, { specs: true });

      expect(results.sections.specs.specCount).toBe(1);
      expect(results.sections.specs.byLevel[4]).toBe(1);
    });
  });

  describe('context-loader', () => {
    it('should load context for spec with lineage', async () => {
      const specsDir = path.join(tempDir, 'telos', 'specs');
      await fs.mkdir(path.join(specsDir, 'L4-purpose'), { recursive: true });
      await fs.mkdir(path.join(specsDir, 'L3-experience'), { recursive: true });

      // Create L4 spec
      await fs.writeFile(
        path.join(specsDir, 'L4-purpose', 'purpose.md'),
        `<!-- telos-metadata
id: L4:purpose
level: 4
title: Root Purpose
children: [L3:experience:auth]
-->

# L4:purpose: Root Purpose
`,
        'utf8'
      );

      // Create L3 spec
      await fs.writeFile(
        path.join(specsDir, 'L3-experience', 'auth.md'),
        `<!-- telos-metadata
id: L3:experience:auth
level: 3
parent: L4:purpose
title: Auth Journey
-->

# L3:experience:auth: Auth Journey
`,
        'utf8'
      );

      // Build index
      const index = await sdd.buildIndex(tempDir);
      await sdd.saveIndex(tempDir, index);

      const context = await sdd.loadContext(tempDir, 'L3:experience:auth');

      expect(context.targetId).toBe('L3:experience:auth');
      expect(context.lineage).toHaveLength(1);
      expect(context.lineage[0].id).toBe('L4:purpose');
    });
  });
});
