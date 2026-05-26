---
name: fe_plus-components
description: Props, events, slots, and usage patterns for mix_fe_plus business UI components.
---

# fe_plus Components

Reference source:
- `/Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue`
- `/Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/`
- `/Users/standardsoftware/robin/git/mix_fe_plus/src/components/index/SerialTag.vue`

## Btn

Use `Btn` instead of `el-button` for AdsPower-designed buttons.

Source: `src/components/public/Btn.vue`, `src/components/public/models.ts`.

Key props:
- `type?: TypeList` where `TypeList = 'default' | 'text' | 'info' | 'plain' | 'white' | 'font' | 'blueBd' | 'green' | 'red' | 'yellow' | 'redBd'`
- `text?: string`
- `disabled?: boolean`
- `loading?: boolean`
- `svg?: string`, `svgColor?: string`, `svgWidth?: string`, `svgHeight?: string`
- `size?: 'small' | 'default' | 'large'`, default `large`
- `pd?: '8px' | '12px' | '16px' | '24px' | '32px'`
- `iconPosition?: 'left' | 'right'`
- `isStopPropagation?: boolean`, default `true`
- `isShowPay?: boolean`

Events and slots:
- Emits `click`, but not when `disabled` or `loading`.
- Slots: default and `#text`.

```vue
<Btn text="确认" type="default" :loading="saving" @click="submit" />
<Btn text="删除" type="redBd" svg="icon-delete" @click="remove" />
<Btn type="plain">
  <template #text>
    <span>自定义</span>
  </template>
</Btn>
```

## CheckBox

Use for project checkbox style and string-based models.

Source: `src/components/public/CheckBox.vue`.

Key props:
- `modelValue: string | number | boolean`, default `'0'`
- `trueLabel?: string | number`, `falseLabel?: string | number`
- `text?: string`, `tips?: string`
- `disabled?: boolean`
- `mustCheck?: boolean` shows error style
- `clickText?: boolean` lets text toggle checkbox
- `tooltip?: boolean`, `placement?: string`

Behavior:
- Without custom labels, toggles `'0'` and `'1'`.
- With `trueLabel` and `falseLabel`, toggles those values.
- Exposes `shakeFn()` for validation feedback.

```vue
<CheckBox v-model="agree" text="我已阅读" :click-text="true" :must-check="showError" />
<CheckBox v-model="mode" true-label="yes" false-label="no" text="启用" />
<CheckBox v-model="agree" text="协议" tips="请先阅读协议" tooltip />
```

## AdsInfo

Use for unified inline notice bars.

Source: `src/components/public/AdsInfo.vue`.

Key props:
- `modelValue?: boolean`, default `true`
- `type?: 'primary' | 'warning' | 'error'`
- `text: string`
- `hasIcon?: boolean`, default `true`
- `hasClose?: boolean`
- `isHtml?: boolean`
- `onlyText?: boolean`

Events:
- `update:modelValue(false)` when close icon is clicked.

```vue
<AdsInfo :text="$t('base.webLimit')" type="primary" />
<AdsInfo v-model="showTip" text="保存失败" type="error" has-close />
<AdsInfo text="<b>HTML</b>" is-html />
```

## AdsTooltip

Use instead of raw `el-tooltip` when tooltip styling or defaults should match the project.

Source: `src/components/public/AdsTooltip.vue`.

Defaults:
- `hideAfter: 0`
- `enterable: false`
- `showAfter: 300`
- `transition: false`
- `persistent: false`

Key props:
- Supports Element Plus tooltip attrs through `$attrs`.
- `placement?: 'top' | 'bottom' | 'left' | 'right' | string`
- `popperStyle?: string | object`
- `underlineText?: string`
- `maxWidth?: string`

Important:
- If tooltip content must be enterable, pass both `:enterable="true"` and `:hide-after="150"`.
- For long content, set `maxWidth`, usually `300px` if uncertain.

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

## AdsSvg

Use for sprite icons from `src/svgIcons`.

Source: `src/components/public/AdsSvg.vue`.

Key props:
- `href: string`, the symbol id / svg file name
- `width?: string | number`, default `16px`
- `height?: string | number`, default `16px`
- `color?: string`, default `currentColor`
- `colorFill?: string`, default `none`

Prefer controlling color from the parent CSS/current text color.

```vue
<AdsSvg href="icon-16pt-tips" />
<AdsSvg href="icon-add" width="24px" height="24px" />
```

## SerialTag

Use for displaying selected accounts/environments as tags with collapse/expand.

Source: `src/components/index/SerialTag.vue`.

