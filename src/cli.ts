#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { manual, submodules, vendors, type VendorSkillMeta } from './meta.js';

type SkillMeta = {
  name: string;
  description?: string;
  hidden?: boolean;
};

type Skill = {
  meta: SkillMeta;
  dir: string;
  file: string;
};

type InitAgent = 'claude' | 'codex' | 'cursor';
type InitScope = 'global' | 'project';
type InstallResult = {
  agent: InitAgent;
  scope: InitScope;
  paths: string[];
  warnings: string[];
};
type RemoveResult = {
  agent: InitAgent;
  scope: InitScope;
  paths: string[];
};

const SKILL_DATA_DIR = 'skill-data';
const SKILL_DIRS = [SKILL_DATA_DIR];
const SKILL_FILE = 'SKILL.md';
const ENV_SKILL_DATA_DIR = 'ADSPOWER_SKILL_DATA_DIR';
const GENERATED_SKILL_DIR = SKILL_DATA_DIR;

type Project = {
  name: string;
  url: string;
  type: 'source' | 'vendor';
  dir: string;
};

function readFrontmatter(content: string): Partial<SkillMeta> {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return {};

  const block = fmMatch[1];
  const meta: Partial<SkillMeta> = {};

  for (const line of block.split('\n')) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) continue;

    const key = m[1].trim();
    let value = m[2].trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key === 'name') meta.name = value;
    if (key === 'description') meta.description = value;
    if (key === 'hidden') meta.hidden = /^true$/i.test(value);
  }

  return meta;
}

function detectCliPackageRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));

  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'skill.md'))) {
      return dir;
    }

    const parent = path.dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}

function detectPackageRoot(): string {
  return process.cwd();
}

function detectSkillPackageRoot(): string {
  const cliRoot = detectCliPackageRoot();
  if (fs.existsSync(path.join(cliRoot, 'skill.md'))) return cliRoot;
  return detectPackageRoot();
}

function runGit(args: string[], cwd = detectPackageRoot()): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function runGitSafe(args: string[], cwd = detectPackageRoot()): string | null {
  try {
    return runGit(args, cwd);
  } catch {
    return null;
  }
}

function allExternalProjects(): Project[] {
  return [
    ...Object.entries(submodules).map(([name, url]) => ({
      name,
      url,
      type: 'source' as const,
      dir: path.join('sources', name),
    })),
    ...Object.entries(vendors).map(([name, config]) => ({
      name,
      url: config.source,
      type: 'vendor' as const,
      dir: path.join('vendor', name),
    })),
  ];
}

function readGitmodulePaths(): Set<string> {
  const gitmodules = path.join(detectPackageRoot(), '.gitmodules');
  if (!fs.existsSync(gitmodules)) return new Set();

  const content = fs.readFileSync(gitmodules, 'utf8');
  const paths = [...content.matchAll(/path\s*=\s*(.+)/g)].map((m) => m[1].trim());
  return new Set(paths);
}

function copyDirectory(sourceDir: string, outputDir: string): void {
  fs.mkdirSync(outputDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, outputPath);
      continue;
    }

    if (entry.isFile()) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.copyFileSync(sourcePath, outputPath);
    }
  }
}

function removePath(target: string): void {
  fs.rmSync(target, { recursive: true, force: true });
}

function writeFileEnsured(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function userHome(): string {
  return os.homedir();
}

function cursorUserSkillsDir(): string {
  return path.join(userHome(), '.cursor', 'skills');
}

function agentSkillDir(agent: InitAgent, scope: InitScope): string {
  if (scope === 'project') {
    if (agent === 'claude') return path.join(process.cwd(), '.claude', 'skills', 'ads-fe');
    if (agent === 'codex') return path.join(process.cwd(), '.codex', 'skills', 'ads-fe');
    return path.join(process.cwd(), '.cursor', 'skills', 'ads-fe');
  }

  if (agent === 'claude') return path.join(userHome(), '.claude', 'skills', 'ads-fe');
  if (agent === 'codex') return path.join(userHome(), '.codex', 'skills', 'ads-fe');
  return path.join(cursorUserSkillsDir(), 'ads-fe');
}

function readRootSkill(root: string): string {
  const skillPath = path.join(root, 'skill.md');
  if (!fs.existsSync(skillPath)) throw new Error(`Missing package skill file: ${skillPath}`);
  return fs.readFileSync(skillPath, 'utf8');
}

function installSkillDirectory(agent: InitAgent, scope: InitScope, root: string): InstallResult {
  const targetDir = agentSkillDir(agent, scope);
  const warnings: string[] = [];
  removePath(targetDir);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(path.join(root, 'skill.md'), path.join(targetDir, SKILL_FILE));

  return { agent, scope, paths: [targetDir], warnings };
}

function installAgent(agent: InitAgent, scope: InitScope, root: string): InstallResult {
  readRootSkill(root);
  return installSkillDirectory(agent, scope, root);
}

function cursorInstallPaths(scope: InitScope): string[] {
  return [agentSkillDir('cursor', scope)];
}

function removeAgent(agent: InitAgent, scope: InitScope): RemoveResult {
  const paths = agent === 'cursor' ? cursorInstallPaths(scope) : [agentSkillDir(agent, scope)];
  for (const targetPath of paths) removePath(targetPath);
  return { agent, scope, paths };
}

function getGitSha(dir: string): string | null {
  return runGitSafe(['rev-parse', 'HEAD'], dir);
}

function copyLicense(vendorPath: string, outputPath: string): void {
  const names = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'license.md', 'license.txt'];
  const licensePath = names.map((name) => path.join(vendorPath, name)).find((candidate) => fs.existsSync(candidate));
  if (licensePath) fs.copyFileSync(licensePath, path.join(outputPath, 'LICENSE.md'));
}

