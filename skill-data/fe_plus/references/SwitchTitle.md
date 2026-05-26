---
name: fe_plus-switch-title
description: Use SwitchTitle in mix_fe_plus for AdsPower segmented title or tab switching.
---

# SwitchTitle

Use `SwitchTitle` for segmented title/tab switching with AdsPower styles.

Source: `src/components/public/SwitchTitle.vue`.

## Usage

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const type = ref('import')
const list = computed(() => [
  { text: '1', active: 'import', tips: '提示1' },
  { text: '2', active: 'export', tips: '提示2' },
])
</script>

<template>
  <SwitchTitle v-model="type" :data="list" :popover="false" />
  <SwitchTitle v-model="type" :data="list" is-async @change="loadAndSetType" />
</template>
```

## Key Points

- `modelValue: string`.
- `data` item fields: `text`, `active`, `isShow`, `tips`, `tooltipVisible`, `svg`, `showDot`, `disabled`, `isShowPay`.
- `popover?: boolean` is legacy and defaults to `false`.
- `newStyle?: boolean`, default `true`.
- `isAsync?: boolean`.
- `disabled?: boolean`.
- Emits `update:modelValue(val)` unless `isAsync`.
- Emits `change(val)` on valid changed item.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/SwitchTitle.vue
-->
