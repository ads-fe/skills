---
name: fe_plus-serial-tag
description: Use SerialTag in mix_fe_plus for selected account or environment tag lists with collapse, expand, and delete behavior.
---

# SerialTag

Use `SerialTag` for displaying selected accounts/environments as tags with collapse/expand.

Source: `src/components/index/SerialTag.vue`.

## Usage

```vue
<SerialTag v-model="serialData" show-key="acc_id" />
<SerialTag v-model="rows" show-key="name" :maxlength="5" :has-close="false" />
```

## Key Points

- `modelValue: any[]`.
- `showKey: string`.
- `maxlength?: number`, default `3`.
- `type?: string`, default `default`.
- `size?: string`, default `default`.
- `hasClose?: boolean`, default `true`.
- Displays the first `maxlength` items until the user expands.
- Close removes the item and emits `update:modelValue`.
- Close button appears only when `hasClose` and list length > 1.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/index/SerialTag.vue
-->
