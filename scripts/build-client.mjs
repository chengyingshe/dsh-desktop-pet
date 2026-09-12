import { mkdir, readFile, writeFile } from 'node:fs/promises'

const states = ['idle', 'walk', 'run', 'sleep', 'think', 'celebrate', 'surprised', 'drag', 'talk']
const assetRoot = new URL('../assets/characters/shinchan/sprites/', import.meta.url)
const assets = Object.fromEntries(await Promise.all(states.map(async (state) => {
  const bytes = await readFile(new URL(`${state}.png`, assetRoot))
  return [state, `data:image/png;base64,${bytes.toString('base64')}`]
})))

const source = (await readFile(new URL('../src/client.js', import.meta.url), 'utf8'))
  .replace('const DEFAULT_CHARACTER_ASSETS = {};', `const DEFAULT_CHARACTER_ASSETS = ${JSON.stringify(assets)};`)
const wrapped = `window.__ModuleLoader__.load({\n  id: "dsh-desktop-pet",\n  factory: () => {\n    const module = { exports: {} };\n    const exports = module.exports;\n${source}\n    return module.exports;\n  }\n});\n`
await mkdir(new URL('../lib', import.meta.url), { recursive: true })
await writeFile(new URL('../lib/client.js', import.meta.url), wrapped)
