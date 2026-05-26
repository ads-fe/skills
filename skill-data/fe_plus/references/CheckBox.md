---
name: fe_plus-checkbox
description: Use CheckBox in mix_fe_plus for project checkbox style, string models, custom labels, validation shake, and tooltip text.
---

# CheckBox

Use `CheckBox` for project checkbox style and string-based models.

Source: `src/components/public/CheckBox.vue`.

## Usage

```vue
<CheckBox v-model="agree" text="我已阅读" :click-text="true" :must-check="showError" />
<CheckBox v-model="mode" true-label="yes" false-label="no" text="启用" />
<CheckBox v-model="agree" text="协议" tips="请先阅读协议" tooltip />
```

## Key Points

- `modelValue: string | number | boolean`, default `'0'`.
- Without custom labels, toggles `'0'` and `'1'`.
- With `trueLabel` and `falseLabel`, toggles those values.
- Common props: `text`, `tips`, `disabled`, `mustCheck`, `clickText`, `tooltip`, `placement`.
- `mustCheck` shows error styling.
- `clickText` lets text toggle the checkbox.
- Exposes `shakeFn()` for validation feedback.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/CheckBox.vue
-->
