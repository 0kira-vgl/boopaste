# Prompts para Gemini — assets da landing page do boopaste

Dois assets a gerar: (1) logo em ASCII/pixel art, (2) vídeo de fundo em ASCII que
anima conforme o scroll da página. Os dois prompts abaixo estão em inglês (geração
de imagem/vídeo costuma responder melhor em inglês), prontos pra colar no Gemini.

---

## 1. Logo ASCII (imagem estática, para o hero e para o favicon/OG image)

```
Design a logo for "boopaste", a developer CLI tool for macOS. Style: monochrome
ASCII art / terminal aesthetic, built entirely out of monospace characters
(like @, #, %, /, \, |, -, .) forming a clean, readable wordmark "boopaste" plus
a small icon suggesting "clipboard → paste" (e.g. a stylized clipboard or an
arrow feeding into a terminal cursor block). Pure black background, pure white
(or bright green, terminal-phosphor style) character glyphs — no gradients, no
anti-aliasing, hard pixel edges. Composition must work both as a wide horizontal
lockup (icon + wordmark side by side) and cropped to a square icon alone (for
favicon use). Export as a transparent PNG, 2000x800px for the horizontal
version and 512x512px for the square icon version. No drop shadows, no glow —
flat, crisp, retro terminal look, similar to old BBS ASCII art or figlet banners.
```

Variação pra pixel art (se quiser uma segunda opção mais "8-bit" além da ASCII pura):

```
Design a pixel art logo for "boopaste", a macOS developer tool. 8-bit / 16-bit
retro game aesthetic, limited palette (black background, white/lime-green
foreground, one accent color max), hard pixel grid, no anti-aliasing. Icon: a
clipboard character or floppy-disk-like glyph with a small blinking cursor
motif. Wordmark "boopaste" in a blocky pixel font underneath. Deliver as
transparent PNG, 1024x1024, sharp pixel edges (nearest-neighbor scalable).
```

---

## 2. Vídeo de fundo ASCII (scroll-driven background)

Esse vídeo vai ficar fixo atrás do conteúdo e é "escrubado" pelo scroll — ou seja,
o `currentTime` do `<video>` é setado proporcionalmente à posição de scroll, não
tocado em autoplay solto. Por isso ele precisa ser um clipe **curto, loopável,
com progressão visual clara do início ao fim** (não um loop caótico), pra que
scrollar pra cima e pra baixo pareça "rebobinar" a animação de forma coerente.

```
Generate a looping abstract background animation in a monochrome ASCII-art /
terminal aesthetic: a dense grid of monospace characters (letters, numbers,
symbols like . : + * # % @) that continuously morph and flow, evoking a
"digital rain" / data-stream feel crossed with a topographic wave pattern —
characters shifting in density and brightness to imply depth and motion, like
an ASCII fluid simulation. Pure black background, white/light-gray characters
(single color, high contrast, no color gradients). Camera static, no cuts.
Duration: 12 seconds, seamless loop (first and last frame must match), 1920x1080,
30fps, no audio. The animation should have a clear, smooth, monotonic progression
of "intensity" from calm/sparse at the start to dense/energetic at the midpoint
and back to calm at the end, so that scrubbing through the timeline (like
scrolling a webpage) feels intentional and readable at any point, not random noise.
```

Prompt alternativo, se quiser a estética mais próxima da nextjs.org (formas
geométricas 3D em wireframe/ASCII em vez de "chuva digital"):

```
Generate a looping ASCII-art render of a slowly rotating abstract 3D wireframe
object (e.g. a torus knot or icosahedron) made entirely of monospace ASCII
characters as shading (using density of characters like . , : ; + * # @ to
represent light and shadow instead of actual grayscale shading) — same
technique as classic "donut.c" ASCII renderers. Pure black background, white
characters only. Duration: 12 seconds, seamless loop, 1920x1080, 30fps, no
audio, static camera, smooth constant rotation speed so any scrub position
maps predictably to a rotation angle.
```

---

## Onde plugar depois

Quando os arquivos estiverem prontos, salvar em:
- `landing-page/public/logo-ascii.png` (logo horizontal)
- `landing-page/public/logo-ascii-icon.png` (versão quadrada / favicon)
- `landing-page/public/ascii-bg.mp4` (vídeo de fundo)

O componente `ScrollVideoBackground` (`src/components/scroll-video-background.tsx`)
já está pronto pra consumir `ascii-bg.mp4` nesse caminho — só soltar o arquivo
ali que o scroll-scrub já funciona, sem precisar mexer em código.
