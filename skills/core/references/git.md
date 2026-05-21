---
name: git
description: "Git 提交规范，定义 commit message 的格式和类型。使用 @git 引用此规则以获取提交规范指导。"
---

# Git 提交规范

## Commit Message 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type 类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链/依赖更新
- `revert`: 回滚提交

## Scope 示例
- `user`: 用户模块
- `api`: API 相关
- `ui`: UI 组件
- `i18n`: 国际化
- `build`: 构建配置

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

### 更多示例
```bash
# 修复 Bug
fix(login): 修复验证码不显示的问题

# 重构代码
refactor(api): 重构用户 API 请求逻辑

# 性能优化
perf(table): 优化大数据表格渲染性能

# 更新文档
docs(readme): 更新项目安装说明
```

