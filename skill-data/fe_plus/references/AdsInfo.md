---
name: fe_plus-ads-info
description: Use AdsInfo in mix_fe_plus for unified primary, warning, and error notice bars.
---

# AdsInfo

Use `AdsInfo` for unified inline notice bars.

Source: `src/components/public/AdsInfo.vue`.

## Usage

```vue
<AdsInfo :text="$t('base.webLimit')" type="primary" />
<AdsInfo v-model="showTip" text="保存失败" type="error" has-close />
<AdsInfo text="<b>HTML</b>" is-html />
```

## Key Points

- `modelValue?: boolean`, default `true`.
- `type?: 'primary' | 'warning' | 'error'`.
- `text: string`.
- `hasIcon` defaults to `true`.
- `hasClose` shows the close icon.
- `isHtml` renders `text` with `v-html`; only use with trusted/localized content.
- `onlyText` removes border, background, and padding.
- Emits `update:modelValue(false)` when close icon is clicked.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsInfo.vue
-->
