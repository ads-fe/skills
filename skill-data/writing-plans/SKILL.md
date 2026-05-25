---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

## Language

Developer-readable content should use Simplified Chinese whenever practical, unless the user explicitly asks for another language or the repository's existing convention requires otherwise. This includes implementation plans, task descriptions, testing notes, review handoffs, git commit messages, and other content developers need to read or audit. Keep code, commands, paths, API names, quoted text, and tool output in their original language.

When writing a Simplified Chinese plan, translate the plan's structural boilerplate too: headings, labels, task/step names, handoff text, and checklist prose. Do not leave template labels such as "Implementation Plan", "Goal", "Architecture", "Tech Stack", "File Structure", "Task", "Files", "Step", "Expected", or "Plan complete" in English unless the user asked for English or the repository already uses those exact English headings.

**Context:** If working in an isolated worktree, it should have been created via the `superpowers:using-git-worktrees` skill at execution time.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User preferences for plan location override this default)

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

For Simplified Chinese plans, write this section heading as `## 文件结构`, and use labels such as `新建`、`修改`、`测试` instead of `Create`、`Modify`、`Test`.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Commit Steps

Commit steps must not contain a prewritten commit message. The executor determines the message from the staged diff at execution time.

Every commit step MUST include:
- **必需子技能：** 使用 using-git-commit skill
- Use a subagent to run `git add` for only the files modified by the current task
- Run `git diff --staged` to inspect the staged diff
- Generate the commit message from that staged diff according to `using-git-commit`
- Run `git commit` with the generated message

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [功能名称] 实施计划

> **给代理工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 按任务实施本计划。步骤使用复选框（`- [ ]`）语法跟踪。

**目标：** [用一句话说明要构建什么]

**架构：** [用 2-3 句话说明实现方案]

**技术栈：** [关键技术/库]

---
```

## Task Structure

````markdown
### 任务 N：[组件名称]

**文件：**
- 新建：`exact/path/to/file.py`
- 修改：`exact/path/to/existing.py:123-145`
- 测试：`tests/exact/path/to/test.py`

- [ ] **步骤 1：编写失败测试**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **步骤 2：运行测试并确认失败**

运行：`pytest tests/path/test.py::test_name -v`
预期：FAIL，报错包含 "function not defined"

- [ ] **步骤 3：编写最小实现**

```python
def function(input):
    return expected
```

- [ ] **步骤 4：运行测试并确认通过**

运行：`pytest tests/path/test.py::test_name -v`
预期：PASS

- [ ] **步骤 5：提交**

```bash
git add tests/path/test.py src/path/file.py
git diff --staged
```

**必需子技能：** 使用 using-git-commit skill

使用子代理根据 `using-git-commit` 从已暂存 diff 生成提交信息，然后用生成的提交信息运行 `git commit`。
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember
- Exact file paths always
- Complete code in every step — if a step changes code, show the code
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits
- Write developer-readable plan content in Simplified Chinese whenever practical
- Commit steps use staged diffs at execution time; do not prewrite `git commit -m "..."` messages in the plan

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.

**3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.

## Execution Handoff

After saving the plan, offer execution choice:

**"计划已完成并保存到 `docs/superpowers/plans/<filename>.md`。有两个执行选项：**

**1. 子代理驱动（推荐）** - 我会为每个任务派发新的子代理，并在任务之间审查，迭代更快

**2. 当前会话内执行** - 使用 executing-plans 在本会话中执行任务，并通过检查点分批审查

**你想采用哪种方式？"**

**如果选择子代理驱动：**
- **必需子技能：** 使用 superpowers:subagent-driven-development
- 每个任务使用新的子代理 + 两阶段审查

**如果选择当前会话内执行：**
- **必需子技能：** 使用 superpowers:executing-plans
- 分批执行，并在检查点审查
