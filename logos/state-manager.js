const fs = require('fs').promises;
const path = require('path');

class StateManager {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.stateDir = path.join(projectRoot, '.telos');
    this.statePath = path.join(this.stateDir, 'state.json');
    this.state = null;
  }

  async load() {
    try {
      await fs.mkdir(this.stateDir, { recursive: true });
      const content = await fs.readFile(this.statePath, 'utf8');
      this.state = JSON.parse(content);
    } catch (error) {
      this.state = this.getDefaultState();
    }
    return this.state;
  }

  async save() {
    await fs.mkdir(this.stateDir, { recursive: true });
    await fs.writeFile(this.statePath, JSON.stringify(this.state, null, 2), 'utf8');
  }

  getDefaultState() {
    return {
      version: '0.1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeAgents: [],
      decompositionStack: [],
      validationQueue: [],
      conflicts: [],
      session: {
        id: this.generateSessionId(),
        startedAt: new Date().toISOString()
      }
    };
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async startDecomposition(spec) {
    await this.load();
    this.state.decompositionStack.push({
      id: this.generateId(),
      spec,
      level: 'L9',
      status: 'pending',
      children: [],
      createdAt: new Date().toISOString()
    });
    this.state.updatedAt = new Date().toISOString();
    await this.save();
  }

  async recordAgentInvocation(level, task) {
    await this.load();
    this.state.activeAgents.push({
      level,
      task,
      startedAt: new Date().toISOString(),
      status: 'in-progress'
    });
    this.state.updatedAt = new Date().toISOString();
    await this.save();
  }

  async completeAgentInvocation(level, result) {
    await this.load();
    const agent = this.state.activeAgents.find(a => a.level === level && a.status === 'in-progress');
    if (agent) {
      agent.status = 'completed';
      agent.completedAt = new Date().toISOString();
      agent.result = result;
    }
    this.state.updatedAt = new Date().toISOString();
    await this.save();
  }

  async queueValidation(item) {
    await this.load();
    this.state.validationQueue.push({
      id: this.generateId(),
      ...item,
      queuedAt: new Date().toISOString(),
      status: 'pending'
    });
    this.state.updatedAt = new Date().toISOString();
    await this.save();
  }

  async recordConflict(conflict) {
    await this.load();
    this.state.conflicts.push({
      id: this.generateId(),
      ...conflict,
      detectedAt: new Date().toISOString(),
      resolved: false
    });
    this.state.updatedAt = new Date().toISOString();
    await this.save();
  }

  async resolveConflict(conflictId, resolution) {
    await this.load();
    const conflict = this.state.conflicts.find(c => c.id === conflictId);
    if (conflict) {
      conflict.resolved = true;
      conflict.resolution = resolution;
      conflict.resolvedAt = new Date().toISOString();
    }
    this.state.updatedAt = new Date().toISOString();
    await this.save();
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getState() {
    await this.load();
    return this.state;
  }

  async reset() {
    this.state = this.getDefaultState();
    await this.save();
  }
}

module.exports = { StateManager };
