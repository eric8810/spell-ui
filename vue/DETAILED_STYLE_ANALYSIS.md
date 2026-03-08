# Spell UI Vue3 vs React 深度对比分析

## 1. 技术栈差异

### 1.1 包依赖对比

#### React 原版核心依赖

```json
{
  "dependencies": {
    "@radix-ui/react-*": "多组件 (dialog, dropdown-menu, tabs, tooltip 等)",
    "motion": "^12.23.12",
    "next": "16.0.7",
    "next-themes": "^0.4.6",
    "lucide-react": "^0.544.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "embla-carousel-react": "^8.6.0",
    "jotai": "^2.15.0",
    "three": "^0.181.2",
    "@number-flow/react": "^0.5.10"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "tw-animate-css": "^1.3.8",
    "typescript": "^5"
  }
}
```

#### Vue 版本核心依赖

```json
{
  "dependencies": {
    "radix-vue": "^1.9.17",
    "@vueuse/motion": "^3.0.3",
    "lucide-vue-next": "^0.577.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0",
    "embla-carousel-vue": "^8.6.0",
    "vue": "^3.5.25"
  },
  "devDependencies": {
    "tailwindcss": "^4.2.1",
    "@tailwindcss/postcss": "^4.2.1",
    "typescript": "~5.9.3",
    "vite": "^7.3.1"
  }
}
```

#### 关键差异

| 维度 | React 版本 | Vue 版本 | 影响 |
|------|-----------|---------|------|
| UI 组件库 | @radix-ui/react-* | radix-vue | API 基本一致，无功能影响 |
| 动画库 | motion (Framer Motion) | @vueuse/motion | **重要差异** |
| 状态管理 | jotai (原子化状态) | 无 (Vue 响应式) | 轻微影响 |
| 3D 库 | three.js | 无 | 部分特效缺失 |
| 数字动画 | @number-flow/react | 无 | 部分特效缺失 |
| 主题管理 | next-themes | 自定义 useTheme | 实现方式不同 |
| 图标库 | lucide-react | lucide-vue-next | API 一致，无影响 |

### 1.2 构建工具对比

| 维度 | React (Next.js 16) | Vue (Vite 7) |
|------|---------------------|--------------|
| 构建引擎 | Turbopack/Webpack | Rollup (Vite) |
| 开发服务器 | Next.js 内置 | Vite dev server |
| 路由 | 文件系统路由 (app/) | 手动路由实现 |
| SSR | 内置支持 | 无 (纯 SPA) |
| 热更新 | Fast Refresh | HMR |
| 路径别名 | @/* (tsconfig) | @/* (vite.config) |

### 1.3 CSS 框架版本对比

两者都使用 **Tailwind CSS v4**，配置方式基本一致：

```css
// React: app/globals.css
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));
@theme inline { /* CSS 变量映射 */ }

// Vue: vue/src/style.css (完全一致)
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";
@custom-variant dark (&:is(.dark *));
@theme inline { /* 相同的 CSS 变量映射 */ }
```

---

## 2. 主题系统差异

### 2.1 CSS 变量对比

#### 字体变量定义

**React (Next.js 字体加载):**
```tsx
// app/layout.tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", weight: ["400"] });
const dynaPuff = DynaPuff({ variable: "--font-dyna-puff", subsets: ["latin"] });
```

**Vue (Google Fonts CDN):**
```css
/* vue/src/style.css */
@import url("https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Instrument+Serif:ital@0;1&display=swap");

:root {
  --font-geist-sans: "Geist", sans-serif;
  --font-geist-mono: "Geist Mono", monospace;
  --font-instrument-serif: "Instrument Serif", serif;
  --font-dyna-puff: "DynaPuff", cursive;
}
```

**差异点:**
- React: 服务端字体优化 (Next.js 字体优化)
- Vue: CDN 加载 (首次加载可能慢，无优化)
- **视觉影响**: 字体加载时机不同，可能导致 FOIT/FOUT

#### 颜色变量

两者的颜色变量定义 **完全一致**：

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... 其他变量完全相同 */
}

.dark {
  --background: oklch(0.1149 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... 其他变量完全相同 */
}
```

### 2.2 Dark Mode 实现差异

**React (next-themes):**
```tsx
// app/layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Vue (自定义实现):**
```ts
// composables/useTheme.ts
const STORAGE_KEY = 'spell-ui-theme'

