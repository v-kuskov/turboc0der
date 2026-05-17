jest.mock('typebox', () => {
  const TObject = (props: Record<string, any>) => ({ type: 'object', properties: props });
  const TString = (opts: Record<string, any> = {}) => ({ type: 'string', ...opts });
  const TNumber = (opts: Record<string, any> = {}) => ({ type: 'number', ...opts });
  const TBoolean = (opts: Record<string, any> = {}) => ({ type: 'boolean', ...opts });
  const TOptional = (s: Record<string, any>) => ({ ...s });
  return { Type: { Object: TObject, String: TString, Number: TNumber, Boolean: TBoolean, Optional: TOptional }, Static: class Static {} };
});

import { lsToolDef } from '../../src/tools/ls';

describe('ls tool', () => {
  test('name and params', () => {
    expect(lsToolDef.name).toBe('ls');
    expect(lsToolDef.label).toBe('ls');
    expect(lsToolDef.description).toBeTruthy();

    const props = lsToolDef.parameters.properties;
    expect(props.path).toBeDefined();
    expect(props.all).toBeDefined();
    expect(props.long).toBeDefined();
    expect(props.human).toBeDefined();
    expect(props.recursive).toBeDefined();
    expect(props.reverse).toBeDefined();
    expect(props.directory).toBeDefined();
    expect(props.sort).toBeDefined();
    expect(props.limit).toBeDefined();
  });

  test('execute lists CWD contents', async () => {
    const result = await lsToolDef.execute('c1', {}, undefined);
    expect(result.content[0].text).toContain('src');
    expect(result.content[0].text).toContain('test');
  });

  test('execute with all flag shows hidden', async () => {
    const result = await lsToolDef.execute('c2', { all: true }, undefined);
    expect(result.content[0].text).toContain('.git');
  });

  test('execute with path param', async () => {
    const result = await lsToolDef.execute('c3', { path: 'src' }, undefined);
    expect(result.content[0].text).toContain('ls src');
  });

  test('execute with sort size', async () => {
    const result = await lsToolDef.execute('c5', { sort: 'size' }, undefined);
    expect(result.content[0].text).toContain('AGENTS');
  });

  test('execute with directory flag', async () => {
    const result = await lsToolDef.execute('c6', { path: 'src', directory: true }, undefined);
    const lines = result.content[0].text.trim().split('\n').filter((l: string) => l);
    expect(lines[lines.length - 1]).toContain('src');
  });

  test('execute respects limit', async () => {
    const unlimited = await lsToolDef.execute('c7', { path: '.' }, undefined);
    const limited = await lsToolDef.execute('c8', { path: '.', limit: 2 }, undefined);
    const unlimitedLines = unlimited.content[0].text.trim().split('\n').filter((l: string) => !l.startsWith('ls '));
    const limitedLines = limited.content[0].text.trim().split('\n').filter((l: string) => !l.startsWith('ls '));
    expect(unlimitedLines.length).toBeGreaterThan(limitedLines.length);
    expect(limitedLines.length).toBeLessThanOrEqual(2);
  });

  test('execute returns error for bad path', async () => {
    const result = await lsToolDef.execute('c9', { path: 'ZZZZ_NONEXISTENT_99999' }, undefined);
    expect(result.content[0].text).toContain('ERROR');
  });

  test('execute aborts on signal', async () => {
    const ac = new AbortController();
    ac.abort();
    await expect(
      lsToolDef.execute('c10', {}, ac.signal)
    ).rejects.toThrow('Operation aborted');
  });
});