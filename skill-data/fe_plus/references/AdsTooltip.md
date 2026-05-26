---
name: fe_plus-ads-tooltip
description: Use AdsTooltip in mix_fe_plus for project tooltip defaults, underline trigger text, max width, and Element Plus tooltip passthrough.
---

# AdsTooltip

Use `AdsTooltip` instead of raw `el-tooltip` when tooltip styling or defaults should match the project.

Source: `src/components/public/AdsTooltip.vue`.

## Usage

```vue
<AdsTooltip placement="bottom" :content="$t('pricev7.userTip')">
  <span class="icon-tips"><AdsSvg href="icon-16pt-tips" /></span>
</AdsTooltip>

<AdsTooltip underline-text="了解更多" max-width="300px">
  <template #content>
    <p>较长提示内容。</p>
  </template>
</AdsTooltip>
```

## Key Points

- Defaults: `hideAfter: 0`, `enterable: false`, `showAfter: 300`, `transition: false`, `persistent: false`.
- Supports Element Plus tooltip attrs through `$attrs`.
- Common props: `placement`, `popperStyle`, `underlineText`, `maxWidth`.
- If tooltip content must be enterable, pass both `:enterable="true"` and `:hide-after="150"`.
- For long content, set `maxWidth`; use `300px` if uncertain.
- Use `#content` for structured content.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsTooltip.vue
-->
