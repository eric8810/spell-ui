import { promises as fs } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { codeToHtml } from 'shiki'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vueRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(vueRoot, '..')
const docsRoot = path.join(repoRoot, 'docs')
const generatedRoot = path.join(vueRoot, 'src/generated')
const generatedDocsRoot = path.join(generatedRoot, 'docs')

const toPosix = (value) => value.split(path.sep).join('/')
const toKebabCase = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const ensureDir = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

const writeFile = async (filePath, content) => {
  await ensureDir(filePath)
  await fs.writeFile(filePath, content, 'utf8')
}

const toPascalCase = (value) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

const createDocDemoEntries = (docId, variants) => {
  const component = `@/demos/spell-ui/${docId}/${toPascalCase(docId)}Demo.vue`

  return Object.fromEntries(
    Object.entries(variants).flatMap(([file, config]) => {
      const props = typeof config === 'string' ? { variant: config } : (config ?? {})
      return [
        [`docs/${docId}/${file}.tsx`, { component, props }],
        [`docs/${docId}/${file}.vue`, { component, props }],
      ]
    }),
  )
}

const demoRegistry = {
  ...createDocDemoEntries('animated-checkbox', { demo: 'default' }),
  ...createDocDemoEntries('animated-gradient', { demo: 'default', 'demo-presets': 'presets' }),
  ...createDocDemoEntries('badge', { demo: 'default', 'demo-colors': 'colors', 'demo-sizes': 'sizes' }),
  ...createDocDemoEntries('bars-spinner', { demo: 'default', 'demo-sizes': 'sizes' }),
  ...createDocDemoEntries('blur-reveal', { demo: 'default', 'demo-speed': 'speed' }),
  ...createDocDemoEntries('color-selector', { demo: 'default', 'demo-sizes': 'sizes', 'demo-callback': 'callback' }),
  ...createDocDemoEntries('copy-button', { demo: 'default', 'demo-custom': 'custom' }),
  ...createDocDemoEntries('exploding-input', { demo: 'default' }),
  ...createDocDemoEntries('flow-button', { demo: 'default', 'demo-sizes': 'sizes', 'demo-colors': 'colors' }),
  ...createDocDemoEntries('gradient-wave-text', { demo: 'default' }),
  ...createDocDemoEntries('highlighted-text', { demo: 'default', 'demo-direction': 'direction' }),
  ...createDocDemoEntries('kbd', { demo: 'default', 'demo-symbols': 'symbols', 'demo-custom': 'custom' }),
  ...createDocDemoEntries('label-input', { demo: 'default', 'demo-password': 'password', 'demo-colors': 'colors' }),
  ...createDocDemoEntries('light-rays', { demo: 'default', 'demo-multi': 'multi' }),
  ...createDocDemoEntries('logos-carousel', { demo: 'default', 'demo-count': 'count' }),
  ...createDocDemoEntries('marquee', { demo: 'default', 'demo-pause': 'pause', 'demo-vertical': 'vertical' }),
  ...createDocDemoEntries('perspective-book', { demo: 'default', 'demo-textured': 'textured' }),
  ...createDocDemoEntries('pop-button', { demo: 'default', 'demo-sizes': 'sizes', 'demo-variant': 'variant' }),
  ...createDocDemoEntries('randomized-text', { demo: 'default', 'demo-split': 'split' }),
  ...createDocDemoEntries('rich-button', { demo: 'default', 'demo-sizes': 'sizes', 'demo-colored': 'colored' }),
  ...createDocDemoEntries('shimmer-text', { demo: 'default', 'demo-colors': 'colors' }),
  ...createDocDemoEntries('signature', { demo: 'default', 'demo-contrast': 'contrast' }),
  ...createDocDemoEntries('slide-up-text', { demo: 'default', 'demo-stagger': 'stagger', 'demo-split': 'split' }),
  ...createDocDemoEntries('special-text', { demo: 'default', 'demo-speed': 'speed' }),
  ...createDocDemoEntries('spinner', { demo: 'default', 'demo-sizes': 'sizes', 'demo-speeds': 'speeds', 'demo-colors': 'colors' }),
  ...createDocDemoEntries('spotify-card', { demo: 'default', 'demo-carousel': 'carousel' }),
  ...createDocDemoEntries('text-marquee', { demo: 'default', 'demo-speed': 'speed' }),
  ...createDocDemoEntries('tweet', { demo: {} }),
  ...createDocDemoEntries('words-stagger', { demo: 'default', 'demo-speed': 'speed', 'demo-stagger': 'stagger' }),
}

