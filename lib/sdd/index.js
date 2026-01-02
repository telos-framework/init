/**
 * Telos-SDD Module Index
 * 
 * Main entry point for Specification-Driven Development features.
 */

const specParser = require('./spec-parser');
const specIndex = require('./spec-index');
const annotationScanner = require('./annotation-scanner');
const config = require('./config');
const validator = require('./validator');
const contextLoader = require('./context-loader');
const testGenerator = require('./test-generator');
const specTemplates = require('./spec-templates');
const discovery = require('./discovery');
const hooks = require('./hooks');

module.exports = {
  // Spec parsing
  parseMetadata: specParser.parseMetadata,
  parseSpecFile: specParser.parseSpecFile,
  parseSpecId: specParser.parseSpecId,
  buildSpecId: specParser.buildSpecId,
  specIdToPath: specParser.specIdToPath,
  LEVEL_NAMES: specParser.LEVEL_NAMES,
  LEVEL_FOLDERS: specParser.LEVEL_FOLDERS,

  // Spec index
  buildIndex: specIndex.buildIndex,
  saveIndex: specIndex.saveIndex,
  loadIndex: specIndex.loadIndex,
  getSpec: specIndex.getSpec,
  getSpecByPath: specIndex.getSpecByPath,
  getSpecsByLevel: specIndex.getSpecsByLevel,
  getLineage: specIndex.getLineage,
  getSiblings: specIndex.getSiblings,
  validateIndex: specIndex.validateIndex,

  // Annotation scanning
  scanFile: annotationScanner.scanFile,
  scanDirectory: annotationScanner.scanDirectory,
  findOrphans: annotationScanner.findOrphans,
  validateAnnotations: annotationScanner.validateAnnotations,
  generateAnnotation: annotationScanner.generateAnnotation,
  getLanguageConfig: annotationScanner.getLanguageConfig,

  // Configuration
  loadConfig: config.loadConfig,
  saveConfig: config.saveConfig,
  initConfig: config.initConfig,
  isHardEnforcement: config.isHardEnforcement,
  getTestFramework: config.getTestFramework,
  detectProjectLanguages: config.detectProjectLanguages,

  // Validation
  validate: validator.validate,
  validateSpecs: validator.validateSpecs,
  validateLinks: validator.validateLinks,
  validateTests: validator.validateTests,
  validateOrphans: validator.validateOrphans,
  formatResults: validator.formatResults,
  EXIT_SUCCESS: validator.EXIT_SUCCESS,
  EXIT_FAILURE: validator.EXIT_FAILURE,

  // Context loading
  loadContext: contextLoader.loadContext,
  loadContextForCode: contextLoader.loadContextForCode,
  formatContextAsMarkdown: contextLoader.formatContextAsMarkdown,
  getSpecTree: contextLoader.getSpecTree,

  // Test generation
  parseScenarios: testGenerator.parseScenarios,
  generateTests: testGenerator.generateTests,
  syncTests: testGenerator.syncTests,

  // Spec templates
  generateSpec: specTemplates.generateSpec,
  generateTelosEntry: specTemplates.generateTelosEntry,
  TEMPLATES: specTemplates.TEMPLATES,

  // Discovery
  discover: discovery.discover,
  generateSpecs: discovery.generateSpecs,
  scanProjectMetadata: discovery.scanProjectMetadata,
  scanCodeStructure: discovery.scanCodeStructure,

  // Hooks & CI
  installHooks: hooks.installHooks,
  uninstallHooks: hooks.uninstallHooks,
  generateGitHubWorkflow: hooks.generateGitHubWorkflow,
  generateGitLabCI: hooks.generateGitLabCI,
  installCI: hooks.installCI
};
