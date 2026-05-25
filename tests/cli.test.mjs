import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
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

async function findFilesByName(dir, filename) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await findFilesByName(fullPath, filename)));
      continue;
    }

    if (entry.isFile() && entry.name === filename) out.push(fullPath);
  }

  return out.sort();
}

test('skill sync copies configured vendor skills into skill-data', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'ads-fe-'));
  const sourceDir = path.join(root, 'vendor', 'slidev', 'skills', 'slidev');
  await mkdir(sourceDir, { recursive: true });
  await writeFile(
    path.join(sourceDir, 'SKILL.md'),
    '---\nname: slidev\ndescription: Slidev official skill\n---\n# Slidev\n',
  );

  const result = runCli(['skill', 'sync', '--no-update'], root);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const skill = await readFile(path.join(root, 'skill-data', 'slidev', 'SKILL.md'), 'utf8');
  const sync = await readFile(path.join(root, 'skill-data', 'slidev', 'SYNC.md'), 'utf8');
  assert.match(skill, /Slidev official skill/);
  assert.match(sync, /vendor\/slidev\/skills\/slidev/);
});

test('skill help uses ads-fe as the public command name', () => {
  const result = runCli(['skill', '--help'], process.cwd());

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Usage: ads-fe skill/);
  assert.doesNotMatch(result.stdout, /Usage: adspower skill/);
});