const normalizeLang = (lang, filePath = '') => {
  if (lang) {
    return lang.toLowerCase()
  }

  const ext = path.extname(filePath).replace(/^\./, '').toLowerCase()
  return ext || 'text'
}

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const escapeAttribute = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const renderInlineMarkdown = (value) => {
  const htmlChunks = []
  const textWithPlaceholders = value.replace(/<code[\s\S]*?<\/code>/g, (match) => {
    htmlChunks.push(match.replaceAll('className=', 'class='))
    return `@@HTML${htmlChunks.length - 1}@@`
  })

  const pattern = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  let output = ''
  let lastIndex = 0
  let match = pattern.exec(textWithPlaceholders)

  while (match) {
    output += escapeHtml(textWithPlaceholders.slice(lastIndex, match.index))

    if (match[1]) {
      output += `<code>${escapeHtml(match[1])}</code>`
    } else {
      const [, , label, href] = match
      const external = /^(https?:\/\/|mailto:|tel:)/i.test(href)
      output += `<a href="${escapeAttribute(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(label)}</a>`
    }

    lastIndex = match.index + match[0].length
    match = pattern.exec(textWithPlaceholders)
  }

  output += escapeHtml(textWithPlaceholders.slice(lastIndex))

  return output.replace(/@@HTML(\d+)@@/g, (_, index) => htmlChunks[Number(index)] ?? '')
}

