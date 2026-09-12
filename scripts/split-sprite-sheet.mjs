import { mkdir } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const [input, outputArg] = process.argv.slice(2)
if (!input) {
  console.error('Usage: node scripts/split-sprite-sheet.mjs <3x3-sheet.png> [output-dir]')
  process.exit(1)
}

const source = resolve(input)
const output = resolve(outputArg || join(dirname(source), basename(source, extname(source))))
const states = ['idle', 'walk', 'run', 'sleep', 'think', 'celebrate', 'surprised', 'drag', 'talk']
const probe = spawnSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', source], { encoding: 'utf8' })
if (probe.status !== 0) {
  console.error(probe.stderr || probe.stdout)
  process.exit(probe.status || 1)
}

const width = Number(probe.stdout.match(/pixelWidth: (\d+)/)?.[1])
const height = Number(probe.stdout.match(/pixelHeight: (\d+)/)?.[1])
if (!width || !height) throw new Error('Unable to read sprite sheet dimensions')

const cellWidth = Math.floor(width / 3)
const cellHeight = Math.floor(height / 3)
await mkdir(output, { recursive: true })

for (let index = 0; index < states.length; index += 1) {
  const row = Math.floor(index / 3)
  const column = index % 3
  const target = join(output, `${states[index]}.png`)
  // sips interprets cropOffset relative to the image center, which makes a
  // 3x3 sheet's (0, 0) cell unexpectedly select the center cell. Use ffmpeg's
  // explicit top-left crop coordinates so row/column mapping is deterministic.
  const result = spawnSync('ffmpeg', [
    '-y', '-i', source,
    '-vf', `crop=${cellWidth}:${cellHeight}:${column * cellWidth}:${row * cellHeight}`,
    '-frames:v', '1', target,
  ], { encoding: 'utf8' })
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout)
    process.exit(result.status || 1)
  }
  console.log(target)
}
