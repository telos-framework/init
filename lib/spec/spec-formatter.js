function formatTelosSpec(spec) {
  const { telos, via, requirements, tools } = spec;
  
  let content = `## TELOS ALIGNMENT\n\n`;
  content += `**Contributes to**: ${telos}\n\n`;
  
  if (via && via.length > 0) {
    content += `**Via**:\n`;
    for (const step of via) {
      content += `- ${step.level}: ${step.purpose}\n`;
    }
    content += `\n`;
  }
  
  content += `## ADDED Requirements\n\n`;
  
  for (const req of requirements) {
    content += `### Requirement: ${req.name}\n\n`;
    content += `${req.statement}\n\n`;
    
    if (req.scenarios && req.scenarios.length > 0) {
      for (const scenario of req.scenarios) {
        content += `#### Scenario: ${scenario.name}\n\n`;
        content += `- **WHEN** ${scenario.when}\n`;
        content += `- **THEN** ${scenario.then}\n\n`;
      }
    }
  }
  
  if (tools && Object.keys(tools).length > 0) {
    content += `## TOOLS REQUIRED\n\n`;
    for (const [level, levelTools] of Object.entries(tools)) {
      if (levelTools.length > 0) {
        content += `- **${level}**: ${levelTools.join(', ')}\n`;
      }
    }
    content += `\n`;
  }
  
  return content;
}

function parseTelosSpec(content) {
  const spec = {
    telos: null,
    via: [],
    requirements: [],
    tools: {}
  };
  
  const telosMatch = content.match(/\*\*Contributes to\*\*:\s*(.+)/);
  if (telosMatch) {
    spec.telos = telosMatch[1].trim();
  }
  
  const viaSection = content.match(/\*\*Via\*\*:\n((?:- .+\n?)+)/);
  if (viaSection) {
    const lines = viaSection[1].split('\n').filter(l => l.trim());
    spec.via = lines.map(line => {
      const match = line.match(/- (L\d+):\s*(.+)/);
      if (match) {
        return { level: match[1], purpose: match[2].trim() };
      }
      return null;
    }).filter(Boolean);
  }
  
  const reqMatches = content.matchAll(/### Requirement: (.+)\n\n([^#]+)/g);
  for (const match of reqMatches) {
    spec.requirements.push({
      name: match[1].trim(),
      statement: match[2].trim()
    });
  }
  
  return spec;
}

module.exports = { formatTelosSpec, parseTelosSpec };
