async function decomposeToLevels(l9Goal, hierarchy) {
  const decomposition = {
    L9: {
      level: 'L9',
      goal: l9Goal,
      purpose: hierarchy.L9.purpose
    }
  };

  decomposition.L8 = {
    level: 'L8',
    purpose: hierarchy.L8.purpose,
    parentGoal: l9Goal,
    question: 'What business metrics validate this serves our Telos?'
  };

  decomposition.L7 = {
    level: 'L7',
    purpose: hierarchy.L7.purpose,
    parentGoal: decomposition.L8.purpose,
    question: 'What user insights do we need to track these metrics?'
  };

  decomposition.L6 = {
    level: 'L6',
    purpose: hierarchy.L6.purpose,
    parentGoal: decomposition.L7.purpose,
    question: 'What UX enables users to provide these insights?'
  };

  decomposition.L5 = {
    level: 'L5',
    purpose: hierarchy.L5.purpose,
    parentGoal: decomposition.L6.purpose,
    question: 'What workflows must function end-to-end?'
  };

  decomposition.L4 = {
    level: 'L4',
    purpose: hierarchy.L4.purpose,
    parentGoal: decomposition.L5.purpose,
    question: 'What API contracts enable these workflows?'
  };

  decomposition.L3 = {
    level: 'L3',
    purpose: hierarchy.L3.purpose,
    parentGoal: decomposition.L4.purpose,
    question: 'What components implement these contracts?'
  };

  decomposition.L2 = {
    level: 'L2',
    purpose: hierarchy.L2.purpose,
    parentGoal: decomposition.L3.purpose,
    question: 'What functions compose these components?'
  };

  decomposition.L1 = {
    level: 'L1',
    purpose: hierarchy.L1.purpose,
    parentGoal: decomposition.L2.purpose,
    question: 'What code quality standards must be met?'
  };

  return decomposition;
}

function buildLineage(requirement, decomposition) {
  const lineage = {
    requirement,
    chain: []
  };

  const levels = ['L9', 'L8', 'L7', 'L6', 'L5', 'L4', 'L3', 'L2', 'L1'];
  
  for (const level of levels) {
    if (decomposition[level]) {
      lineage.chain.push({
        level,
        purpose: decomposition[level].purpose,
        question: decomposition[level].question
      });
    }
  }

  return lineage;
}

function generateTasksFromDecomposition(decomposition, tools) {
  const tasks = [];

  if (decomposition.L1) {
    tasks.push({
      level: 'L1',
      title: 'Code Quality Validation',
      description: `Ensure code meets quality standards: ${decomposition.L1.purpose}`,
      tools: tools.L1 || [],
      acceptance: 'All linters pass, no critical issues'
    });
  }

  if (decomposition.L2) {
    tasks.push({
      level: 'L2',
      title: 'Function Implementation',
      description: `Implement tested functions: ${decomposition.L2.purpose}`,
      tools: tools.L2 || [],
      acceptance: 'All unit tests pass, >80% coverage'
    });
  }

  if (decomposition.L3) {
    tasks.push({
      level: 'L3',
      title: 'Component Development',
      description: `Build components: ${decomposition.L3.purpose}`,
      tools: tools.L3 || [],
      acceptance: 'Component tests pass, renders correctly'
    });
  }

  if (decomposition.L5) {
    tasks.push({
      level: 'L5',
      title: 'E2E Workflow Validation',
      description: `Validate workflows: ${decomposition.L5.purpose}`,
      tools: tools.L5 || [],
      acceptance: 'All E2E tests pass, workflows complete successfully'
    });
  }

  if (decomposition.L9) {
    tasks.push({
      level: 'L9',
      title: 'Telos Alignment Check',
      description: `Verify alignment with ultimate purpose: ${decomposition.L9.purpose}`,
      tools: [],
      acceptance: 'Telos-Guardian approves alignment'
    });
  }

  return tasks;
}

module.exports = { 
  decomposeToLevels, 
  buildLineage, 
  generateTasksFromDecomposition 
};