function syncVendorSkills(): { synced: string[]; skipped: string[] } {
  const root = detectPackageRoot();
  const synced: string[] = [];
  const skipped: string[] = [];

  for (const [vendorName, config] of Object.entries(vendors) as [string, VendorSkillMeta][]) {
    const vendorPath = path.join(root, 'vendor', vendorName);
    const vendorSkillsPath = path.join(vendorPath, 'skills');

    if (!fs.existsSync(vendorSkillsPath)) {
      skipped.push(`vendor/${vendorName}/skills`);
      continue;
    }

    for (const [sourceSkillName, outputSkillName] of Object.entries(config.skills)) {
      const sourceSkillPath = path.join(vendorSkillsPath, sourceSkillName);
      const outputPath = path.join(root, GENERATED_SKILL_DIR, outputSkillName);

      if (!fs.existsSync(sourceSkillPath)) {
        skipped.push(`vendor/${vendorName}/skills/${sourceSkillName}`);
        continue;
      }

      fs.rmSync(outputPath, { recursive: true, force: true });
      copyDirectory(sourceSkillPath, outputPath);
      copyLicense(vendorPath, outputPath);

      const sha = getGitSha(vendorPath) || 'unknown';
      const date = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        path.join(outputPath, 'SYNC.md'),
        `# Sync Info

- Source: \`vendor/${vendorName}/skills/${sourceSkillName}\`
- Git SHA: \`${sha}\`
- Synced: ${date}
`,
      );

      synced.push(`${sourceSkillName} -> ${outputSkillName}`);
    }
  }

  return { synced, skipped };
}

function expectedGeneratedSkillNames(): Set<string> {
  const expected = new Set<string>();
  for (const config of Object.values(vendors) as VendorSkillMeta[]) {
    for (const outputName of Object.values(config.skills)) expected.add(outputName);
  }
  return expected;
}

function findSkillDirs(): string[] {
  const fromEnv = process.env[ENV_SKILL_DATA_DIR];
  if (fromEnv) {
    const dirs = fromEnv
      .split(path.delimiter)
      .map((p: string) => p.trim())
      .filter(Boolean)
      .map((p: string) => path.resolve(p))
      .filter((p: string) => fs.existsSync(p) && fs.statSync(p).isDirectory());

    if (dirs.length > 0) return dirs;
  }

  const roots = [detectPackageRoot(), detectSkillPackageRoot()];
  const seen = new Set<string>();
  const dirs: string[] = [];

  for (const root of roots) {
    for (const dir of SKILL_DIRS) {
      const candidate = path.join(root, dir);
      if (seen.has(candidate) || !fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) continue;

      seen.add(candidate);
      dirs.push(candidate);
    }
  }

  return dirs;
}

function discoverSkills(includeHidden = false): Skill[] {
  const dirs = findSkillDirs();
  const skills = new Map<string, Skill>();

  for (const baseDir of dirs) {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillDir = path.join(baseDir, entry.name);
      const skillFile = path.join(skillDir, SKILL_FILE);
      if (!fs.existsSync(skillFile)) continue;

      const content = fs.readFileSync(skillFile, 'utf8');
      const meta = readFrontmatter(content);

      const name = meta.name?.trim() || entry.name;
      const hidden = Boolean(meta.hidden);
      if (hidden && !includeHidden) continue;

      if (!skills.has(name)) {
        skills.set(name, {
          meta: {
            name,
            description: meta.description || '',
            hidden,
          },
          dir: skillDir,
          file: skillFile,
        });
      }
    }
  }

  return Array.from(skills.values()).sort((a, b) => a.meta.name.localeCompare(b.meta.name));
}