Key props:
- `modelValue: any[]`
- `showKey: string`
- `maxlength?: number`, default `3`
- `type?: string`, default `default`
- `size?: string`, default `default`
- `hasClose?: boolean`, default `true`

Behavior:
- Displays the first `maxlength` items until user expands.
- Close removes the item and emits `update:modelValue`.
- Close button appears only when `hasClose` and list length > 1.

```vue
<SerialTag v-model="serialData" show-key="acc_id" />
<SerialTag v-model="rows" show-key="name" :maxlength="5" :has-close="false" />
```

## Switch

Use for AdsPower switch style instead of `el-switch`.

Source: `src/components/public/Switch.vue`.

Key props:
- `modelValue?: string | boolean`
- `value?: number | string` for readonly-ish value display
- `activeValue?: string`, `inactiveValue?: string`
- `disabled?: boolean`, `loading?: boolean`
- `text?: string`
- `beforeChange?: Function`
- `size?: 'small' | 'default'`
- `textFontSize?: 12 | 14 | 16`
- `onlyChange?: boolean`

Events:
- `update:modelValue(val: string)`
- `change(val: string)`

Behavior:
- Without custom values, toggles `'0'` and `'1'`.
- `beforeChange` may be async; falsy result cancels.
- With `onlyChange`, emits `change('')` and does not mutate model.

```vue
<Switch v-model="enabled" text="启用" />
<Switch v-model="state" active-value="open" inactive-value="closed" :before-change="confirmChange" />
<Switch v-model="enabled" loading text="处理中" />
```

## SwitchTitle

Use for segmented title/tab switching with AdsPower styles.

Source: `src/components/public/SwitchTitle.vue`.

Data item:
```ts
type DataItem = {
  text: string
  active: string
  isShow?: boolean
  tips?: string
  tooltipVisible?: boolean
  svg?: string
  showDot?: boolean
  disabled?: boolean
  isShowPay?: boolean
}
```

Key props:
- `modelValue: string`
- `data: DataItem[]`
- `popover?: boolean`, legacy, default `false`
- `newStyle?: boolean`, default `true`
- `isAsync?: boolean`
- `disabled?: boolean`

Events:
- `update:modelValue(val)` unless `isAsync`
- `change(val)` always on valid changed item

```vue
<SwitchTitle v-model="type" :data="list" :popover="false" />
<SwitchTitle v-model="type" :data="list" is-async @change="loadAndSetType" />
```

## AdsDropdown

Use only for product-specific dropdowns that Element Plus cannot satisfy, such as grouped creation dropdowns, browser create/edit dropdowns, OS dropdowns, tag dropdown-like single-color scenarios, team app dropdowns, User-Agent, and authorized groups.

Source: `src/components/public/AdsDropdown.vue`.

Common props:
- `dropdownList: any[]`
- `selectActive: any`
- `type: 'single' | 'multiple'`
- `showType?: 'input' | 'choose' | 'tag'`
- `chooseValue?: string`
- `labelKey?: string`
- `placeholder?: string`
- `loading?: boolean`, `requireLoading?: boolean`, `disabled?: boolean`
- `width?: string`, `contentWidth?: string`, `height?: string`
- `error?: string`

Creation and remote-loading props:
- `hasCreated?: boolean`
- `createTextPlaceholder?: string`
- `customCreated?: 'tag' | 'all'`
- `maxLength?: number`
- `noMore?: boolean`

Tag-mode props:
- `multipleLimit?: number`
- `tagWidth?: string`
- `showAllTag?: boolean`
- `tagInput?: boolean`
- `hasAll?: boolean`
- `id?: string`, required when tag layout must calculate widths

Advanced positioning:
- `popperOptions?: { placement?: 'top' | 'bottom' | 'auto'; strategy?: 'absolute' | 'fixed'; modifiers?: any[]; offset?: [number, number]; widthFollow?: boolean }`

Events:
- `onChangeValue(val)`
- `onChangeInput(val)` debounced by component
- `onVisibleChange(visible)`
- `onScrollBottom()`
- `onCreated(val)`
- `onDelTag(val)`
- `onPlacementChange(val)`

Slots:
- `#title` for `showType="choose"`
- `#content="{ data }"` with `customContent`
- `#icon="{ data }"`
- `#created` for creation customization

Expose:
- `showSelect`, `isCreated`, `clearInputValue()`, `clearCreatedText()`, `hideSelect()`, `updatePopper()`

