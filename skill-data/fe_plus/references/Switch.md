---
name: fe_plus-switch
description: Use Switch in mix_fe_plus for AdsPower switch style with string values, beforeChange, loading, and custom active values.
---

# Switch

Use `Switch` for AdsPower switch style instead of `el-switch`.

Source: `src/components/public/Switch.vue`.

## Usage

```vue
<Switch v-model="enabled" text="启用" />
<Switch v-model="state" active-value="open" inactive-value="closed" :before-change="confirmChange" />
<Switch v-model="enabled" loading text="处理中" />
```

## Key Points

- `modelValue?: string | boolean`.
- `value?: number | string` for readonly-ish value display.
- Without custom values, toggles `'0'` and `'1'`.
- `activeValue?: string`, `inactiveValue?: string`.
- `beforeChange` may be async; falsy result cancels.
- With `onlyChange`, emits `change('')` and does not mutate model.
- Common props: `disabled`, `loading`, `text`, `size`, `textFontSize`.
- Emits `update:modelValue(val: string)` and `change(val: string)`.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/Switch.vue
-->