function getSkillByName(name: string, includeHidden = true): Skill | undefined {
  return discoverSkills(includeHidden).find((s) => s.meta.name === name);
}

function collectFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFilesRecursive(fullPath));
      continue;
    }
    if (entry.isFile()) out.push(fullPath);
  }

  return out.sort((a, b) => a.localeCompare(b));
}

const program = new Command();
program.name('ads-fe');

function addRemoveCommand(parent: Command): void {
  parent
    .command('remove <agent>')
    .description('Remove the AdsPower skill from claude, codex, cursor, or all')
    .option('--project', 'Remove from the current project instead of the global user location')
    .action((agent: string, opts: { project?: boolean }) => {
      const allowed = new Set(['claude', 'codex', 'cursor', 'all']);
      if (!allowed.has(agent)) {
        process.stderr.write(`Unknown agent: ${agent}. Expected one of: claude, codex, cursor, all\n`);
        process.exitCode = 1;
        return;
      }

      const scope: InitScope = opts.project ? 'project' : 'global';
      const agents: InitAgent[] = agent === 'all' ? ['claude', 'codex', 'cursor'] : [agent as InitAgent];

      for (const targetAgent of agents) {
        const result = removeAgent(targetAgent, scope);
        for (const targetPath of result.paths) process.stdout.write(`Removed ${result.agent} ${result.scope}: ${targetPath}\n`);
      }
    });
}

