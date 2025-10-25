import { describe, it, expect } from 'vitest';
import { buildHierarchy } from '../lib/discovery/hierarchy-builder.js';

describe('Telos Discovery', () => {
  describe('buildHierarchy', () => {
    it('should build quick hierarchy with all 9 levels', async () => {
      const telosData = {
        telos: 'Empower creators to share knowledge freely',
        beneficiaries: 'Content creators and learners worldwide',
        impact: 'Million active users sharing knowledge',
        constraints: 'Privacy-first, ad-free'
      };

      const hierarchy = await buildHierarchy(telosData, { quick: true });

      expect(hierarchy).toBeDefined();
      expect(Object.keys(hierarchy)).toHaveLength(9);
      expect(hierarchy.L9.purpose).toBe(telosData.telos);
      expect(hierarchy.L9.beneficiaries).toBe(telosData.beneficiaries);
      expect(hierarchy.L1.level).toBe('L1');
      expect(hierarchy.L5.name).toBe('Journey-Validator');
    });

    it('should include all required fields for each level', async () => {
      const telosData = {
        telos: 'Test purpose',
        beneficiaries: 'Test users',
        impact: 'Test impact',
        constraints: 'Test constraints'
      };

      const hierarchy = await buildHierarchy(telosData, { quick: true });

      Object.values(hierarchy).forEach(level => {
        expect(level).toHaveProperty('level');
        expect(level).toHaveProperty('name');
        expect(level).toHaveProperty('description');
        expect(level).toHaveProperty('purpose');
      });
    });

    it('should maintain proper level ordering', async () => {
      const telosData = {
        telos: 'Test purpose',
        beneficiaries: 'Test users',
        impact: 'Test impact',
        constraints: 'None'
      };

      const hierarchy = await buildHierarchy(telosData, { quick: true });

      expect(hierarchy.L9.level).toBe('L9');
      expect(hierarchy.L8.level).toBe('L8');
      expect(hierarchy.L1.level).toBe('L1');
    });
  });
});