```vue
<AdsDropdown
  :dropdown-list="groups"
  :select-active="activeGroup"
  type="single"
  show-type="choose"
  label-key="name"
  width="240px"
  @on-change-value="activeGroup = $event"
>
  <template #title>
    <span>{{ activeGroup?.name || $t('pleaseChoose') }}</span>
  </template>
</AdsDropdown>

<AdsDropdown
  id="tag-dropdown"
  :dropdown-list="tags"
  :select-active="selectedTags"
  type="multiple"
  show-type="tag"
  label-key="name"
  tag-input
  :multiple-limit="30"
  @on-change-value="toggleTag"
  @on-del-tag="removeTag"
/>
```

## TagDropdown

Use only for multi-color browser/proxy tags. Single-color tags should use `AdsDropdown`.

Source: `src/components/public/newTagDropdown/tagDropdown.vue`.

Key props:
- `width?: string`, default `100%`
- `contentWidth?: string`, default `100%`
- `placement?: 'top' | 'bottom'`
- `levelPlacement?: 'left' | 'right'`
- `hasCreate?: boolean`
- `useType?: 'browserList' | 'proxyList'`
- `multipleLimit?: number`, default `30`
- `selectRow?: any[]`
- `error?: string`
- `useDefaultHeader?: boolean`, default `true`
- `maxLength?: number`, default `50`
- `showAllTag?: boolean`
- `disabled?: boolean`

Events and slots:
- Emits `changeTag(val: any[])`.
- When `useDefaultHeader` is false, provide `#header="{ tagCount, isOpen, toggleDropdown }"`.
- Exposes `selectTag`, `showSelect`.

Behavior:
- Fetches tag list internally from browser/proxy tag APIs.
- Supports remote search, infinite scroll, creation, color selection, and max selection limit.

```vue
<TagDropdown
  :select-row="selectedTags"
  use-type="browserList"
  :multiple-limit="30"
  @change-tag="selectedTags = $event"
/>

<TagDropdown
  :select-row="proxyTags"
  use-type="proxyList"
  :has-create="false"
  show-all-tag
  @change-tag="proxyTags = $event"
/>
```

## Table

Use `Table` / component name `AdsTable` for project tables requiring unified style, selection, custom sorting, column customization, and optional TableV2 rendering.

Source: `src/components/public/Table.vue`, `src/components/public/table.ts`.

Required props:
- `id: string`
- `tableList: any[]`
- `columns: any[]`
- `loading: boolean`

Common props:
- `showSelect?: boolean`, default `true`
- `disabledSelect?: boolean`
- `rowHeight?: number`, default `56`
- `page?: number`, `pageSize?: number`
- `selectLimit?: number`
- `selectLimitMsg?: string`
- `selectedNum?: number`
- `selectRow?: any[]`
- `border?: boolean`
- `customSort?: boolean`
- `sortActive?: Record<string, 'asc' | 'desc'> | null`
- `autoTitleHeight?: boolean`
- `tableV2?: boolean`
- `rowKey?: string`

Cross-page selection:
- `isCrossPageCheck?: boolean`
- `crossPageKey?: string`, usually `id`
- Listen to `crossSelectChange`.

Column shape used by the component:
```ts
type AdsTableColumn = {
  key: string
  title: string
  type?: string
  minWidth?: number | string
  width?: number | string
  fixed?: boolean | 'left' | 'right'
  fixedColumn?: boolean
  sortable?: boolean
  visibility?: boolean
  align?: string
  cellAlign?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  render?: (row: any) => string
  slot?: string
}
```

Events:
- `selectChange(val)`
- `crossSelectChange(val)`
- `column-customize-click`
- `resetWidth(column, isV2?)`
- `isLongClick`
- `customSortFn(key, type)`
- `v2-header-dragend(newWidth, oldWidth, column)`

Expose:
- `clearAll()`
- `setCurrentRow(row | row[])`
- `toggleRowSelection(row, isChecked)`
- `resize()`
- `tableRef`
- `tableV2Ref`

```vue
<Table
  id="browserList"
  :table-list="rows"
  :columns="columns"
  :loading="loading"
  :page="page"
  :page-size="pageSize"
  :select-row="selectedRows"
  :select-limit="200"
  border
  custom-sort
  :sort-active="sortActive"
  @select-change="selectedRows = $event"
  @custom-sort-fn="handleSort"
  @column-customize-click="openColumnDialog"
>
  <template #name="{ row }">
    <span>{{ row.name }}</span>
  </template>
  <template #empty>
    <el-empty />
  </template>
</Table>
```

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/Btn.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/CheckBox.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsInfo.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsTooltip.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsSvg.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/index/SerialTag.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/Switch.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/SwitchTitle.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsDropdown.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/newTagDropdown/tagDropdown.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/Table.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/table.ts
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/models.ts
-->
