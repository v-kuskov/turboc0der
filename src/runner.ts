import { promises as fs } from 'fs';
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
} from '@earendil-works/pi-coding-agent';

/**
 * Run pi instance with file contents as system prompt and prompt text as user message.
 *
 * Creates minimal pi session — no extensions, no prompt templates, no themes.
 * `@` references in prompt text are expanded via pi's built-in template expansion.
 *
 * @param filePath — Path to file whose contents become the agent's system prompt.
 * @param promptText — User message sent to the agent.
 * @param allowedTools — Optional tool allowlist. Default (undefined) = all tools.
 *                       Pass empty array for no tools.
 * @returns Assistant's full text response.
 */
export async function runWithPrompt(
  filePath: string,
  promptText: string,
  allowedTools?: string[]
): Promise<string> {
  const cwd = process.cwd();
  const agentDir = getAgentDir();

  // 1. Read file — becomes system prompt
  const systemPromptContent = await fs.readFile(filePath, 'utf-8');

  // 2. Minimal resource loader: no extensions, no prompt templates, no themes
  const resourceLoader = new DefaultResourceLoader({
    cwd,
    agentDir,
    systemPrompt: systemPromptContent,
    noExtensions: true,
    noPromptTemplates: true,
    noThemes: true,
    noContextFiles: true,
  });
  await resourceLoader.reload();

  // 3. Create session
  const { session } = await createAgentSession({
    cwd,
    resourceLoader,
    tools: allowedTools,
  });

  // 4. Send prompt, capture assistant response via events
  try {
    return await new Promise<string>((resolve, reject) => {
      const unsub = session.subscribe((event) => {
        if (event.type === 'agent_end') {
          unsub();
          const text = session.getLastAssistantText();
          if (text !== undefined) {
            resolve(text);
          } else {
            reject(
              new Error(
                session.agent.state.errorMessage ?? 'No assistant response'
              )
            );
          }
        }
      });

      session
        .prompt(promptText, { expandPromptTemplates: true })
        .catch((err: unknown) => {
          unsub();
          reject(err);
        });
    });
  } finally {
    session.dispose();
  }
}