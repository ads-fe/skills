---
name: ads-fe
description: AdsPower FE 为前端项目设计的一套开发工具和规范。适用于任何开发技术栈、AI开发工程化方法论、需求规划、技术方案规划、执行编码任务。
hidden: true
---


## 从这里开始

这个文件是发现入口，不是使用指南。在运行任何 `ads-fe` 命令之前，
先从 CLI 加载实际的工作流内容：

```bash
ads-fe skill get core              # 从这里开始：工作流、常见模式、故障排查
ads-fe skill get core --full       # 包含完整命令参考和模板
```

CLI 提供的 skill 内容始终与已安装版本匹配，因此说明不会过期。
这个入口文件的内容在不同发布版本之间不会变化，所以它只指向
`skills get core`。

## 专用 skills

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
ads-fe skill get element-plus-vue3 # element plus vue3
```

运行 `ads-fe skill list` 查看当前已安装版本中可用的全部内容。

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
