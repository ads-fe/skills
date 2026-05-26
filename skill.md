---
name: ads-fe
description: 在开始任何对话时使用 - 为代码开发设计的一套开发规范和技术栈规范。适用于任何开发技术栈、AI开发工程化方法论、需求规划、技术方案规划、执行编码任务、Code Review、commit等。
hidden: true
---


## 从这里开始

这个文件是发现入口，不是使用指南，但即使与下面的任何skill只有 1% 的相关性，也必须应用。在运行任何 `ads-fe` 命令之前，
必须先从 CLI 加载实际的核心行为准则 `karpathy-guidelines`、工作流 `using-superpowers`、代码规范 `core`：

```bash
ads-fe skill get karpathy-guidelines   # 核心行为准则
ads-fe skill get core                  # 基础编码规范
ads-fe skill get using-superpowers     # 工作流、工程化方法论
```

## 技术栈识别门禁

- 在制定方案或修改代码前，必须先检查项目特征，并结合需求目标，加载对应的专用技术栈 skills
- 如果在执行过程中发现新的技术栈、框架、测试工具或运行时边界，必须暂停当前实现，加载对应 skill 后再继续

## 专用技术栈 skills

当需求和编码与下面的技术栈相关时，加载下面对应的特殊 skill:

```bash
ads-fe skill get vite # vite
ads-fe skill get vitepress # vitepress
ads-fe skill get vitest # vitest
ads-fe skill get vue # vue
ads-fe skill get vue-best-practices # vue 最佳实践
ads-fe skill get vue-router-practices # vue-router 最佳实践
ads-fe skill get vue-testing-practices # vue testing 最佳实践
ads-fe skill get vueuse-functions # vueuse-functions
ads-fe skill get web-design-guidelines # web-design-guidelines
ads-fe skill get nuxt # Nuxt
ads-fe skill get pinia # pinia
ads-fe skill get pnpm # pnpm
ads-fe skill get slidev # slidev
ads-fe skill get tsdown # tsdown
ads-fe skill get turborepo # turborepo
ads-fe skill get node # node
ads-fe skill get fe_plus # mix_fe_plus 业务组件，优先级高于 element-plus-vue3
ads-fe skill get element-plus-vue3 # element plus vue3
```

运行 `ads-fe skill list` 查看当前已安装版本中可用的全部内容。

## superpowers 相关 skills

```bash
ads-fe skill get brainstorming
ads-fe skill get dispatching-parallel-agents
ads-fe skill get executing-plans
ads-fe skill get finishing-a-development-branch
ads-fe skill get receiving-code-review
ads-fe skill get subagent-driven-development
ads-fe skill get systematic-debugging
ads-fe skill get test-driven-development
ads-fe skill get using-git-worktrees
ads-fe skill get verification-before-completion
ads-fe skill get writing-plans
ads-fe skill get writing-skills
ads-fe skill get using-git-commit  # git commit message generation
```

## 动态加载协议

需要具体 skill 时，在运行时获取它，而不是预加载所有 skills。

1. 发现可用 skills:
   `ads-fe skill list --json`
2. 解析 skill 文件路径:
   `ads-fe skill path <skill-name>`
3. 动态加载 skill 内容:
   `ads-fe skill get <skill-name>`
4. 完整加载 skill 内容，包含完整命令参考和模板:
   `ads-fe skill get <skill-name> --full`

## 规则

- 不要预加载所有 skills。
- 始终通过 `ads-fe skill get` 从文件系统读取最新的 `SKILL.md`。
- 需要刷新内容时，重复执行 `get`。
- 使用 `--full` 前先尝试用 `ads-fe skill path` 获取 skill 路径，再按需读取 skill reference/template/scripts 等内容
- 使用 `superpowers` 和 `OpenSpec` skill 时，尽量使用中文生成 `/docs` 文档，并且不要提交和追踪文档
