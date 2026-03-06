# 待完成组件迁移说明

## 1. Sidebar 组件

Sidebar 是一个复杂的侧边栏组件系统，包含以下子组件：
- SidebarProvider (Context Provider)
- Sidebar (主容器)
- SidebarTrigger
- SidebarRail
- SidebarInset
- SidebarInput
- SidebarHeader
- SidebarFooter
- SidebarSeparator
- SidebarContent
- SidebarGroup
- SidebarGroupLabel
- SidebarGroupAction
- SidebarGroupContent
- SidebarMenu
- SidebarMenuItem
- SidebarMenuButton
- SidebarMenuAction
- SidebarMenuBadge
- SidebarMenuSkeleton
- SidebarMenuSub
- SidebarMenuSubItem
- SidebarMenuSubButton

### 迁移难点：
1. 使用 React Context API 进行状态管理，需要改用 Vue 的 provide/inject
2. 包含复杂的响应式逻辑和移动端适配
3. 使用 cookie 存储状态
4. 集成了 Sheet 组件用于移动端显示
5. 使用 class-variance-authority 进行样式变体管理
6. 包含大量的条件渲染和状态计算

### 建议迁移方案：
1. 创建 useSidebar composable 替代 Context
2. 使用 provide/inject 在组件树中共享状态
3. 保持原有的样式类名和 data 属性
4. 简化 cookie 操作，可选使用 localStorage

## 2. Command 组件

Command 是一个命令面板组件，基于 Autocomplete 构建，包含：
- CommandDialog (使用 @base-ui/react/dialog)
- CommandDialogPortal
- CommandDialogTrigger
- CommandDialogBackdrop
- CommandDialogViewport
- CommandDialogPopup
- Command (基于 Autocomplete)
- CommandInput
- CommandList
- CommandEmpty
- CommandPanel
- CommandGroup
- CommandGroupLabel
- CommandCollection
- CommandItem
- CommandSeparator
- CommandShortcut
- CommandFooter

### 迁移难点：
1. 依赖 @base-ui/react/dialog，Vue 中没有直接对应
2. 依赖 Autocomplete 组件
3. 包含复杂的键盘导航和焦点管理
4. 需要处理搜索过滤逻辑

### 建议迁移方案：
1. 使用 radix-vue 的 Dialog 组件替代 @base-ui/react/dialog
2. 先完成 Autocomplete 迁移
3. 实现键盘导航逻辑
4. 使用 Vue 的 v-model 处理搜索状态

## 3. Autocomplete 组件

Autocomplete 是一个自动完成组件，包含：
- Autocomplete (使用 @base-ui/react/autocomplete)
- AutocompleteInput
- AutocompleteTrigger
- AutocompletePopup
- AutocompleteItem
- AutocompleteSeparator
- AutocompleteGroup
- AutocompleteGroupLabel
- AutocompleteEmpty
- AutocompleteRow
- AutocompleteValue
- AutocompleteList
- AutocompleteClear
- AutocompleteStatus
- AutocompleteCollection
- useAutocompleteFilter

### 迁移难点：
1. 依赖 @base-ui/react/autocomplete，Vue 生态中没有对应库
2. 包含复杂的下拉定位逻辑
3. 需要处理过滤、高亮、键盘导航
4. 集成了 ScrollArea 组件
5. 包含多种交互状态管理

### 建议迁移方案：
1. 考虑使用 @headlessui/vue 或 radix-vue 的 Combobox 组件
2. 或者使用第三方 Vue autocomplete 库如 vue-select
3. 或者基于 Popover + Input 自行实现基础功能
4. 保持样式类名一致以确保视觉效果

## 迁移优先级建议

1. **Autocomplete** - 基础组件，Command 依赖它
2. **Command** - 依赖 Autocomplete
3. **Sidebar** - 独立组件，但最复杂

## 所需依赖

可能需要安装的额外依赖：
```bash
npm install @headlessui/vue
# 或
npm install @vueuse/core  # 用于各种 composables
```

## 已完成的组件

✅ NativeSelect (3个子组件)
✅ ScrollArea (2个子组件)
✅ Sheet (8个子组件)
✅ DropdownMenu (13个子组件)

总计已迁移：26个组件文件
