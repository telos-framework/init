const { StateManager } = require('./state-manager');

class LogosOrchestrator {
  constructor(projectRoot) {
    this.stateManager = new StateManager(projectRoot);
    this.levelOrder = ['L9', 'L8', 'L7', 'L6', 'L5', 'L4', 'L3', 'L2', 'L1'];
  }

  async decomposeTopDown(requirement) {
    await this.stateManager.startDecomposition(requirement);
    
    const decomposition = {
      L9: { purpose: requirement.purpose, validated: false },
      children: []
    };

    for (let i = 1; i < this.levelOrder.length; i++) {
      const currentLevel = this.levelOrder[i];
      const parentLevel = this.levelOrder[i - 1];
      
      const spec = await this.delegateToLevel(currentLevel, {
        type: 'decompose',
        parentPurpose: decomposition[parentLevel] || decomposition.L9,
        requirement
      });

      decomposition[currentLevel] = spec;
      decomposition.children.push({
        level: currentLevel,
        spec
      });
    }

    return decomposition;
  }

  async validateBottomUp(implementation) {
    const validationResults = [];

    for (let i = this.levelOrder.length - 1; i >= 0; i--) {
      const level = this.levelOrder[i];
      
      const validation = await this.delegateToLevel(level, {
        type: 'validate',
        implementation,
        childValidations: validationResults.filter(v => 
          this.isChildLevel(v.level, level)
        )
      });

      await this.stateManager.queueValidation({
        level,
        validation,
        status: validation.passed ? 'passed' : 'failed'
      });

      validationResults.push({
        level,
        ...validation
      });

      if (!validation.passed && validation.critical) {
        return {
          success: false,
          failedAt: level,
          validations: validationResults,
          message: `Critical validation failure at ${level}`
        };
      }
    }

    return {
      success: true,
      validations: validationResults
    };
  }

  async reconcileConflict(conflict) {
    const { levelA, levelB, issue } = conflict;
    
    const higherLevel = this.getHigherLevel(levelA, levelB);
    const lowerLevel = higherLevel === levelA ? levelB : levelA;

    await this.stateManager.recordConflict({
      higherLevel,
      lowerLevel,
      issue
    });

    const resolution = await this.delegateToLevel(higherLevel, {
      type: 'reconcile',
      conflict: {
        lowerLevel,
        issue
      }
    });

    await this.stateManager.resolveConflict(conflict.id, resolution);

    return resolution;
  }

  async delegateToLevel(level, task) {
    await this.stateManager.recordAgentInvocation(level, task);
    
    const result = {
      level,
      task: task.type,
      message: `${level} agent would process: ${task.type}`,
      timestamp: new Date().toISOString()
    };

    await this.stateManager.completeAgentInvocation(level, result);
    
    return result;
  }

  isChildLevel(childLevel, parentLevel) {
    const childIndex = this.levelOrder.indexOf(childLevel);
    const parentIndex = this.levelOrder.indexOf(parentLevel);
    return childIndex > parentIndex;
  }

  getHigherLevel(levelA, levelB) {
    const indexA = this.levelOrder.indexOf(levelA);
    const indexB = this.levelOrder.indexOf(levelB);
    return indexA < indexB ? levelA : levelB;
  }

  async getStatus() {
    return await this.stateManager.getState();
  }

  async reset() {
    await this.stateManager.reset();
  }
}

module.exports = { LogosOrchestrator };
