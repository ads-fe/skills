# ads-fe skill CLI

A TypeScript + commander implementation for dynamic skill discovery and retrieval.

## Install

```bash
pnpm install
pnpm build
```

## Global npm usage

After this package is published to npm, developers can install the CLI globally:

```bash
npm i -g ads-fe
ads-fe init codex
ads-fe init claude
ads-fe init cursor
```

Use `all` to install every supported target:

```bash
ads-fe init all
```

By default, `ads-fe init <agent>` installs into the user's global agent configuration so the skill is available from any project.

For project-local installation:

```bash
ads-fe init codex --project
ads-fe init claude --project
ads-fe init cursor --project
```

`ads-fe init <agent>` installs this package's bundled skill into an AI agent.

Install paths:

- Codex global: `~/.codex/skills/ads-fe/SKILL.md`
- Claude global: `~/.claude/skills/ads-fe/SKILL.md`
- Cursor global: `~/.cursor/skills/ads-fe/SKILL.md`
- Cursor project-local: `.cursor/skills/ads-fe/SKILL.md`

Cursor uses the Agent Skills directory layout and is no longer installed into `.cursor/rules`.

`ads-fe skill init` is different: it initializes external skill source repositories used to maintain this package.

## Commands

```bash
ads-fe init codex  # skill 安装到 codex 全局
ads-fe init claude # skill 安装到 claude code 全局
ads-fe init cursor                    # skill 安装到 cursor 全局
ads-fe init all --project             # 项目级安装
ads-fe remove all                     # Remove global codex/claude/cursor skills
ads-fe remove codex                   # Remove only the global codex skill
ads-fe skill remove all               # Alias for remove

# for ai 
ads-fe skill list # 内置 skill 列表
ads-fe skill list --json # json 格式输出内置 skill 列表
ads-fe skill get core  # 获取对应 skill.md
ads-fe skill get core --json # json 格式输出对应 skill 
ads-fe skill get core --full # 全量输出对应 skill
ads-fe skill get core --full --json
ads-fe skill path core # 获取对应 skill 路径

# for 内置 skill 更新维护
ads-fe skill init
ads-fe skill sync
ads-fe skill sync --no-update
ads-fe skill update
ads-fe skill check
ads-fe skill cleanup --dry-run
```

## Dynamic discovery behavior

Discovery order:

1. If `ADSPOWER_SKILL_DATA_DIR` is set, split by OS path delimiter and scan those directories first.
2. Otherwise scan project-root `skill-data/`.

For each child directory, if `SKILL.md` exists, it is discovered at runtime.
Frontmatter fields:

- `name`
- `description`
- `hidden`

`get` re-runs discovery each invocation and reads the current file content dynamically.

`get --full` recursively returns all files inside the target skill directory
(for example `references/`, `templates/`, `scripts/`).

## External official skills

External repositories are defined in `src/meta.ts`.

- `skill init` adds missing `sources/<name>` and `vendor/<name>` git submodules.
- `skill sync` updates submodules, then copies configured `vendor/<name>/skills/<source>` directories into `skill-data/<output>`.
- `skill sync --no-update` copies from the current local vendor checkout without pulling.
- `skill update` is an explicit update-and-sync command.
- `skill check` fetches initialized submodules and reports how many commits each is behind upstream.
- `skill cleanup` removes stale generated entries from `skill-data/` that are no longer listed in `src/meta.ts`; manual skills from `manual` are preserved.

Each synced skill gets a `SYNC.md` file with its source path, git SHA, and sync date. If a license file exists at the vendor repository root, it is copied as `LICENSE.md`.
