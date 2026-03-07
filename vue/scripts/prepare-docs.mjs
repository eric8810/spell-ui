import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '../../node_modules/.pnpm/node_modules/@mdx-js/mdx/index.js'
import esbuild from '../../node_modules/.pnpm/node_modules/esbuild/lib/main.js'
import remarkCodeImport from 'remark-code-import'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShiki from '@shikijs/rehype'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vueRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(vueRoot, '..')
const docsRoot = path.join(repoRoot, 'docs')
const generatedRoot = path.join(vueRoot, 'src/generated')
const reactRoot = path.join(generatedRoot, 'react')
const registryRoot = path.join(repoRoot, 'registry', 'spell-ui')

const runtimeFiles = [
  'components/demo-canvas.tsx',
  'components/installation-tabs.tsx',
  'components/props-table.tsx',
  'components/prop-information.tsx',
  'components/code-block-command.tsx',
  'components/copy-code-button.tsx',
  'components/command-copy-button.tsx',
  'components/open-in-v0-button.tsx',
  'components/hero.tsx',
  'components/icons/refresh.tsx',
  'components/ui/avatar.tsx',
  'components/ui/button.tsx',
  'components/ui/carousel.tsx',
  'components/ui/dropdown-menu.tsx',
  'components/ui/popover.tsx',
  'components/ui/tabs.tsx',
  'hooks/use-config.ts',
  'hooks/use-copy-to-clipboard.ts',
]

const ensureDir = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

const writeFile = async (filePath, content) => {
  await ensureDir(filePath)
  await fs.writeFile(filePath, content, 'utf8')
}

const toGeneratedPath = (relativePath) =>
  path.join(reactRoot, relativePath.replace(/\.(tsx|ts|mdx)$/, '.js'))

const normalizeImports = (source) =>
  source
    .replace(/^["']use client["'];?\s*/gm, '')
    .replaceAll('from "@/','from "@react/')
    .replaceAll("from '@/", "from '@react/")
    .replaceAll('import "@/','import "@react/')
    .replaceAll("import '@/", "import '@react/")
    .replaceAll('from "next/link"', 'from "@react-shims/next-link"')
    .replaceAll("from 'next/link'", "from '@react-shims/next-link'")
    .replaceAll('from "next/navigation"', 'from "@react-shims/next-navigation"')
    .replaceAll("from 'next/navigation'", "from '@react-shims/next-navigation'")
    .replaceAll('from "next/image"', 'from "@react-shims/next-image"')
    .replaceAll("from 'next/image'", "from '@react-shims/next-image'")
    .replaceAll('<style jsx>{', '<style>{')
    .replaceAll('<style jsx>', '<style>')
    .replaceAll('process.env.', 'import.meta.env.')

const patchSource = (relativePath, source) => {
  let patched = normalizeImports(source)

  if (relativePath === 'registry/spell-ui/spotify-card.tsx') {
    patched = patched.replace(
      '/api/spotify?url=',
      'https://talks.superalign.cn/spell-ui/api/spotify?url=',
    )
  }

  return patched
}

const transpileReactSource = async (relativePath) => {
  const sourcePath = path.join(repoRoot, relativePath)
  const source = await fs.readFile(sourcePath, 'utf8')
  const patched = patchSource(relativePath, source)
  const loader = relativePath.endsWith('.tsx') ? 'tsx' : 'ts'
  const result = await esbuild.transform(patched, {
    loader,
    format: 'esm',
    jsx: 'automatic',
    jsxImportSource: 'react',
    target: 'es2022',
  })

  await writeFile(toGeneratedPath(relativePath), result.code)
}

const compileDoc = async (docId) => {
  const sourcePath = path.join(docsRoot, docId, 'doc.mdx')
  const source = await fs.readFile(sourcePath, 'utf8')
  const compiled = await compile(
    {
      value: source,
      path: sourcePath,
    },
    {
      outputFormat: 'program',
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [[remarkCodeImport, { cache: false, rootDir: repoRoot }], remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
            },
          },
        ],
        [
          rehypeShiki,
          {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
            defaultColor: false,
          },
        ],
      ],
    },
  )

  const outputPath = path.join(reactRoot, 'docs', docId, 'doc.js')
  await writeFile(outputPath, normalizeImports(String(compiled)))
}

