# Atelier UI — Codrops Demo

Demo for the Codrops article "Atelier UI: Mixing WebGL and the DOM in a React UI Library".

Built with Next.js 16 (App Router), React Three Fiber, Motion, Lenis and Tailwind CSS v4.

## Requirements

- Node.js 20.9 or later
- pnpm (run `corepack enable` once if it isn't installed)

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Then open http://localhost:3000.

## Build

The demo is exported as a static site (HTML, CSS and JS files). No Node.js server is needed to host it.

### Hosting at the root of a domain

```bash
pnpm build
```

### Hosting in a subdirectory

The subdirectory must be set at build time, otherwise links, images and videos will point to the root of the domain.

For example, to host the demo at `https://tympanus.net/Development/AtelierUI/`:

```bash
NEXT_PUBLIC_BASE_PATH=/Development/AtelierUI pnpm build
```

The path starts with a slash and has no slash at the end.

### Upload

The build is generated in the `out/` folder. Upload the contents of `out/` to the root of the domain or to the subdirectory set above.

## License

MIT