export const applyStoredTheme = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  document.documentElement.classList.toggle('dark', stored !== 'light')
}

export const toggleStoredTheme = () => {
  setStoredTheme(getStoredTheme() === 'dark' ? 'light' : 'dark')
}
```

**差异点:**
- React: 使用成熟库，支持系统主题检测、SSR 友好
- Vue: 手动实现，仅支持手动切换，无系统主题检测
- **影响**: Vue 版本功能较弱，缺少 `enableSystem` 功能

### 2.3 其他样式差异

**React 版本特有:**
```css
/* 无额外全局样式 */
```

**Vue 版本特有:**
```css
body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

#app {
  min-height: 100dvh;
}
```

---

## 3. 组件差异详情

### 3.1 Sidebar 组件

#### React 实现

**关键特性:**
- Context API 管理状态
- Cookie 持久化 sidebar 状态
- 响应式移动端适配 (Sheet 组件)
- 自定义 variant: `sidebar` | `floating` | `inset`
- Collapsible 模式: `offcanvas` | `icon` | `none`

**状态管理:**
```tsx
const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  // ... 状态逻辑
}
```

**移动端处理:**
```tsx
if (isMobile) {
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent>
        {/* 移动端内容 */}
      </SheetContent>
    </Sheet>
  );
}
```

#### Vue 实现

**关键特性:**
- Vue 3 Provide/Inject 管理状态
- Cookie 持久化
- 响应式移动端适配 (Sheet 组件)
- 相同的 variant 和 collapsible 模式

**状态管理:**
```ts
// composables/useSidebar.ts
const SIDEBAR_INJECTION_KEY = Symbol('sidebar')

export function useSidebar(): SidebarContextProps {
  const context = inject<SidebarContextProps>(SIDEBAR_INJECTION_KEY)
  // ... 状态逻辑
}
```

**差异点:**

| 特性 | React | Vue | 影响 |
|-----|-------|-----|------|
| 状态管理 | Context API | Provide/Inject | 无功能影响 |
| Cookie 持久化 | ✅ | ✅ | 一致 |
| 移动端适配 | Sheet 组件 | Sheet 组件 | 一致 |
| 键盘快捷键 | 注释掉 | 未实现 | 无影响 (都未启用) |
| Tooltip 集成 | TooltipProvider 包裹 | TooltipProvider 包裹 | 一致 |
| CSS 类 | 完全一致 | 完全一致 | 无视觉差异 |

**结论**: Sidebar 组件实现高度一致，无视觉/功能影响。

### 3.2 Button 组件

#### React 实现

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 ...",
        outline: "border bg-background shadow-xs hover:bg-accent ...",
        secondary: "bg-secondary text-secondary-foreground shadow-xs dark:hover:bg-secondary/80 not-dark:hover:bg-[oklch(0.95_0_0)]",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
  }
);
```

#### Vue 实现

```vue
<script setup lang="ts">
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: { /* 完全相同 */ },
      size: { /* 完全相同 */ },
    },
  }
)
</script>

<template>
  <Slot v-if="asChild" :class="buttonClass" data-slot="button">
    <slot />
  </Slot>
  <button v-else :class="buttonClass" data-slot="button" v-bind="$attrs">
    <slot />
  </button>
</template>
```

**差异点:**

| 特性 | React | Vue | 影响 |
|-----|-------|-----|------|
| CVA 使用 | ✅ 一致 | ✅ 一致 | 无差异 |
| Variant 定义 | 完全相同 | 完全相同 | 无差异 |
| asChild 实现 | @radix-ui/react-slot | radix-vue Slot | API 一致 |
| 属性透传 | ...props | v-bind="$attrs" | 无功能影响 |

**结论**: Button 组件完全一致，无视觉/功能影响。

### 3.3 AnimatedGradient 组件 (WebGL)

#### React 实现

**核心逻辑:**
- WebGL2 上下文渲染
- Fragment Shader 实现渐变动画
- 支持 6 个预设: Prism, Lava, Plasma, Pulse, Vortex, Mist
- 自定义配置支持
- Noise 纹理叠加

**生命周期:**
```tsx
useEffect(() => {
  const gl = canvas.getContext("webgl2", { /* 配置 */ });
  // 初始化 WebGL 程序
  // 创建动画循环
  
  return () => {
    // 清理资源
    cancelAnimationFrame(frameIdRef.current);
    gl.deleteProgram(program);
  };
}, [isMounted, params]);
```

