---
name: fe_plus-ads-svg
description: Use AdsSvg in mix_fe_plus for svg sprite icons from src/svgIcons.
---

# AdsSvg

Use `AdsSvg` for sprite icons from `src/svgIcons`.

Source: `src/components/public/AdsSvg.vue`.

## Usage

```vue
<AdsSvg href="icon-16pt-tips" />
<AdsSvg href="icon-add" width="24px" height="24px" />
```

## Key Points

- `href: string` is the symbol id / svg file name.
- `width?: string | number`, default `16px`.
- `height?: string | number`, default `16px`.
- `color?: string`, default `currentColor`.
- `colorFill?: string`, default `none`.
- Prefer controlling icon color from parent CSS/current text color.
- `icon-16pt-tips` receives project-specific default color handling.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsSvg.vue
-->