program
  .command('init <agent>')
  .description('Install the bundled AdsPower skill into claude, codex, cursor, or all')
  .option('--project', 'Install into the current project instead of the global user location')
  .action((agent: string, opts: { project?: boolean }) => {
    const allowed = new Set(['claude', 'codex', 'cursor', 'all']);
    if (!allowed.has(agent)) {
      process.stderr.write(`Unknown agent: ${agent}. Expected one of: claude, codex, cursor, all\n`);
      process.exitCode = 1;
      return;
    }

    const scope: InitScope = opts.project ? 'project' : 'global';
    const root = detectSkillPackageRoot();
    const agents: InitAgent[] = agent === 'all' ? ['claude', 'codex', 'cursor'] : [agent as InitAgent];

    try {
      for (const targetAgent of agents) {
        const result = installAgent(targetAgent, scope, root);
        for (const targetPath of result.paths) process.stdout.write(`Installed ${result.agent} ${result.scope}: ${targetPath}\n`);
        for (const warning of result.warnings) process.stderr.write(`Warning: ${warning}\n`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    }
  });

const skill = program.command('skill').description('Manage skills');

addRemoveCommand(program);
addRemoveCommand(skill);

skill
  .command('init')
  .description('Add missing external skill repositories as git submodules')
  .action(() => {
    const root = detectPackageRoot();
    const existing = readGitmodulePaths();
    const projects = allExternalProjects().filter((project) => !existing.has(project.dir));

    if (projects.length === 0) {
      process.stdout.write('All external skill repositories are already initialized.\n');
      return;
    }

    for (const project of projects) {
      fs.mkdirSync(path.join(root, path.dirname(project.dir)), { recursive: true });
      runGit(['submodule', 'add', project.url, project.dir], root);
      process.stdout.write(`Added ${project.type} submodule: ${project.dir}\n`);
    }
  });

skill
  .command('sync')
  .description('Sync configured vendor skills into skill-data')
  .option('--no-update', 'Skip git submodule update before copying skills')
  .option('--json', 'Output JSON')
  .action((opts: { update?: boolean; json?: boolean }) => {
    const root = detectPackageRoot();

    if (opts.update !== false) {
      runGit(['submodule', 'update', '--remote', '--merge'], root);
    }

    const result = syncVendorSkills();
    if (opts.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }

    for (const item of result.synced) process.stdout.write(`Synced ${item}\n`);
    for (const item of result.skipped) process.stderr.write(`Skipped missing ${item}\n`);
  });

skill
  .command('update')
  .description('Update external repositories and sync vendor skills into skill-data')
  .option('--json', 'Output JSON')
  .action((opts: { json?: boolean }) => {
    runGit(['submodule', 'update', '--remote', '--merge'], detectPackageRoot());
    const result = syncVendorSkills();

    if (opts.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }

    for (const item of result.synced) process.stdout.write(`Synced ${item}\n`);
    for (const item of result.skipped) process.stderr.write(`Skipped missing ${item}\n`);
  });

skill
  .command('check')
  .description('Check whether external skill repositories have upstream updates')
  .option('--json', 'Output JSON')
  .action((opts: { json?: boolean }) => {
    const root = detectPackageRoot();
    runGitSafe(['submodule', 'foreach', 'git fetch'], root);

    const rows = allExternalProjects()
      .map((project) => {
        const projectPath = path.join(root, project.dir);
        const behind = fs.existsSync(projectPath)
          ? Number.parseInt(runGitSafe(['rev-list', 'HEAD..@{u}', '--count'], projectPath) || '0', 10)
          : null;
        return { name: project.name, type: project.type, path: project.dir, behind };
      })
      .filter((row) => row.behind !== null);

    if (opts.json) {
      process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
      return;
    }

    if (rows.length === 0) {
      process.stdout.write('No initialized external skill repositories found.\n');
      return;
    }

    for (const row of rows) {
      process.stdout.write(`${row.path}\t${row.behind} commits behind\n`);
    }
  });

skill
  .command('cleanup')
  .description('Remove generated skill-data entries that are no longer listed in src/meta.ts')
  .option('--dry-run', 'Print stale generated skills without removing them')
  .action((opts: { dryRun?: boolean }) => {
    const root = detectPackageRoot();
    const generatedDir = path.join(root, GENERATED_SKILL_DIR);
    if (!fs.existsSync(generatedDir)) return;

    const expected = expectedGeneratedSkillNames();
    for (const entry of fs.readdirSync(generatedDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || manual.includes(entry.name) || expected.has(entry.name)) continue;

      const target = path.join(generatedDir, entry.name);
      if (opts.dryRun) {
        process.stdout.write(`Stale generated skill: ${entry.name}\n`);
      } else {
        fs.rmSync(target, { recursive: true, force: true });
        process.stdout.write(`Removed stale generated skill: ${entry.name}\n`);
      }
    }
  });

skill
  .command('list')
  .option('--json', 'Output JSON')
  .option('--all', 'Include hidden skills')
  .action((opts: { json?: boolean; all?: boolean }) => {
    const rows = discoverSkills(Boolean(opts.all)).map((s) => ({
      name: s.meta.name,
      description: s.meta.description || '',
      hidden: Boolean(s.meta.hidden),
      path: s.file,
    }));

    if (opts.json) {
      process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
      return;
    }

    for (const row of rows) {
      process.stdout.write(`${row.name}\t${row.description}\n`);
    }
  });

skill
  .command('path <name>')
  .option('--json', 'Output JSON')
  .action((name: string, opts: { json?: boolean }) => {
    const target = getSkillByName(name, true);
    if (!target) {
      process.stderr.write(`Skill not found: ${name}\n`);
      process.exitCode = 1;
      return;
    }

    if (opts.json) {
      process.stdout.write(`${JSON.stringify({ name, path: target.file }, null, 2)}\n`);
      return;
    }

    process.stdout.write(`${target.file}\n`);
  });

skill
  .command('get <name>')
  .option('--full', 'Return all files under the skill directory')
  .option('--json', 'Output JSON')
  .action((name: string, opts: { json?: boolean; full?: boolean }) => {
    const target = getSkillByName(name, true);
    if (!target) {
      process.stderr.write(`Skill not found: ${name}\n`);
      process.exitCode = 1;
      return;
    }

    const isFull = Boolean(opts.full);
    if (isFull) {
      const files = collectFilesRecursive(target.dir).map((filePath) => {
        const relPath = path.relative(target.dir, filePath).split(path.sep).join('/');
        const content = fs.readFileSync(filePath, 'utf8');
        return { path: relPath, content };
      });

      if (opts.json) {
        process.stdout.write(
          `${JSON.stringify(
            {
              name: target.meta.name,
              description: target.meta.description || '',
              hidden: Boolean(target.meta.hidden),
              path: target.file,
              dir: target.dir,
              files,
            },
            null,
            2,
          )}\n`,
        );
        return;
      }

      for (const file of files) {
        process.stdout.write(`--- FILE: ${file.path} ---\n`);
        process.stdout.write(file.content);
        if (!file.content.endsWith('\n')) process.stdout.write('\n');
        process.stdout.write('\n');
      }
      return;
    }

    const content = fs.readFileSync(target.file, 'utf8');

    if (opts.json) {
      process.stdout.write(
        `${JSON.stringify(
          {
            name: target.meta.name,
            description: target.meta.description || '',
            hidden: Boolean(target.meta.hidden),
            path: target.file,
            content,
          },
          null,
          2,
        )}\n`,
      );
      return;
    }

    process.stdout.write(content);
    if (!content.endsWith('\n')) process.stdout.write('\n');
  });

program.parse();
