---
name: git commit template
description: "Git 提交规范，定义 commit message 的格式和类型。使用 @git 引用此规则以获取提交规范指导。"
---

# Git 提交规范

## Commit Message 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

对应字段说明：
scope: 功能模块
subject: 简短、祈使句，且必须为中文。
body: 用列表或段落简述本次改动要点（可多行）。
footer: 可选，用于描述本次改动的背景、目的、影响等信息。
type 类型:
    - `feat`: 新功能
    - `fix`: 修复 bug
    - `docs`: 文档更新
    - `style`: 代码格式调整（不影响功能）
    - `refactor`: 重构（不是新功能也不是修复）
    - `perf`: 性能优化
    - `test`: 测试相关
    - `chore`: 构建/工具链/依赖更新
    - `revert`: 回滚提交

## Commit Message 示例

### 简单提交
```bash
feat(user): 添加用户登录功能
```

### 详细提交（推荐）
```bash
feat(user): 添加用户登录功能

- 实现登录表单验证
- 集成第三方认证
- 添加记住密码功能
- 更新相关国际化文案
```
