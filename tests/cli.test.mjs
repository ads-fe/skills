import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const cliPath = path.resolve('dist/cli.js');

function runCli(args, cwd, env = {}) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

test('skill sync copies configured vendor skills into skills', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'ads-fe-'));
  const sourceDir = path.join(root, 'vendor', 'slidev', 'skills', 'slidev');
  await mkdir(sourceDir, { recursive: true });
  await writeFile(
    path.join(sourceDir, 'SKILL.md'),
    '---\nname: slidev\ndescription: Slidev official skill\n---\n# Slidev\n',
  );

  const result = runCli(['skill', 'sync', '--no-update'], root);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const skill = await readFile(path.join(root, 'skills', 'slidev', 'SKILL.md'), 'utf8');
  const sync = await readFile(path.join(root, 'skills', 'slidev', 'SYNC.md'), 'utf8');
  assert.match(skill, /Slidev official skill/);
  assert.match(sync, /vendor\/slidev\/skills\/slidev/);
});

test('skill help uses ads-fe as the public command name', () => {
  const result = runCli(['skill', '--help'], process.cwd());

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Usage: ads-fe skill/);
  assert.doesNotMatch(result.stdout, /Usage: adspower skill/);
});

test('init claude installs bundled skill globally', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'adspower-home-'));
  const result = runCli(['init', 'claude'], process.cwd(), {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, '.config'),
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const skill = await readFile(path.join(home, '.claude', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  const data = await readFile(path.join(home, '.claude', 'skills', 'ads-fe', 'skills', 'core', 'SKILL.md'), 'utf8');
  assert.match(skill, /ads-fe/i);
  assert.match(data, /name:/);
  assert.match(result.stdout, /\.claude\/skills\/ads-fe/);
});

test('init codex --project installs bundled skill into current project', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  const result = runCli(['init', 'codex', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const skill = await readFile(path.join(project, '.codex', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  const data = await readFile(path.join(project, '.codex', 'skills', 'ads-fe', 'skills', 'core', 'SKILL.md'), 'utf8');
  assert.match(skill, /ads-fe/i);
  assert.match(data, /name:/);
});

test('init cursor --project writes a project MDC rule and skill data', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  const result = runCli(['init', 'cursor', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const rule = await readFile(path.join(project, '.cursor', 'rules', 'ads-fe.mdc'), 'utf8');
  const data = await readFile(path.join(project, '.cursor', 'rules', 'ads-fe-skills', 'core', 'SKILL.md'), 'utf8');
  assert.match(rule, /^---\n/);
  assert.match(rule, /alwaysApply: true/);
  assert.match(rule, /ads-fe-skills/);
  assert.match(data, /name:/);
});

test('init all --project installs every project target', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  const result = runCli(['init', 'all', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await readFile(path.join(project, '.claude', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await readFile(path.join(project, '.codex', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await readFile(path.join(project, '.cursor', 'rules', 'ads-fe.mdc'), 'utf8');
});

test('package scripts expose external official skill maintenance commands', async () => {
  const pkg = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));

  assert.equal(pkg.scripts['skill:init'], 'tsx src/cli.ts skill init');
  assert.equal(pkg.scripts['skill:sync'], 'tsx src/cli.ts skill sync');
  assert.equal(pkg.scripts['skill:update'], 'tsx src/cli.ts skill update');
  assert.equal(pkg.scripts['skill:check'], 'tsx src/cli.ts skill check');
  assert.equal(pkg.scripts['skill:cleanup'], 'tsx src/cli.ts skill cleanup');
});

test('package exposes dist cli as the public binary entrypoint', async () => {
  const pkg = JSON.parse(await readFile(path.resolve('package.json'), 'utf8'));

  assert.equal(pkg.name, 'ads-fe');
  assert.equal(pkg.bin['ads-fe'], 'dist/cli.js');
  assert.ok(pkg.files.includes('dist/cli.js'));
  assert.ok(pkg.files.includes('dist/meta.js'));
  assert.ok(!pkg.files.includes('dist/src'));
});

test('build output does not keep the old nested cli entrypoint', async () => {
  await assert.rejects(access(path.resolve('dist/src/cli.js')));
  await access(path.resolve('dist/cli.js'));
  await access(path.resolve('dist/meta.js'));
});