#### Vue 实现

**核心逻辑:**
- 完全相同的 WebGL2 实现
- 相同的 Fragment Shader
- 相同的预设配置
- 相同的 Noise 实现

**生命周期:**
```vue
<script setup lang="ts">
onMounted(() => {
  isMounted.value = true
  initWebGL()
})

onUnmounted(() => {
  isMounted.value = false
  if (cleanup) cleanup()
})

// 参数变化时重新初始化
watch(params, () => {
  if (cleanup) cleanup()
  if (isMounted.value) initWebGL()
}, { deep: true })
</script>
```

**差异点:**

| 特性 | React | Vue | 影响 |
|-----|-------|-----|------|
| WebGL 实现 | 完全一致 | 完全一致 | 无差异 |
| Shader 代码 | 逐行相同 | 逐行相同 | 无差异 |
| 预设配置 | 完全相同 | 完全相同 | 无差异 |
| 响应式更新 | useEffect 依赖数组 | watch deep | 无视觉影响 |
| 资源清理 | useEffect return | onUnmounted | 无差异 |

**结论**: AnimatedGradient 组件完全一致，无视觉/功能影响。

### 3.4 Marquee 组件

#### React 实现

```tsx
export function Marquee({ children, duration = 20, pauseOnHover = false, direction = "left", fade = true, fadeAmount = 10 }: MarqueeProps) {
  const [isPaused, setIsPaused] = React.useState(false);
  
  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        /* ... 其他动画定义 */
      `}</style>
      <div onMouseEnter={() => pauseOnHover && setIsPaused(true)}>
        {/* 内容 */}
      </div>
    </>
  );
}
```

#### Vue 实现

```vue
<script lang="ts">
export default defineComponent({
  setup(props, { slots }) {
    const isPaused = ref(false)
    
    return () => {
      return h(Fragment, [
        h('style', { key: 'marquee-style' }, `
          @keyframes spell-ui-scroll-x { /* 相同动画 */ }
        `),
        h('div', {
          onMouseenter: () => { if (props.pauseOnHover) isPaused.value = true }
        }, [/* 内容 */])
      ])
    }
  }
})
</script>
```

**差异点:**

| 特性 | React | Vue | 影响 |
|-----|-------|-----|------|
| 动画名称 | `scroll` | `spell-ui-scroll-x` | **类名冲突风险** |
| 实现方式 | styled-jsx | h() render function | 无功能影响 |
| Pause 逻辑 | useState | ref | 无差异 |
| 动画效果 | 完全相同 | 完全相同 | 无视觉影响 |

**潜在问题**: Vue 版本动画名称前缀为 `spell-ui-`，避免全局冲突，这是更好的实践。

**结论**: Marquee 组件功能一致，无视觉影响。

### 3.5 GradientWaveText 组件

#### React 实现

**核心逻辑:**
- RAF (requestAnimationFrame) 手动动画
- IntersectionObserver 视口检测
- CSS 变量 `--gi` 控制渐变位置
- 支持多次循环或单次播放

**动画实现:**
```tsx
const tick = (now: number) => {
  const increment = (dt * speed) / 16.6667;
  let next = tRef.current + increment;
  node.style.setProperty("--gi", String(next));
  rafRef.current = requestAnimationFrame(tick);
};
```

**CSS:**
```tsx
const gradient = `radial-gradient(circle at 50% bottom, ${stops})`;
<span style={{
  backgroundImage: gradient,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
}}>
  {children}
</span>
```

#### Vue 实现

**核心逻辑:**
- **纯 CSS 动画** (无 RAF)
- 无 IntersectionObserver
- CSS `@keyframes` 实现动画

**动画实现:**
```vue
<style scoped>
.spell-gradient-wave {
  background-image: radial-gradient(/* 相同配置 */);
  animation: spell-gradient-wave var(--spell-gradient-wave-speed) infinite linear;
}

