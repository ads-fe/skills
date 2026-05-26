---
name: fe_plus
description: mix_fe_plus 项目的业务 UI 组件规范。Use when editing mix_fe_plus Vue views/components that use or should use Btn, CheckBox, AdsInfo, AdsTooltip, AdsSvg, SerialTag, Switch, SwitchTitle, AdsDropdown, TagDropdown, or Table. In mix_fe_plus, this skill has higher priority than element-plus-vue3 for these components.
metadata:
  author: Anthony Fu
  version: "2026.5.26"
  source: Hand-written from /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue and referenced component source
---

# fe_plus

在 `mix_fe_plus` 项目里应用或修改业务 UI 组件时，优先使用本 skill。它的优先级高于 `element-plus-vue3`：只要场景命中下面组件，就先参考这里；只有组件未覆盖、或需要查 Element Plus 底层 API 时，再加载 `element-plus-vue3`。

组件 demo 来源：`xxx/mix_fe_plus/src/views/component.vue`。

## Decision Rules

- 按 demo 约束：`Btn`、`CheckBox`、`AdsInfo`、`AdsTooltip`、`AdsSvg`、`SerialTag`、`Switch`、`SwitchTitle`、`AdsDropdown`、`TagDropdown`、`Table` 优先用 fe_plus 封装组件。
- demo 未列出的常规组件，统一用 Element Plus。
- 不要为这些组件重复写样式替代封装；先复用组件 props、slots、events。
- `AdsDropdown` 是特殊业务下拉，只有 Element Plus 下拉无法满足产品交互时使用。
- `TagDropdown` 仅用于代理标签、环境标签等多色标签；单色标签下拉用 `AdsDropdown`。
- 修改 `AdsDropdown`、`Table` 这类公用组件前必须全局确认影响面，它们被大量页面复用。

## Component Reference

| Component | Use For | Reference |
|-----------|---------|-----------|
| Btn | AdsPower 按钮样式、loading、icon、支付标签 | [components](references/components.md#btn) |
| CheckBox | 字符串/自定义值 checkbox、必选错误、tooltip 文案 | [components](references/components.md#checkbox) |
| AdsInfo | 统一信息、警告、错误提示条 | [components](references/components.md#adsinfo) |
| AdsTooltip | Element Plus tooltip 二次封装、下划线文本、最大宽度 | [components](references/components.md#adstooltip) |
| AdsSvg | svg sprite 图标 | [components](references/components.md#adssvg) |
| SerialTag | 多个环境/账号等序列 tag 展示和删除 | [components](references/components.md#serialtag) |
| Switch | AdsPower 开关，支持异步前置校验和 loading | [components](references/components.md#switch) |
| SwitchTitle | 分段标题切换 | [components](references/components.md#switchtitle) |
| AdsDropdown | 业务复杂下拉、创建、远程加载、多选 tag | [components](references/components.md#adsdropdown) |
| TagDropdown | 多色标签下拉、远程标签列表、创建标签 | [components](references/components.md#tagdropdown) |
| Table | AdsTable 业务表格、选择、跨页选择、列定制、TableV2 | [components](references/components.md#table) |

## Minimal Demo Pattern

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TypeList } from '~/components/public/models'

const checked = ref('0')
const enabled = ref('1')
const tab = ref('import')

const tabList = computed(() => [
  { text: '1', active: 'import', tips: '提示1' },
  { text: '2', active: 'export', tips: '提示2' },
])
</script>

<template>
  <Btn text="测试" :type="'default' as TypeList" />
  <CheckBox v-model="checked" text="测试" tips="测试" />
  <AdsInfo :text="$t('base.webLimit')" type="primary" />
  <AdsTooltip placement="bottom" :content="$t('pricev7.userTip')">
    <span class="icon-tips"><AdsSvg href="icon-16pt-tips" /></span>
  </AdsTooltip>
  <Switch v-model="enabled" text="测试" />
  <SwitchTitle v-model="tab" :data="tabList" :popover="false" />
</template>
```
