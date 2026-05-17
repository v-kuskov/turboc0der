import { promises as fs } from 'fs';
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
} from '@earendil-works/pi-coding-agent';

jest.mock('fs', () => {
  const actual = jest.requireActual('fs');
  return { ...actual, promises: { readFile: jest.fn() } };
});

import { runWithPrompt } from '../src/runner';

// ─── Test data ──────────────────────────────────────────────────
const FILE_PATH = '/some/agent-rules.md';
const PROMPT_TEXT = 'execute task';
const SYSTEM_PROMPT_CONTENT = '# Agent Rules\nDo the thing.';
const ASSISTANT_RESPONSE = 'Task completed.';

// ─── Helpers ─────────────────────────────────────────────────────
function createMockSession(responseText?: string) {
  let subFn: ((event: { type: string }) => void) | null = null;

  return {
    subscribe: jest.fn((fn: typeof subFn) => {
      subFn = fn;
      return jest.fn();
    }),
    getLastAssistantText: jest.fn(() => responseText),
    agent: { state: { errorMessage: undefined as string | undefined } },
    prompt: jest.fn(async () => {
      if (subFn) subFn({ type: 'agent_end' });
    }),
    dispose: jest.fn(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('runWithPrompt', () => {
  test('reads file, creates session, sends prompt, returns assistant text', async () => {
    const mockSession = createMockSession(ASSISTANT_RESPONSE);
    (fs.readFile as jest.Mock).mockResolvedValue(SYSTEM_PROMPT_CONTENT);
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });

    const result = await runWithPrompt(FILE_PATH, PROMPT_TEXT);

    expect(result).toBe(ASSISTANT_RESPONSE);
    expect(fs.readFile).toHaveBeenCalledWith(FILE_PATH, 'utf-8');
    expect(getAgentDir).toHaveBeenCalledTimes(1);
    expect(DefaultResourceLoader).toHaveBeenCalledWith(
      expect.objectContaining({
        systemPrompt: SYSTEM_PROMPT_CONTENT,
        noExtensions: true,
        noPromptTemplates: true,
        noThemes: true,
        noContextFiles: true,
      })
    );
    expect(createAgentSession).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceLoader: expect.anything(),
        tools: undefined,
      })
    );
    expect(mockSession.prompt).toHaveBeenCalledWith(PROMPT_TEXT, {
      expandPromptTemplates: true,
    });
  });

  test('propagates file read error', async () => {
    const fileError = new Error('ENOENT: no such file');
    (fs.readFile as jest.Mock).mockRejectedValue(fileError);

    await expect(runWithPrompt(FILE_PATH, PROMPT_TEXT)).rejects.toThrow(fileError);
  });

  test('throws when agent returns no text', async () => {
    const mockSession = createMockSession(undefined);
    mockSession.agent.state.errorMessage = 'Model did not respond';
    (fs.readFile as jest.Mock).mockResolvedValue(SYSTEM_PROMPT_CONTENT);
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });

    await expect(runWithPrompt(FILE_PATH, PROMPT_TEXT)).rejects.toThrow(
      'Model did not respond'
    );
  });

  test('throws "No assistant response" when both text and errorMessage are absent', async () => {
    const mockSession = createMockSession(undefined);
    (fs.readFile as jest.Mock).mockResolvedValue(SYSTEM_PROMPT_CONTENT);
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });

    await expect(runWithPrompt(FILE_PATH, PROMPT_TEXT)).rejects.toThrow(
      'No assistant response'
    );
  });

  test('passes allowedTools to createAgentSession', async () => {
    const mockSession = createMockSession(ASSISTANT_RESPONSE);
    (fs.readFile as jest.Mock).mockResolvedValue(SYSTEM_PROMPT_CONTENT);
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });
    const allowed = ['read', 'bash'];

    await runWithPrompt(FILE_PATH, PROMPT_TEXT, allowed);

    expect(createAgentSession).toHaveBeenCalledWith(
      expect.objectContaining({ tools: ['read', 'bash'] })
    );
  });

  test('calls session.dispose after completion', async () => {
    const mockSession = createMockSession(ASSISTANT_RESPONSE);
    (fs.readFile as jest.Mock).mockResolvedValue(SYSTEM_PROMPT_CONTENT);
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });

    await runWithPrompt(FILE_PATH, PROMPT_TEXT);

    expect(mockSession.dispose).toHaveBeenCalledTimes(1);
  });

  test('calls session.dispose even when agent returns no text', async () => {
    const mockSession = createMockSession(undefined);
    (fs.readFile as jest.Mock).mockResolvedValue(SYSTEM_PROMPT_CONTENT);
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });

    await expect(runWithPrompt(FILE_PATH, PROMPT_TEXT)).rejects.toThrow();

    expect(mockSession.dispose).toHaveBeenCalledTimes(1);
  });

  test('does not call dispose when file read fails (no session created)', async () => {
    const mockSession = createMockSession(ASSISTANT_RESPONSE);
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('read error'));
    (getAgentDir as jest.Mock).mockReturnValue('/fake/agent/dir');
    (createAgentSession as jest.Mock).mockResolvedValue({ session: mockSession });

    await expect(runWithPrompt(FILE_PATH, PROMPT_TEXT)).rejects.toThrow('read error');

    expect(mockSession.dispose).not.toHaveBeenCalled();
  });
});