const slugify = (value, seen) => {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[!'"#$%&()*+,./:;<=>?@[\\\]^`{|}~]/g, '')
    .replace(/\s+/g, '-')

  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

const isBlankLine = (line) => line.trim().length === 0

const collectUntil = (lines, startIndex, endMatcher) => {
  const collected = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    collected.push(line)

    if (endMatcher(line, index)) {
      return {
        lines: collected,
        nextIndex: index + 1,
      }
    }

    index += 1
  }

  return {
    lines: collected,
    nextIndex: lines.length,
  }
}

const parseCodeFenceInfo = (infoLine) => {
  const trimmed = infoLine.trim()

  if (!trimmed) {
    return { lang: 'text', file: '' }
  }

  const parts = trimmed.split(/\s+/)
  let lang = 'text'
  let file = ''

  for (const part of parts) {
    if (part.includes('=')) {
      const [key, rawValue] = part.split('=')
      const value = rawValue?.replace(/^['"]|['"]$/g, '') ?? ''
      if (key === 'file') {
        file = value
      }
      continue
    }

    if (lang === 'text') {
      lang = part
    }
  }

  return { lang, file }
}

const transformDocCode = (code) =>
  code
    .replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+["']@\/registry\/spell-ui\/[^"'\n]+["'];?/g, 'import { $1 } from "@/components/ui"')
    .replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+["']@\/components\/[^"'\n]+["'];?/g, 'import { $1 } from "@/components/ui"')
    .replace(/import\s+([A-Za-z0-9_]+)\s+from\s+["']@\/registry\/spell-ui\/[^"'\n]+["'];?/g, 'import { $1 } from "@/components/ui"')
    .replace(/import\s+([A-Za-z0-9_]+)\s+from\s+["']@\/components\/[^"'\n]+["'];?/g, 'import { $1 } from "@/components/ui"')
    .replace(/import\s+\{\s*Rays\s*\}\s+from\s+["']@\/components\/ui["'];?/g, 'import { LightRays } from "@/components/ui"')
    .replaceAll('className=', 'class=')
    .replaceAll('onClick=', '@click=')
    .replaceAll('onColorSelect=', '@color-select=')
    .replaceAll('onCheckedChange=', '@checked-change=')
    .replaceAll('defaultValue=', 'default-value=')
    .replaceAll('defaultChecked', 'default-checked')
    .replaceAll('ringColor=', 'ring-color=')
    .replaceAll('pauseOnHover', 'pause-on-hover')
    .replaceAll('inView', 'in-view')
    .replaceAll('raysColor=', 'rays-color=')
    .replaceAll('backgroundColor=', 'background-color=')
    .replaceAll('fontSize=', 'font-size=')
    .replaceAll('speedReveal=', 'speed-reveal=')
    .replaceAll('speedSegment=', 'speed-segment=')
    .replaceAll('<Rays', '<LightRays')
    .replaceAll('</Rays>', '</LightRays>')
    .replace(/(\s)([A-Za-z][\w-]*)=\{\{([\s\S]*?)\}\}/g, (_, space, name, expr) => `${space}:${name}='${`{ ${expr.trim()} }`}'`)
    .replace(/(@[a-z-]+)=\{([^{}]+)\}/g, (_, name, expr) => `${name}='${expr.trim()}'`)
    .replace(/(\s)([A-Za-z][\w-]*)=\{([^{}]+)\}/g, (_, space, name, expr) => `${space}:${name}='${expr.trim()}'`)
    .replaceAll('React.ReactNode', 'VNodeChild')
    .replaceAll('ReactNode[]', 'VNodeChild[]')
    .replaceAll('ReactNode', 'VNodeChild')
    .replaceAll('React.CSSProperties', 'CSSProperties')

const transformPropName = (name) => {
  if (name === 'children') {
    return 'default'
  }

  if (name === 'className') {
    return 'class'
  }

  if (/^on[A-Z]/.test(name)) {
    return `@${toKebabCase(name.slice(2))}`
  }

  if (/[A-Z]/.test(name)) {
    return toKebabCase(name)
  }

  return name
}

const transformPropType = (value) =>
  typeof value === 'string'
    ? value
        .replaceAll('React.ReactNode', 'VNodeChild')
        .replaceAll('ReactNode[]', 'VNodeChild[]')
        .replaceAll('ReactNode', 'VNodeChild')
        .replaceAll('React.CSSProperties', 'CSSProperties')
        .replaceAll('keyof JSX.IntrinsicElements', 'keyof HTMLElementTagNameMap | string')
    : value

const transformPropsTableData = (rows) =>
  rows
    .filter((row) => row.name !== 'asChild')
    .map((row) => ({
      ...row,
      name: typeof row.name === 'string' ? transformPropName(row.name) : row.name,
      type: transformPropType(row.type),
      default: transformPropType(row.default),
      typeDetails: transformPropType(row.typeDetails),
      nameDetails: transformPropType(row.nameDetails),
    }))

const highlightCode = async (code, lang) => {
  try {
    return await codeToHtml(code, {
      lang: normalizeLang(lang),
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    })
  } catch {
    return codeToHtml(code, {
      lang: 'text',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    })
  }
}

const readCodeBlock = async (docId, infoLine, bodyLines) => {
  const { lang, file } = parseCodeFenceInfo(infoLine)

  if (file) {
    const absolutePath = path.resolve(docsRoot, docId, file)
    const sourcePath = toPosix(path.relative(repoRoot, absolutePath))
    const code = transformDocCode(await fs.readFile(absolutePath, 'utf8'))
    return {
      code,
      html: await highlightCode(code, normalizeLang(lang, absolutePath)),
      sourcePath,
    }
  }

  const code = transformDocCode(bodyLines.join('\n'))
  return {
    code,
    html: await highlightCode(code, normalizeLang(lang)),
    sourcePath: '',
  }
}

const parsePropsTableData = (blockSource) => {
  const match = blockSource.match(/data=\{([\s\S]*?)\}\s*\/\s*>/)
  if (!match) {
    throw new Error(`Unable to parse PropsTable block:\n${blockSource}`)
  }

  return vm.runInNewContext(match[1], Object.create(null))
}

const parsePreviewClass = (blockSource) => {
  const previewMatch = blockSource.match(/<DemoPreview([^>]*)>/)
  if (!previewMatch) {
    return ''
  }

  const classMatch = previewMatch[1]?.match(/(?:className|class)="([^"]+)"/)
  return classMatch?.[1] ?? ''
}

const getCodeFenceFromBlock = async (docId, blockLines) => {
  const start = blockLines.findIndex((line) => line.trimStart().startsWith('```'))
  if (start < 0) {
    throw new Error(`Missing code fence in block for ${docId}`)
  }

  const end = blockLines.findIndex((line, index) => index > start && line.trim() === '```')
  if (end < 0) {
    throw new Error(`Unclosed code fence in block for ${docId}`)
  }

  return readCodeBlock(docId, blockLines[start].trim().slice(3), blockLines.slice(start + 1, end))
}

const parseDemoCanvas = async (lines, startIndex, docId) => {
  const { lines: blockLines, nextIndex } = collectUntil(lines, startIndex, (line) => line.trim() === '</DemoCanvas>')
  const blockSource = blockLines.join('\n')
  const previewClass = parsePreviewClass(blockSource)
  const codeBlock = await getCodeFenceFromBlock(docId, blockLines)

  const demoEntry = demoRegistry[codeBlock.sourcePath]
  if (!demoEntry) {
    throw new Error(`Missing Vue demo mapping for ${codeBlock.sourcePath}`)
  }

  return {
    block: {
      type: 'demo',
      demoPath: codeBlock.sourcePath,
      demoProps: demoEntry.props ?? {},
      previewClass,
      codeHtml: codeBlock.html,
    },
    nextIndex,
  }
}

const parseInstallationTabs = async (lines, startIndex, docId) => {
  const { lines: blockLines, nextIndex } = collectUntil(lines, startIndex, (line) => line.trim() === '</InstallationTabs>')
  const blockSource = blockLines.join('\n')
  const item = blockSource.match(/item="([^"]+)"/)?.[1] ?? ''
  const codeBlock = await getCodeFenceFromBlock(docId, blockLines)

  return {
    block: {
      type: 'installation-tabs',
      item,
      codeHtml: codeBlock.html,
    },
    nextIndex,
  }
}

const parsePropsTable = (lines, startIndex) => {
  const { lines: blockLines, nextIndex } = collectUntil(lines, startIndex, (line) => line.includes('/>'))
  const data = transformPropsTableData(parsePropsTableData(blockLines.join('\n')))

  return {
    block: {
      type: 'props-table',
      data,
    },
    nextIndex,
  }
}

const parseCommandBlock = (lines, startIndex) => {
  const line = lines[startIndex]
  const item = line.match(/item="([^"]+)"/)?.[1] ?? ''
  const mcp = /\bmcp\b/.test(line)

  return {
    block: {
      type: 'command-block',
      item,
      mcp,
    },
    nextIndex: startIndex + 1,
  }
}