const writeRuntimeLibs = async () => {
  await writeFile(
    path.join(reactRoot, 'basic-doc.js'),
    `export const basicDoc = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        id: "introduction",
        description:
          "Build elegant React interfaces with premium, copy-ready Tailwind CSS components.",
      },
      {
        title: "Components",
        id: "components",
        description: "Browse all available components in Spell UI.",
      },
      {
        title: "MCP",
        id: "mcp",
        description: "Integrating MCP with Spell UI lets you control it via AI.",
      },
    ],
  },
];
`,
  )

  await writeFile(
    path.join(reactRoot, 'lib/config.js'),
    `export const siteConfig = {
  name: "Spell UI",
  url: "https://spell.sh",
  ogImage: "https://spell.sh/og",
  description:
    "Beautiful, sophisticated UI components designed for modern React and Tailwind CSS applications.",
  links: {
    tom: "https://x.com/tomm_ui",
    x: "https://x.com/intent/follow?screen_name=tomm_ui",
    discord: "https://discord.gg/CxzqwQ2EAa",
    github: "https://github.com/xxtomm/spell-ui",
  },
};
`,
  )

  await writeFile(
    path.join(reactRoot, 'lib/utils.js'),
    `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@react/lib/config";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path) {
  const base = import.meta.env.VITE_NEXT_PUBLIC_APP_URL ?? siteConfig.url;
  return \`\${base.replace(/\\/$/, "")}\${path.startsWith("/") ? path : \`/\${path}\`}\`;
}
`,
  )

  await writeFile(
    path.join(reactRoot, 'lib/registry.js'),
    `import registry from "@root/registry.json";

export const getRegistry = () => registry;

export const getRegistryItem = (name) =>
  registry.items.find((item) => item.name === name);
`,
  )

  await writeFile(
    path.join(reactRoot, 'lib/doc.js'),
    `import { basicDoc } from "@react/basic-doc";
import { getRegistry } from "@react/lib/registry";

const transformRegistryItemToDocItem = (item) => ({
  id: item.name,
  title: item.title,
  description: item.description,
  meta: item.meta,
});

const filterRegistryItems = (items) => ({
  componentItems: items.filter((item) => item.type === "registry:component"),
});

export const getDocSchema = () => {
  const { items } = getRegistry();
  const { componentItems } = filterRegistryItems(items);

  return [
    ...basicDoc,
    {
      title: "Components",
      items: componentItems.map(transformRegistryItemToDocItem),
    },
  ];
};

export const allDocItems = () => getDocSchema().flatMap((section) => section.items);

export const getDoc = (id) => allDocItems().find((item) => item.id === id);
`,
  )
}

const generateManifest = async (docIds) => {
  const lines = [
    'export const heroLoader = () => import("./react/components/hero.js");',
    '',
    'export const docModuleLoaders = {',
    ...docIds.map((docId) => `  ${JSON.stringify(docId)}: () => import("./react/docs/${docId}/doc.js"),`),
    '};',
    '',
    'export const docSourceLoaders = {',
    ...docIds.map(
      (docId) => `  ${JSON.stringify(docId)}: () => import("@root/docs/${docId}/doc.mdx?raw"),`,
    ),
    '};',
    '',
  ]

  await writeFile(path.join(generatedRoot, 'manifest.js'), `${lines.join('\n')}\n`)
}

const run = async () => {
  await fs.rm(generatedRoot, { recursive: true, force: true })
  await fs.mkdir(reactRoot, { recursive: true })

  await writeRuntimeLibs()

  for (const relativePath of runtimeFiles) {
    await transpileReactSource(relativePath)
  }

  const registryFiles = await fs.readdir(registryRoot)
  for (const file of registryFiles) {
    if (/\.(ts|tsx)$/.test(file)) {
      await transpileReactSource(path.join('registry', 'spell-ui', file))
    }
  }

  const docEntries = await fs.readdir(docsRoot, { withFileTypes: true })
  const docIds = docEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

  for (const docId of docIds) {
    const docDir = path.join(docsRoot, docId)
    const files = await fs.readdir(docDir)

    for (const file of files) {
      if (file === 'doc.mdx') {
        continue
      }

      if (!/\.(ts|tsx)$/.test(file)) {
        continue
      }

      await transpileReactSource(path.join('docs', docId, file))
    }

    await compileDoc(docId)
  }

  await generateManifest(docIds)
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