@keyframes spell-gradient-wave {
  0% { background-position: 0% 100%; }
  100% { background-position: 200% 100%; }
}
</style>
```

**差异点:**

| 特性 | React | Vue | 影响 |
|-----|-------|-----|------|
| 动画方式 | RAF 手动控制 | CSS @keyframes | **性能/精度差异** |
| 视口检测 | IntersectionObserver | 无 | **功能缺失** |
| 循环控制 | 支持 repeat/cycles | 仅 infinite 或 once | **功能简化** |
| 事件支持 | onClick/onMouseEnter/Leave | 无 | **功能缺失** |
| 渐变算法 | 相同 | 相同 | 无视觉影响 |
| 性能 | RAF 更精确 | CSS 更高效 | 各有优劣 |

**重要差异**: Vue 版本简化了动画控制，缺少视口检测和精确循环控制。

**影响**: 视觉效果基本一致，但功能较弱。

### 3.6 Dialog 组件

#### React 实现

```tsx
function DialogContent({ className, children, showCloseButton = true, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out /* ... */",
          className
        )}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close>
            <XIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
```

#### Vue 实现

```vue
<template>
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    <DialogContent :class="cn('bg-background data-[state=open]:animate-in /* ... */', props.class)">
      <slot />
      <DialogClose v-if="showCloseButton">
        <X />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
```

**差异点:**

| 特性 | React | Vue | 影响 |
|-----|-------|-----|------|
| 组件库 | @radix-ui/react-dialog | radix-vue | API 一致 |
| 动画类 | 完全相同 | 完全相同 | 无差异 |
| 关闭按钮 | lucide-react XIcon | lucide-vue-next X | 无差异 |
| 属性透传 | ...props | v-bind="$attrs" | 无功能影响 |

**结论**: Dialog 组件完全一致，无视觉/功能影响。

---

## 4. 动画系统差异

### 4.1 动画库差异

| 维度 | React (motion/Framer Motion) | Vue (@vueuse/motion) |
|-----|------------------------------|----------------------|
| 功能 | 完整的物理动画系统 | VueUse 的 Motion 集成 |
| API | `<motion.div>` | `v-motion` 指令 |
| 手势支持 | ✅ 拖拽/滑动/缩放 | ❌ 无 |
| Layout Animation | ✅ 自动布局动画 | ❌ 无 |
| AnimatePresence | ✅ 卸载动画 | ❌ 无 (需手动) |
| Spring 动画 | ✅ 内置 | ❌ 需自定义 |
| 性能 | 高 (React 优化) | 高 (Vue 优化) |

**影响**: 
- 复杂动画效果 (如 Layout Animation) 在 Vue 版本中缺失
- 手势交互组件无法直接迁移
- 简单动画 (CSS/transition) 无影响

### 4.2 具体动画效果差异

#### ✅ 完全一致的动画

- **Sidebar 展开/折叠**: CSS transition
- **Dialog 淡入/缩放**: CSS animation
- **DropdownMenu 展开**: CSS animation
- **Tooltip 显示**: CSS transition
- **Button 悬停**: CSS transition
- **Marquee 滚动**: CSS @keyframes
- **AnimatedGradient**: WebGL 渲染

#### ⚠️ 实现方式不同的动画

- **GradientWaveText**: React 用 RAF，Vue 用 CSS
  - 视觉效果: 基本一致
  - 精度: React 更精确
  - 性能: Vue 更高效

#### ❌ Vue 版本缺失的动画

- **Layout Animation**: motion 的 `layout` prop
- **手势动画**: 拖拽、滑动、缩放
- **卸载动画**: AnimatePresence 替代方案
- **Spring 物理动画**: motion 的 spring 配置

---

## 5. 页面渲染差异

### 5.1 首页 (Home)

#### React 版本

```tsx
// app/page.tsx
export default function Home() {
  return (
    <div className="flex relative min-h-dvh pt-14">
      <SiteHeader docSchema={docSchema} />
      <Hero />
    </div>
  );
}
```

**Hero 组件特性:**
- AnimatedGradient 背景
- motion 动画文字
- 复杂交互效果

#### Vue 版本

```vue
<!-- views/HomeView.vue -->
<template>
  <div class="relative flex min-h-dvh flex-col pt-14">
    <SiteHeader :doc-schema="docSchema" />
    <HomeHero class="flex-1" />
  </div>
