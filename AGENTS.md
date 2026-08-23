<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# This project

Read [README.md](README.md) before touching the scroll or WebGL layers. It documents two
silent-failure traps that cost real time — `three` clones the `uniforms` JSX prop (mutating
the memo renders black), and Tailwind v4 drops unreferenced `@theme` vars (deleting the
`@layer base :root` block kills the display font). Neither errors.

All site copy lives in [src/lib/content.ts](src/lib/content.ts). Never hard-code strings in
components.