const isBlockStart = (line) => {
  const trimmed = line.trimStart()
  return (
    trimmed.startsWith('<DemoCanvas>') ||
    trimmed.startsWith('<InstallationTabs') ||
    trimmed.startsWith('<PropsTable') ||
    trimmed.startsWith('<ComponentsGrid') ||
    trimmed.startsWith('<CodeBlockCommand') ||
    trimmed.startsWith('<details>') ||
    trimmed.startsWith('```') ||
    /^#{1,3}\s+/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed) ||
    /^-\s+/.test(trimmed)
  )
}

const parseParagraph = (lines, startIndex) => {
  const collected = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    if (isBlankLine(line) || isBlockStart(line)) {
      break
    }

    collected.push(line.trim())
    index += 1
  }

  return {
    block: {
      type: 'paragraph',
      html: renderInlineMarkdown(collected.join(' ')),
    },
    nextIndex: index,
  }
}

const parseList = (lines, startIndex, ordered) => {
  const items = []
  let index = startIndex
  let start = 1

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trimStart()
    const match = ordered ? trimmed.match(/^(\d+)\.\s+(.*)$/) : trimmed.match(/^-\s+(.*)$/)

    if (!match) {
      break
    }

    if (ordered && items.length === 0) {
      start = Number(match[1])
    }

    items.push(renderInlineMarkdown(match[ordered ? 2 : 1]))
    index += 1
  }

  return {
    block: {
      type: 'list',
      ordered,
      items,
      start,
    },
    nextIndex: index,
  }
}

const parseBlockquote = (lines, startIndex) => {
  const collected = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trimStart()

    if (!trimmed.startsWith('>')) {
      break
    }

    collected.push(trimmed.replace(/^>\s?/, ''))
    index += 1
  }

  return {
    block: {
      type: 'blockquote',
      html: renderInlineMarkdown(collected.join(' ')),
    },
    nextIndex: index,
  }
}

