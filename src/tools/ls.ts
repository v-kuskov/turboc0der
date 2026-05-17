import { Type } from 'typebox';
import { spawn } from 'child_process';
import { createInterface } from 'readline';

const LsSchema = Type.Object({
  path: Type.Optional(Type.String({ description: 'Path to list (default: CWD)' })),
  all: Type.Optional(Type.Boolean({ description: 'Include hidden files (-a)', default: false })),
  long: Type.Optional(Type.Boolean({ description: 'Long format with sizes (-l)', default: false })),
  human: Type.Optional(Type.Boolean({ description: 'Human-readable sizes (-h)', default: false })),
  recursive: Type.Optional(Type.Boolean({ description: 'Recurse into subdirectories (-R)', default: false })),
  reverse: Type.Optional(Type.Boolean({ description: 'Reverse sort order (-r)', default: false })),
  directory: Type.Optional(Type.Boolean({ description: 'List dirs as entries, not contents (-d)', default: false })),
  sort: Type.Optional(Type.String({ description: 'Sort by: size (-S), time (-t), or none (default: name)', default: 'none' })),
  limit: Type.Optional(Type.Number({ description: 'Max entries to return', default: 0 })),
});

export type LsInput = {
  path?: string;
  all?: boolean;
  long?: boolean;
  human?: boolean;
  recursive?: boolean;
  reverse?: boolean;
  directory?: boolean;
  sort?: string;
  limit?: number;
};

function buildArgs(params: LsInput): string[] {
  const args: string[] = ['--color=never'];
  if (params.all) args.push('-a');
  if (params.long) args.push('-l');
  if (params.human) args.push('-h');
  if (params.recursive) args.push('-R');
  if (params.reverse) args.push('-r');
  if (params.directory) args.push('-d');
  if (params.sort === 'size') args.push('-S');
  if (params.sort === 'time') args.push('-t');
  return args;
}

export const lsToolDef = {
  name: 'ls',
  label: 'ls',
  description: 'List directory contents. Supports filtering, sorting, long format.',
  promptSnippet: 'list directory contents',
  parameters: LsSchema,
  execute: async (
    _toolCallId: string,
    params: LsInput,
    signal: AbortSignal | undefined,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      let settled = false;
      const settle = (fn: () => void) => {
        if (!settled) { settled = true; fn(); }
      };

      if (signal?.aborted) {
        settle(() => reject(new Error('Operation aborted')));
        return;
      }

      const args = buildArgs(params);
      const listPath = params.path || '.';
      args.push('--', listPath);

      const proc = spawn('rtk', ['ls', ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
      const rl = createInterface({ input: proc.stdout });
      let lines: string[] = [];
      let stderr = '';

      proc.stderr?.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
      rl.on('line', (line: string) => {
        if (params.limit && params.limit > 0 && lines.length >= params.limit) return;
        lines.push(line);
      });

      const cleanup = () => { rl.close(); };

      proc.on('error', (err: Error) => {
        cleanup();
        settle(() => reject(new Error(`rtk binary not available: ${err.message}`)));
      });

      proc.on('close', (code: number | null) => {
        cleanup();
        if (settled) return;
        if (signal?.aborted) {
          settle(() => reject(new Error('Operation aborted')));
          return;
        }

        if (code !== null && code > 1) {
          const msg = stderr.trim() || `rtk ls exited with code ${code}`;
          settle(() => resolve({ content: [{ type: 'text', text: `ERROR: ${msg}` }], details: undefined }));
          return;
        }

        const displayPath = listPath === '.' ? 'CWD' : listPath;
        const header = `ls ${displayPath}`;

        if (lines.length === 0) {
          settle(() => resolve({ content: [{ type: 'text', text: header }], details: undefined }));
          return;
        }

        const result = [header, ...lines].join('\n');
        settle(() => resolve({ content: [{ type: 'text', text: result }], details: undefined }));
      });
    });
  },
};
