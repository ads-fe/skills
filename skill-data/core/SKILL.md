---
name: core
description: 用于动态加载的核心运行时技能，所有代码都应遵循这些编码规范。
hidden: false
---

## 编码实践

### 代码组织

- **单一职责原则 (Single Responsibility Principle)** - 每个源文件都应有清晰、聚焦的范围和用途，每个函数、类或模块只负责一个功能
- **开闭原则 (Open/Closed Principle)** - 对扩展开放，对修改封闭
- **里氏替换原则 (Liskov Substitution Principle)** - 子类型必须能够替换其父类型
- **接口隔离原则 (Interface Segregation Principle)** - 不应该强迫客户端依赖它们不使用的接口
- **依赖倒置原则 (Dependency Inversion Principle)** - 高层模块不应该依赖低层模块，都应该依赖抽象
- **拆分大型文件**：当文件变得过大或处理过多关注点时，应将其拆分
- **类型分离**：始终将类型和接口拆分到 `types.ts` 或 `types/*.ts` 中
- **常量提取**：将常量移到专用的 `constants.ts` 文件中

### 设计模式

尽量使用设计模式来提高代码的可维护性和扩展性。但不应过度设计。

### 运行时环境

- **优先编写同构代码**：尽可能编写与运行时无关、可在 Node、浏览器和 worker 中运行的代码
- **明确标注运行时**：当代码特定于某个环境时，在文件顶部添加注释：

```ts
// @env node
// @env browser
```

### TypeScript

- **显式返回类型**：尽可能显式声明返回类型
- **避免复杂的内联类型**：将复杂类型提取为专用的 `type` 或 `interface` 声明

## 重构/编码习惯

- **开发需求时遇到历史问题不符合规范的**，在改动范围有限可控的情况下应尽量同时优化，让结构更合理，并完善注释
- **由于历史技术债务，重构涉及大量文件改动或影响其他本次功能以外的重构，需要后续专门立项改动**，在写沿用旧逻辑写恶心代码的前面，必须写注释为什么这样干和干了什么
- **相同的场景代码不要搞多套**，尽量复用，除非业务分叉逻辑很大差异
- **修改旧逻辑一定要全局搜索**，大部分功能不会只改一处
- **重构后必须在git commit 时写明影响范围**，以防重构后影响原有功能

### 注释

- **避免不必要的注释**：代码应当自解释
- **解释“为什么”而不是“怎么做”**：注释应描述原因或意图，而不是描述代码做了什么

### 测试（Vitest）

- 测试文件：`foo.ts` -> `foo.test.ts`（同一目录）
- 使用 `describe`/`it` API（不要使用 `test`）
- 对复杂输出使用 `toMatchSnapshot`
- 对特定语言的快照使用 `toMatchFileSnapshot`，并显式指定路径


## References

| Topic | Description | Reference |
|-------|-------------|-----------|
| App Development | Vue/Nuxt/UnoCSS conventions and patterns | [app-development](references/app-development.md) |
| Monorepo | pnpm workspaces, centralized alias, Turborepo | [monorepo](references/monorepo.md) |