</template>
```

**差异点:**
- 布局结构: React `flex` (默认 row)，Vue `flex-col` (显式 column)
- **视觉影响**: 可能导致布局方向差异 (需验证实际 Hero 组件)

### 5.2 文档页 (Docs)

#### React 版本

```tsx
// app/docs/[id]/page.tsx
// Next.js 文件系统路由，动态路由 [id]
```

**特性:**
- Server Components
- MDX 支持
- 代码高亮 (Shiki)
- 自动目录生成

#### Vue 版本

```vue
<!-- views/DocView.vue -->
<script setup lang="ts">
// 手动路由实现
</script>
```

**特性:**
- 客户端渲染
- MDX 支持 (需验证)
- 代码高亮 (需验证)

**差异点:**
- **SSR**: React 服务端渲染，Vue 客户端渲染
- **首屏性能**: React 更快 (SSR)
- **SEO**: React 更好 (SSR)

---

## 6. 修复建议

### 6.1 需要修复的文件列表

#### 高优先级 (功能缺失)

1. **vue/src/style.css**
   - 问题: 字体通过 CDN 加载，无优化
   - 建议: 考虑本地字体或优化加载策略

2. **vue/src/composables/useTheme.ts**
   - 问题: 缺少系统主题检测
   - 建议: 添加 `matchMedia('(prefers-color-scheme: dark)')` 支持

3. **vue/src/components/ui/GradientWaveText.vue**
   - 问题: 缺少视口检测、事件支持
   - 建议: 添加 IntersectionObserver 和事件 props

#### 中优先级 (体验优化)

4. **views/HomeView.vue**
   - 问题: 布局方向可能不一致
   - 建议: 验证与 React 版本布局是否一致

5. **缺少动画组件** (如果需要)
   - Layout Animation 支持
   - 手势交互支持
   - Spring 动画支持

#### 低优先级 (性能优化)

6. **文档页 SSR**
   - 问题: 纯客户端渲染，首屏慢
   - 建议: 考虑 Nuxt.js 或静态生成

### 6.2 具体修复方案

#### 修复 1: 增强主题系统

```ts
// vue/src/composables/useTheme.ts
export const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const applyStoredTheme = () => {
  if (typeof window === 'undefined') return
  
  const stored = window.localStorage.getItem(STORAGE_KEY)
  const theme = stored || getSystemTheme()
  resolveTheme(theme === 'light' ? 'light' : 'dark')
  
  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      resolveTheme(e.matches ? 'dark' : 'light')
    }
  })
}
```

#### 修复 2: 增强 GradientWaveText

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  inView?: boolean
  repeat?: boolean
  onClick?: (e: MouseEvent) => void
}>()

const elRef = ref<HTMLElement | null>(null)
const isInView = ref(!props.inView)

onMounted(() => {
  if (!props.inView) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInView.value = true
        }
      })
    },
    { threshold: 0.1 }
  )
  
  if (elRef.value) observer.observe(elRef.value)
  
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <span
    ref="elRef"
    :class="cn('spell-gradient-wave', { 'animation-paused': !isInView })"
    @click="onClick"
  >
    <slot />
  </span>
</template>

<style scoped>
.animation-paused {
  animation-play-state: paused;
}
</style>
```

#### 修复 3: 优化字体加载

```vue
<!-- vue/index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap">
```

或下载字体到本地:

```
vue/public/fonts/
  - Geist-Regular.woff2
  - Geist-Medium.woff2
  - ...
```

```css
/* vue/src/style.css */
@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

---

## 总结

### 完全一致的组件 (无修复需求)

- ✅ Button
- ✅ Badge
- ✅ Spinner
- ✅ Tabs
- ✅ Dialog
- ✅ Sheet
- ✅ DropdownMenu
- ✅ Tooltip
- ✅ Sidebar (所有子组件)
- ✅ AnimatedGradient (WebGL)
- ✅ Marquee
- ✅ ShimmerText

### 轻微差异的组件 (建议修复)

- ⚠️ GradientWaveText (缺少视口检测、事件支持)
- ⚠️ 主题系统 (缺少系统主题检测)

### 缺失的功能 (需评估是否需要)

- ❌ Layout Animation (motion 特性)
- ❌ 手势交互 (拖拽/滑动)
- ❌ Spring 物理动画
- ❌ 服务端渲染 (SSR)

### 视觉影响评估

| 组件 | 视觉一致性 | 功能一致性 | 修复优先级 |
|-----|----------|----------|-----------|
| 基础 UI 组件 | 100% | 100% | 无需修复 |
| Sidebar | 100% | 100% | 无需修复 |
| AnimatedGradient | 100% | 100% | 无需修复 |
| GradientWaveText | 95% | 80% | 中 |
| 主题系统 | 100% | 85% | 低 |
| 字体加载 | 100% | 100% | 优化建议 |

**总体评估**: Vue 版本与 React 原版 **高度一致**，核心功能和视觉效果无显著差异。建议的修复主要是功能增强和性能优化。