const parseHeading = (line, seenHeadings) => {
  const match = line.trim().match(/^(#{1,3})\s+(.*)$/)
  if (!match) {
    throw new Error(`Invalid heading line: ${line}`)
  }

  const text = match[2].trim()
  return {
    type: 'heading',
    level: match[1].length,
    text,
    id: slugify(text, seenHeadings),
  }
}

const parseDetails = async (lines, startIndex, docId) => {
  const { lines: blockLines, nextIndex } = collectUntil(lines, startIndex, (line) => line.trim() === '</details>')
  const summaryLine = blockLines.find((line) => line.trimStart().startsWith('<summary>')) ?? '<summary>Details</summary>'
  const summary = summaryLine.replace(/^\s*<summary>/, '').replace(/<\/summary>\s*$/, '')
  const innerLines = blockLines.filter(
    (line, index) => index !== 0 && line !== summaryLine && line.trim() !== '</details>',
  )

  return {
    block: {
      type: 'details',
      summary,
      blocks: await parseBlocks(innerLines, docId),
    },
    nextIndex,
  }
}

const parseBlocks = async (lines, docId) => {
  const blocks = []
  const seenHeadings = new Map()
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trimStart()

    if (isBlankLine(line)) {
      index += 1
      continue
    }

    if (trimmed.startsWith('<DemoCanvas>')) {
      const result = await parseDemoCanvas(lines, index, docId)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (trimmed.startsWith('<InstallationTabs')) {
      const result = await parseInstallationTabs(lines, index, docId)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (trimmed.startsWith('<PropsTable')) {
      const result = parsePropsTable(lines, index)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (trimmed.startsWith('<ComponentsGrid')) {
      blocks.push({ type: 'components-grid' })
      index += 1
      continue
    }

    if (trimmed.startsWith('<CodeBlockCommand')) {
      const result = parseCommandBlock(lines, index)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (trimmed.startsWith('<details>')) {
      const result = await parseDetails(lines, index, docId)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (trimmed.startsWith('```')) {
      const { lines: codeLines, nextIndex } = collectUntil(lines, index, (currentLine, currentIndex) => currentIndex > index && currentLine.trim() === '```')
      const block = await readCodeBlock(docId, trimmed.slice(3), codeLines.slice(1, -1))
      blocks.push({
        type: 'code',
        html: block.html,
      })
      index = nextIndex
      continue
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      blocks.push(parseHeading(trimmed, seenHeadings))
      index += 1
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      const result = parseBlockquote(lines, index)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const result = parseList(lines, index, true)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    if (/^-\s+/.test(trimmed)) {
      const result = parseList(lines, index, false)
      blocks.push(result.block)
      index = result.nextIndex
      continue
    }

    const result = parseParagraph(lines, index)
    blocks.push(result.block)
    index = result.nextIndex
  }

  return blocks
}

const compileDoc = async (docId) => {
  const sourcePath = path.join(docsRoot, docId, 'doc.mdx')
  const source = await fs.readFile(sourcePath, 'utf8')
  const lines = source.split(/\r?\n/)
  let startIndex = 0

  while (startIndex < lines.length && lines[startIndex].trimStart().startsWith('import ')) {
    startIndex += 1
  }

  const contentLines = lines.slice(startIndex)
  const blocks = await parseBlocks(contentLines, docId)

  await writeFile(
    path.join(generatedDocsRoot, `${docId}.js`),
    `export default ${JSON.stringify(blocks, null, 2)}\n`,
  )
}

const generateManifest = async (docIds) => {
  const demoPaths = Object.keys(demoRegistry).sort()
  const lines = [
    'export const docContentLoaders = {',
    ...docIds.map((docId) => `  ${JSON.stringify(docId)}: () => import("./docs/${docId}.js"),`),
    '};',
    '',
    'export const docSourceLoaders = {',
    ...docIds.map((docId) => `  ${JSON.stringify(docId)}: () => import("@root/docs/${docId}/doc.mdx?raw"),`),
    '};',
    '',
    'export const demoModuleLoaders = {',
    ...demoPaths.map(
      (demoPath) => `  ${JSON.stringify(demoPath)}: () => import(${JSON.stringify(demoRegistry[demoPath].component)}),`,
    ),
    '};',
    '',
  ]

  await writeFile(path.join(generatedRoot, 'manifest.js'), `${lines.join('\n')}\n`)
}

const verifyDemoMappings = async () => {
  const docEntries = await fs.readdir(docsRoot, { withFileTypes: true })
  const docIds = docEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  const missing = []

  for (const docId of docIds) {
    const docDir = path.join(docsRoot, docId)
    const files = await fs.readdir(docDir)

    for (const file of files) {
      if (!/^demo.*\.(ts|tsx|vue)$/.test(file)) {
        continue
      }

      if (file.endsWith('.tsx') && files.includes(file.replace(/\.tsx$/, '.vue'))) {
        continue
      }

      const demoPath = `docs/${docId}/${file}`
      if (!demoRegistry[demoPath]) {
        missing.push(demoPath)
      }
    }
  }

  if (missing.length) {
    throw new Error(`Missing Vue demo mappings:\n${missing.join('\n')}`)
  }
}

const run = async () => {
  await fs.rm(generatedRoot, { recursive: true, force: true })
  await fs.mkdir(generatedDocsRoot, { recursive: true })

  await verifyDemoMappings()

  const docEntries = await fs.readdir(docsRoot, { withFileTypes: true })
  const docIds = docEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()

  for (const docId of docIds) {
    await compileDoc(docId)
  }

  await generateManifest(docIds)
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
