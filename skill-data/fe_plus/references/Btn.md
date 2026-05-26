---
name: fe_plus-btn
description: Use Btn in mix_fe_plus for AdsPower-designed buttons with loading, icons, and button type variants.
---

# Btn

Use `Btn` instead of `el-button` for AdsPower-designed buttons.

Source: `src/components/public/Btn.vue`, `src/components/public/models.ts`.

## Usage

```vue
<Btn text="确认" type="default" :loading="saving" @click="submit" />
<Btn text="删除" type="redBd" svg="icon-delete" @click="remove" />
<Btn type="plain">
  <template #text>
    <span>自定义</span>
  </template>
</Btn>
```

## Key Points

- `type?: TypeList`, where `TypeList = 'default' | 'text' | 'info' | 'plain' | 'white' | 'font' | 'blueBd' | 'green' | 'red' | 'yellow' | 'redBd'`.
- Common props: `text`, `disabled`, `loading`, `svg`, `svgColor`, `svgWidth`, `svgHeight`.
- `size?: 'small' | 'default' | 'large'`, default `large`.
- `pd?: '8px' | '12px' | '16px' | '24px' | '32px'`.
- `iconPosition?: 'left' | 'right'`.
- `isStopPropagation` defaults to `true`.
- Emits `click`, but not when `disabled` or `loading`.
- Slots: default and `#text`.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/Btn.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/models.ts
-->
