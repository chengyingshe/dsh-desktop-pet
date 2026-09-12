# dsh-desktop-pet

A configurable, interactive desktop pet for the DeepSeek Harness Web GUI.

## Features

- Idle, walking, running, sleeping, thinking, celebrating, surprised, dragged, and talking states.
- Uses a distinct image for each state, with built-in artwork as a safe fallback.
- Context-sensitive speech for user activity and DSH response generation.
- Click, double-click, drag, keyboard, reduced-motion, and mobile support.
- Position, visibility, sound, and custom character images persisted locally.
- Right-click the pet to replace the current state's image or restore defaults.
- Runtime event API for switching a complete character pack without changing core code.

## Character packs

See `assets/characters/README.md` and copy `assets/characters/example/manifest.json`. Supported states are `idle`, `walk`, `run`, `sleep`, `think`, `celebrate`, `surprised`, `drag`, and `talk`.

The bundled default pack is `assets/characters/shinchan/manifest.json`. Its nine generated sprites are embedded into `lib/client.js` during `pnpm build`, so the installed plugin does not need a separate web server for the artwork.

Here is the bundled Shin-chan desktop pet sprite sheet. The states are arranged left to right and top to bottom as `idle`, `walk`, `run`, `sleep`, `think`, `celebrate`, `surprised`, `drag`, and `talk`.

![Shin-chan desktop pet state preview](assets/characters/shinchan/sprite-sheet.png)

A host client can switch characters at runtime:

```js
window.dispatchEvent(new CustomEvent("dsh-desktop-pet:set-character", {
  detail: {
    name: "My Pet",
    size: 150,
    assets: {
      idle: "/assets/my-pet/idle.png",
      walk: "/assets/my-pet/walk.png"
    }
  }
}));
```

Missing states fall back to the idle image, then to the built-in vector artwork.

## Sprite sheet workflow

Generate a square 3 by 3 sprite sheet in this order:

```text
idle, walk, run
sleep, think, celebrate
surprised, drag, talk
```

Then split it with the bundled crop script (which uses explicit top-left coordinates):

```sh
pnpm split:sprites /path/to/sprite-sheet.png assets/characters/my-pet
```

## Development

```sh
pnpm install
pnpm build
dsh plugin --profile web add link:$PWD
```

Restart `dsh web`, refresh the existing GUI at `http://127.0.0.1:3080`, and look in the bottom-right corner.
