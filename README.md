# ads-fe skill CLI

一个基于 TypeScript 和 commander 实现的动态 skill 发现与获取工具。

## 安装

```bash
pnpm install
pnpm build
```

## 全局 npm 用法

当这个包发布到 npm 后，开发者可以全局安装 CLI：

```bash
npm i -g ads-fe
ads-fe init codex
ads-fe init claude
ads-fe init cursor
```

使用 `all` 安装所有支持的目标：

```bash
ads-fe init all
```

默认情况下，`ads-fe init <agent>` 会安装到用户的全局 agent 配置中，因此该 skill 可以在任意项目中使用。

如需安装到当前项目：

```bash
ads-fe init codex --project
ads-fe init claude --project
ads-fe init cursor --project
```

`ads-fe init <agent>` 会把这个包内置的 skill 安装到 AI agent 中。

安装路径：

- Codex 全局：`~/.codex/skills/ads-fe/SKILL.md`
- Claude 全局：`~/.claude/skills/ads-fe/SKILL.md`
- Cursor 全局：`~/.cursor/skills/ads-fe/SKILL.md`
- Codex 项目级：`.codex/skills/ads-fe/SKILL.md`
- Claude 项目级：`.claude/skills/ads-fe/SKILL.md`
- Cursor 项目级：`.cursor/skills/ads-fe/SKILL.md`

自动入口文件：

- Codex 全局：追加 `~/.codex/AGENTS.md`
- Codex 项目级：追加 `AGENTS.md`
- Claude 全局：追加 `~/.claude/CLAUDE.md`
- Claude 项目级：追加 `CLAUDE.md`
- Cursor 全局：生成 `~/.cursor/rules/ads-fe.mdc`
- Cursor 项目级：生成 `.cursor/rules/ads-fe.mdc`

`ads-fe skill init` 与上面的命令不同：它会初始化外部 skill 源仓库，这些仓库用于维护本包。

## 命令

```bash
ads-fe init codex  # skill 安装到 codex 全局
ads-fe init claude # skill 安装到 claude code 全局
ads-fe init cursor                    # skill 安装到 cursor 全局
ads-fe init all --project             # 项目级安装
ads-fe remove all                     # 移除 codex/claude/cursor 全局 skill
ads-fe remove codex                   # 只移除 codex 全局 skill
ads-fe skill remove all               # remove 的等价别名

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

## 动态发现行为

发现顺序：

1. 如果设置了 `ADSPOWER_SKILL_DATA_DIR`，则按操作系统的路径分隔符拆分，并优先扫描这些目录。
2. 否则扫描项目根目录下的 `skill-data/`。

对于每个子目录，如果存在 `SKILL.md`，就会在运行时被发现。
Frontmatter 字段：

- `name`
- `description`
- `hidden`

`get` 每次调用都会重新执行发现流程，并动态读取当前文件内容。

`get --full` 会递归返回目标 skill 目录中的所有文件
（例如 `references/`、`templates/`、`scripts/`）。

## 外部官方 skills

外部仓库定义在 `src/meta.ts` 中。

- `skill init` 会添加缺失的 `sources/<name>` 和 `vendor/<name>` git submodule。
- `skill sync` 会更新 submodule，然后把配置的 `vendor/<name>/skills/<source>` 目录复制到 `skill-data/<output>`。
- `skill sync --no-update` 会从当前本地 vendor checkout 复制，不执行拉取。
- `skill update` 是显式的更新并同步命令。
- `skill check` 会 fetch 已初始化的 submodule，并报告每个 submodule 落后 upstream 多少个 commit。
- `skill cleanup` 会删除 `skill-data/` 中不再列在 `src/meta.ts` 中的陈旧生成项；来自 `manual` 的手动 skills 会被保留。

每个同步得到的 skill 都会获得一个 `SYNC.md` 文件，其中包含来源路径、git SHA 和同步日期。如果 vendor 仓库根目录存在 license 文件，它会被复制为 `LICENSE.md`。