test('skill get reads bundled skill-data when run outside the package root', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  const result = runCli(['skill', 'get', 'core'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /name: core/);
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
  assert.match(skill, /ads-fe/i);
  assert.deepEqual(await findFilesByName(path.join(home, '.claude', 'skills'), 'SKILL.md'), [
    path.join(home, '.claude', 'skills', 'ads-fe', 'SKILL.md'),
  ]);
  assert.match(result.stdout, /\.claude\/skills\/ads-fe/);
  assert.equal(
    await readFile(path.join(home, '.claude', 'CLAUDE.md'), 'utf8'),
    `@${path.resolve(home, '.claude', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
});

test('init codex --project installs bundled skill into current project', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  await writeFile(path.join(project, 'AGENTS.md'), '@/Users/standardsoftware/.codex/RTK.md\n');
  const result = runCli(['init', 'codex', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const skill = await readFile(path.join(project, '.codex', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  assert.match(skill, /ads-fe/i);
  assert.deepEqual(await findFilesByName(path.join(project, '.codex', 'skills'), 'SKILL.md'), [
    path.join(project, '.codex', 'skills', 'ads-fe', 'SKILL.md'),
  ]);
  assert.equal(
    await readFile(path.join(project, 'AGENTS.md'), 'utf8'),
    `@/Users/standardsoftware/.codex/RTK.md\n@${path.join(await realpath(project), '.codex', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
});

test('init codex installs globally and updates global AGENTS.md only', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'adspower-home-'));
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  await mkdir(path.join(home, '.codex'), { recursive: true });
  await writeFile(path.join(home, '.codex', 'AGENTS.md'), '@/Users/standardsoftware/.codex/RTK.md\n');
  const env = {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, '.config'),
  };

  const first = runCli(['init', 'codex'], project, env);
  const second = runCli(['init', 'codex'], project, env);

  assert.equal(first.status, 0, first.stderr || first.stdout);
  assert.equal(second.status, 0, second.stderr || second.stdout);
  await readFile(path.join(home, '.codex', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  assert.equal(
    await readFile(path.join(home, '.codex', 'AGENTS.md'), 'utf8'),
    `@/Users/standardsoftware/.codex/RTK.md\n@${path.resolve(home, '.codex', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
  await assert.rejects(access(path.join(project, 'AGENTS.md')));
});

test('init claude and cursor install globally and update global instruction files only', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'adspower-home-'));
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  await mkdir(path.join(home, '.claude'), { recursive: true });
  await writeFile(path.join(home, '.claude', 'CLAUDE.md'), '# Existing Claude Instructions\n');
  const env = {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, '.config'),
  };

  const result = runCli(['init', 'all'], project, env);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await readFile(path.join(home, '.claude', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await readFile(path.join(home, '.cursor', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  assert.equal(
    await readFile(path.join(home, '.claude', 'CLAUDE.md'), 'utf8'),
    `# Existing Claude Instructions\n@${path.resolve(home, '.claude', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
  assert.equal(
    await readFile(path.join(home, '.cursor', 'rules', 'ads-fe.mdc'), 'utf8'),
    `---\ndescription: AdsPower FE coding standards and workflow entrypoint\nalwaysApply: true\n---\n\n@${path.resolve(home, '.cursor', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
  await assert.rejects(access(path.join(project, 'CLAUDE.md')));
  await assert.rejects(access(path.join(project, '.cursor')));
});

test('init cursor --project installs a Cursor agent skill', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  const legacyRulePath = path.join(project, '.cursor', 'rules', 'ads-fe.mdc');
  await mkdir(path.dirname(legacyRulePath), { recursive: true });
  await writeFile(legacyRulePath, 'legacy rule');

  const result = runCli(['init', 'cursor', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const skill = await readFile(path.join(project, '.cursor', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  assert.match(skill, /name: ads-fe/);
  assert.deepEqual(await findFilesByName(path.join(project, '.cursor', 'skills'), 'SKILL.md'), [
    path.join(project, '.cursor', 'skills', 'ads-fe', 'SKILL.md'),
  ]);
  assert.equal(
    await readFile(legacyRulePath, 'utf8'),
    `---\ndescription: AdsPower FE coding standards and workflow entrypoint\nalwaysApply: true\n---\n\n@${path.join(await realpath(project), '.cursor', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
});

test('init claude --project installs skill and updates project CLAUDE.md', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  await writeFile(path.join(project, 'CLAUDE.md'), '# Project Claude Instructions\n');

  const result = runCli(['init', 'claude', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await readFile(path.join(project, '.claude', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  assert.equal(
    await readFile(path.join(project, 'CLAUDE.md'), 'utf8'),
    `# Project Claude Instructions\n@${path.join(await realpath(project), '.claude', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
});

test('init cursor --project installs skill and updates project Cursor rule', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));

  const result = runCli(['init', 'cursor', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await readFile(path.join(project, '.cursor', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  assert.equal(
    await readFile(path.join(project, '.cursor', 'rules', 'ads-fe.mdc'), 'utf8'),
    `---\ndescription: AdsPower FE coding standards and workflow entrypoint\nalwaysApply: true\n---\n\n@${path.join(await realpath(project), '.cursor', 'skills', 'ads-fe', 'SKILL.md')}\n`,
  );
});

test('init all --project installs every project target', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'adspower-project-'));
  const result = runCli(['init', 'all', '--project'], project);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await readFile(path.join(project, '.claude', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await readFile(path.join(project, '.codex', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await readFile(path.join(project, '.cursor', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
});

test('remove all removes every global skill install target', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'adspower-home-'));
  const env = {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, '.config'),
  };

  const init = runCli(['init', 'all'], process.cwd(), env);
  assert.equal(init.status, 0, init.stderr || init.stdout);
  const legacyRulePath = path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'rules', 'ads-fe.md');
  await mkdir(path.dirname(legacyRulePath), { recursive: true });
  await writeFile(legacyRulePath, 'legacy rule');

  const result = runCli(['remove', 'all'], process.cwd(), env);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /\.claude\/skills\/ads-fe/);
  assert.match(result.stdout, /\.codex\/skills\/ads-fe/);
  assert.match(result.stdout, /\.cursor\/skills\/ads-fe/);
  await assert.rejects(access(path.join(home, '.claude', 'skills', 'ads-fe')));
  await assert.rejects(access(path.join(home, '.codex', 'skills', 'ads-fe')));
  await assert.rejects(access(path.join(home, '.cursor', 'skills', 'ads-fe')));
  assert.equal(await readFile(legacyRulePath, 'utf8'), 'legacy rule');
});

test('remove cursor only removes the global cursor skill files', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'adspower-home-'));
  const env = {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, '.config'),
  };

  const init = runCli(['init', 'all'], process.cwd(), env);
  assert.equal(init.status, 0, init.stderr || init.stdout);

  const result = runCli(['remove', 'cursor'], process.cwd(), env);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await readFile(path.join(home, '.claude', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await readFile(path.join(home, '.codex', 'skills', 'ads-fe', 'SKILL.md'), 'utf8');
  await assert.rejects(access(path.join(home, '.cursor', 'skills', 'ads-fe')));
});

test('skill remove is an alias for removing global skill files', async () => {
  const home = await mkdtemp(path.join(tmpdir(), 'adspower-home-'));
  const env = {
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: path.join(home, '.config'),
  };

  const init = runCli(['init', 'codex'], process.cwd(), env);
  assert.equal(init.status, 0, init.stderr || init.stdout);

  const result = runCli(['skill', 'remove', 'codex'], process.cwd(), env);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await assert.rejects(access(path.join(home, '.codex', 'skills', 'ads-fe')));
});

test('remove rejects unknown agents', () => {
  const result = runCli(['remove', 'windsurf'], process.cwd());

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown agent: windsurf/);
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
  assert.ok(pkg.files.includes('skill-data'));
  assert.ok(!pkg.files.includes('skills'));
  assert.ok(!pkg.files.includes('dist/src'));
});

test('build output does not keep the old nested cli entrypoint', async () => {
  await assert.rejects(access(path.resolve('dist/src/cli.js')));
  await access(path.resolve('dist/cli.js'));
  await access(path.resolve('dist/meta.js'));
});
