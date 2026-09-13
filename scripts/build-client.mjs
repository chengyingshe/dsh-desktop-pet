import { mkdir, readFile, writeFile } from 'node:fs/promises'

const states = ['idle', 'walk', 'run', 'sleep', 'think', 'celebrate', 'surprised', 'drag', 'talk']
const assetRoot = new URL('../assets/characters/shinchan/sprites/', import.meta.url)
const catRoot = new URL('../assets/characters/orange-cat/', import.meta.url)
const anyaRoot = new URL('../assets/characters/anya/', import.meta.url)
const assets = Object.fromEntries(await Promise.all(states.map(async (state) => {
  const bytes = await readFile(new URL(`${state}.png`, assetRoot))
  return [state, `data:image/png;base64,${bytes.toString('base64')}`]
})))
const catAssets = Object.fromEntries(await Promise.all(states.map(async (state) => {
  const bytes = await readFile(new URL(`${state}.png`, catRoot))
  return [state, `data:image/png;base64,${bytes.toString('base64')}`]
})))
const anyaAssets = Object.fromEntries(await Promise.all(states.map(async (state) => {
  const bytes = await readFile(new URL(`${state}.png`, anyaRoot))
  return [state, `data:image/png;base64,${bytes.toString('base64')}`]
})))

const source = (await readFile(new URL('../src/client.js', import.meta.url), 'utf8'))
  .replace('const DEFAULT_CHARACTER_ASSETS = {};', `const DEFAULT_CHARACTER_ASSETS = ${JSON.stringify(assets)};`)
  .replace('const BUILTIN_CHARACTERS = [];', `const BUILTIN_CHARACTERS = ${JSON.stringify([{ id: 'shinchan', name: '小新', size: 150, assets }, { id: 'orange-cat', name: '橘猫', size: 150, assets: catAssets }, { id: 'anya', name: '阿尼亚', size: 150, assets: anyaAssets }])};`)
const wrapped = `window.__ModuleLoader__.load({\n  id: "dsh-desktop-pet",\n  factory: () => {\n    const module = { exports: {} };\n    const exports = module.exports;\n${source}\n    return module.exports;\n  }\n});\n`
await mkdir(new URL('../lib', import.meta.url), { recursive: true })
await writeFile(new URL('../lib/client.js', import.meta.url), wrapped)
