# Character packs

A character pack uses one transparent image per state. Recommended files are square PNG, WebP, GIF, JPEG, or SVG images with the character centered on a common baseline.

## States

- `idle`: default standing pose
- `walk`: normal roaming pose
- `run`: fast roaming pose
- `sleep`: inactive pose
- `think`: DSH is generating a response
- `celebrate`: response generation completed or pet was double-clicked
- `surprised`: pet was clicked
- `drag`: pet is being dragged
- `talk`: talk command from the context menu

Missing states fall back to `idle`, then to the built-in vector character.

## Runtime API

Dispatch a character pack from any client plugin or the browser console:

```js
window.dispatchEvent(new CustomEvent("dsh-desktop-pet:set-character", {
  detail: {
    name: "My Pet",
    size: 150,
    assets: {
      idle: "data:image/png;base64,...",
      walk: "/my-assets/walk.webp"
    }
  }
}));
```

Asset values may be data URLs, blob URLs, or URLs reachable by the DSH web client. The context menu also supports replacing the image of the current state with a local file. Those local files are stored as data URLs in `localStorage`.
