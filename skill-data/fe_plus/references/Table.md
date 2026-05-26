---
name: fe_plus-table
description: Use Table / AdsTable in mix_fe_plus for project table style, selection, cross-page selection, custom sorting, column customization, and TableV2.
---

# Table

Use `Table` / component name `AdsTable` for project tables requiring unified style, selection, custom sorting, column customization, and optional TableV2 rendering.

Source: `src/components/public/Table.vue`, `src/components/public/table.ts`.

## Usage

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

## Key Points

- Required props: `id`, `tableList`, `columns`, `loading`.
- Common props: `showSelect`, `disabledSelect`, `rowHeight`, `page`, `pageSize`, `selectLimit`, `selectLimitMsg`, `selectedNum`, `selectRow`.
- Layout/sorting props: `border`, `customSort`, `sortActive`, `autoTitleHeight`, `tableV2`, `rowKey`.
- Cross-page selection props: `isCrossPageCheck`, `crossPageKey`, usually `id`.
- Events: `selectChange`, `crossSelectChange`, `column-customize-click`, `resetWidth`, `isLongClick`, `customSortFn`, `v2-header-dragend`.
- Exposes `clearAll()`, `setCurrentRow(row | row[])`, `toggleRowSelection(row, isChecked)`, `resize()`, `tableRef`, `tableV2Ref`.

## Column Shape

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

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/Table.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/table.ts
-->
