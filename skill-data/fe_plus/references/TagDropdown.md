---
name: fe_plus-tag-dropdown
description: Use TagDropdown in mix_fe_plus only for multi-color browser and proxy tag selection with remote search and creation.
---

# TagDropdown

Use `TagDropdown` only for multi-color browser/proxy tags. Single-color tags should use `AdsDropdown`.

Source: `src/components/public/newTagDropdown/tagDropdown.vue`.

## Usage

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

## Key Points

- `width?: string`, default `100%`.
- `contentWidth?: string`, default `100%`.
- `placement?: 'top' | 'bottom'`.
- `levelPlacement?: 'left' | 'right'`.
- `hasCreate?: boolean`.
- `useType?: 'browserList' | 'proxyList'`.
- `multipleLimit?: number`, default `30`.
- `selectRow?: any[]`.
- `error?: string`.
- `useDefaultHeader?: boolean`, default `true`.
- `maxLength?: number`, default `50`.
- `showAllTag?: boolean`.
- `disabled?: boolean`.
- Emits `changeTag(val: any[])`.
- When `useDefaultHeader` is false, provide `#header="{ tagCount, isOpen, toggleDropdown }"`.
- Exposes `selectTag`, `showSelect`.
- Fetches tag list internally from browser/proxy tag APIs.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/newTagDropdown/tagDropdown.vue
-->
