/**
 * Manual mock for @earendil-works/pi-coding-agent
 * Overrides ESM module — Jest CJS can't resolve it directly, so moduleNameMapper
 * redirects here.
 */

export const createAgentSession = jest.fn();

export const DefaultResourceLoader = jest.fn(() => ({
  reload: jest.fn(),
  getSystemPrompt: jest.fn(),
  getAppendSystemPrompt: jest.fn(),
  getSkills: jest.fn(() => ({ skills: [], diagnostics: [] })),
  getAgentsFiles: jest.fn(() => ({ agentsFiles: [] })),
  getExtensions: jest.fn(),
  getPrompts: jest.fn(() => ({ prompts: [], diagnostics: [] })),
  getThemes: jest.fn(() => ({ themes: [], diagnostics: [] })),
  extendResources: jest.fn(),
}));

export const getAgentDir = jest.fn();

export {
  createAgentSession as createAgentSessionAlias,
};