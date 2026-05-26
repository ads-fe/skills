---
name: fe_plus-ads-dropdown
description: Use AdsDropdown in mix_fe_plus for complex product dropdowns with creation, remote loading, custom content, and multi-select tags.
---

# AdsDropdown

Use `AdsDropdown` only for product-specific dropdowns that Element Plus cannot satisfy, such as grouped creation dropdowns, browser create/edit dropdowns, OS dropdowns, tag dropdown-like single-color scenarios, team app dropdowns, User-Agent, and authorized groups.

Source: `src/components/public/AdsDropdown.vue`.

## Usage

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

## Key Points

- Required/common props: `dropdownList`, `selectActive`, `type: 'single' | 'multiple'`, `showType?: 'input' | 'choose' | 'tag'`.
- Display props: `chooseValue`, `labelKey`, `placeholder`, `width`, `contentWidth`, `height`, `error`.
- State props: `loading`, `requireLoading`, `disabled`, `noMore`.
- Creation props: `hasCreated`, `createTextPlaceholder`, `customCreated?: 'tag' | 'all'`, `maxLength`.
- Tag-mode props: `multipleLimit`, `tagWidth`, `showAllTag`, `tagInput`, `hasAll`, `id`.
- Provide `id` when tag layout must calculate widths.
- Advanced positioning uses `popperOptions`.
- Events: `onChangeValue`, `onChangeInput`, `onVisibleChange`, `onScrollBottom`, `onCreated`, `onDelTag`, `onPlacementChange`.
- Slots: `#title`, `#content="{ data }"`, `#icon="{ data }"`, `#created`.
- Exposes `showSelect`, `isCreated`, `clearInputValue()`, `clearCreatedText()`, `hideSelect()`, `updatePopper()`.

<!--
Source references:
- /Users/standardsoftware/robin/git/mix_fe_plus/src/views/component.vue
- /Users/standardsoftware/robin/git/mix_fe_plus/src/components/public/AdsDropdown.vue
-->
