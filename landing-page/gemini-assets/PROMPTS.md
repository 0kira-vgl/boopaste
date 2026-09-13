# Prompts para Gemini / Veo / Imagen — Assets do boopaste

Este documento contém os prompts prontos para geração dos assets visuais da landing page do **boopaste** usando modelos do Google (Gemini, Imagen 3, Veo 2).

Todos os prompts de geração estão em **inglês** para máxima aderência semântica dos modelos.

---

## 1. Logos & Identidade Visual

O **boopaste** é um utilitário CLI open-source para macOS que intercepta o atalho `Cmd+V` no terminal Ghostty e converte imagens copiadas no clipboard em caminhos de arquivo válidos.
- **Conceito da marca:** Trocadilho entre *"boo"* (fantasma discreto/furtivo que assusta a complexidade manual) e *"paste"* (ação de colar do clipboard / cursor de terminal).

---

### Opção 1A: Logo ASCII Monocromático (Principal)

> **Uso:** Hero da landing page, cabeçalho de documentação e Open Graph image.  
> **Destino:** `landing-page/public/logo-ascii.png` (horizontal) e `landing-page/public/logo-ascii-icon.png` (ícone quadrado).

```text
Design a distinctive developer logo for "boopaste", an open-source macOS terminal CLI tool.

Aesthetic: Authentic monochrome ASCII art / BBS ANSI terminal aesthetic, composed strictly of crisp monospace ASCII character glyphs (such as @, #, %, *, =, +, :, -, ., /, \, |, [, ]).

Visual Elements:
1. Icon: A minimalist, clever ASCII ghost mascot fused with a clipboard and terminal prompt motif (e.g. an ethereal ASCII ghost outline emerging from terminal brackets "[ ]" or holding a stylized clipboard with a prompt arrow ">").
2. Wordmark: The word "boopaste" rendered in a clean, legible, retro monospace block font (similar to classic figlet / BBS ANSI banners).

Composition & Format:
- Wide horizontal lockup with the ghost icon on the left and the wordmark "boopaste" on the right.
- High-contrast: Pure crisp white characters (#FFFFFF) on a solid deep black background (#000000), also easily separable as a transparent PNG.
- Completely flat, zero drop shadows, zero soft gradients, zero anti-aliasing blur, 100% hard crisp pixel edges.
- High resolution, 2400x800 pixels for horizontal banner, plus a centered 1024x1024 square version containing only the ASCII ghost icon.
```

---

### Opção 1B: Variação Pixel Art (8-bit / 16-bit Retro Dev)

> **Uso:** Alternativa visual retro-gaming ou ícone de aplicativo / favicon.  
> **Destino:** `landing-page/public/logo-pixel.png` e `landing-page/public/favicon.ico`.

```text
Design a retro 8-bit / 16-bit pixel art logo for "boopaste", a macOS developer utility.

Visual Concept:
- A charming, stealthy retro pixel-art ghost character (representing the "boo" daemon) holding a tiny glowing clipboard/floppy disk icon with an active terminal cursor blink motif.
- The wordmark "boopaste" rendered underneath or beside the character in an authentic, razor-sharp pixel typography (monospaced arcade font).

Style & Constraints:
- Strict pixel grid alignment with nearest-neighbor sharpness (no sub-pixel rendering, no anti-aliased smudges).
- Restricted retro palette: Pure black background (#000000), bright phosphor terminal green (#00FF66) and crisp white (#FFFFFF), with optional subtle cyan accent.
- Transparent PNG output, 1024x1024 square icon, perfectly centered and balanced for favicon and app icon scaling down to 32x32.
```

---

## 2. Vídeo de Fundo Scroll-Driven (12s, Progressão Monotônica)

### Como funciona na landing page
O componente [`ScrollVideoBackground`](file:///Users/matheus/dev/boopaste/landing-page/src/components/scroll-video-background.tsx) **não** toca o vídeo em autoplay. Ele calcula o progresso de rolagem da página e define o tempo do vídeo diretamente:
$$\text{currentTime} = \text{progresso do scroll} \times \text{duração do vídeo (12s)}$$

Por isso, o vídeo precisa seguir uma **progressão monotônica de intensidade** de 0s a 12s:
- **00:00 (0% scroll / Hero):** Calmo, minimalista, caracteres esparsos, vasto espaço negativo escuro. Não distrai da leitura dos títulos e do terminal interativo.
- **00:06 (50% scroll / Meio da página):** Densidade média, fluxos estruturados e aceleração perceptível.
- **00:12 (100% scroll / Rodapé & CTA final):** Densidade máxima, energia visual plena e estruturas totalmente formadas.
- **Efeito de scrub:** Rolar para baixo constrói a energia; rolar para cima retrocede naturalmente até a calmaria inicial.

---

### Opção 2A: Chuva Digital & Topografia de Fluidos ASCII (Digital Rain Stream)

> **Estilo:** Chuva de dados estilo Matrix combinada com ondas topográficas fluidas em caracteres monospace.  
> **Destino:** `landing-page/public/ascii-bg.mp4`

```text
A 12-second cinematic looping video background rendered in monochrome ASCII art and terminal typography, designed specifically for scroll-driven timeline scrubbing.

Visual Concept:
A vast field of monospaced ASCII glyphs (0-9, a-z, and symbols: . , : ; - = + * # % @) arranged on a strict monospace terminal grid, undulating like a topographic fluid surface and descending in streaming digital data rain.

Monotonic Intensity Ramp (0 to 12 seconds):
- 00:00 - 00:03 (Hero calm): Ultra-sparse, minimalist ambient drift. Only faint dots and colons (. : -) gently falling on a deep void. 90% pure black negative space. Very calm and unobtrusive.
- 00:03 - 00:07 (Mid-page ramp): Data streams begin clustering into vertical cascades and rhythmic fluid wave ripples. Characters evolve to medium density symbols (+ * = x $). Motion accelerates with visible kinetic flow.
- 00:07 - 00:12 (Climax / Footer): Full-screen dense digital rainstorm with heavy glyphs (# % @ & 8) cascading rapidly across the grid, high contrast terminal phosphor pulses, and intricate topographic wave interference patterns reaching peak visual density and energy at exactly 00:12.

Technical Specifications:
- Resolution: 1920x1080 (16:9 widescreen), 30fps.
- Duration: Exactly 12 seconds.
- Palette: Pure black background (#000000) with crisp monochrome white and silver characters (high contrast, zero color gradients).
- Camera: Static orthographic view, perfectly locked framing, no camera pans, no cuts, no zoom shakes.
- Output: MP4 (H.264 / HEVC), crisp character edges with zero motion blur or video compression artifacts.
```

---

### Opção 2B: Wireframe 3D Matemático estilo donut.c (ASCII Raymarching Torus)

> **Estilo:** Render 3D clássico em código C (como o famoso `donut.c` de Andy Sloane), onde a iluminação e curvatura 3D são representadas puramente pela densidade dos caracteres ASCII.  
> **Destino:** `landing-page/public/ascii-bg.mp4`

```text
A 12-second continuous 3D mathematical wireframe animation rendered entirely in ASCII art shading (inspired by the classic donut.c raymarching renderer), optimized for scroll scrubbing.

Visual Concept:
A slowly rotating geometric 3D object (a complex Torus Knot or Geodesic Icosahedron) suspended in center frame, rendered exclusively through monospace ASCII characters where character visual weight (. , : ; = ! * # $ @) dynamically calculates surface normal lighting, curvature, and wireframe depth.

Monotonic Intensity Ramp (0 to 12 seconds):
- 00:00 - 00:03 (Hero calm): The geometry begins as a sparse, delicate point-cloud constellation of tiny dots and colons (. :) outlining only the faint silhouette. Lots of pure black breathing room, minimal distraction.
- 00:03 - 00:07 (Mid-page ramp): Wireframe edge lines form with dashes and asterisks (- | + *), revealing the intricate internal structural lattice. Rotation is smooth, steady, and constant around two axes. Shading surfaces begin to emerge.
- 00:07 - 00:12 (Climax / Footer): Dense, full solid ASCII shading with maximum glyph luminance (# % @) highlighting the reflective curved surfaces, surrounded by secondary orbital wireframe rings and expanding mathematical grid lines, reaching maximum geometric complexity and luminous density at 00:12.

Technical Specifications:
- Resolution: 1920x1080 (16:9 widescreen), 30fps.
- Duration: Exactly 12 seconds.
- Palette: Strict monochrome: Pure black background (#000000) with bright white/silver ASCII characters only.
- Motion: Constant, smooth angular rotation speed without sudden accelerations so any scroll scrub position corresponds predictably to an exact geometric angle.
- Camera: Perfectly centered static camera, no cuts, no depth of field blur, crisp monospace typography.
- Output: MP4 (H.264 / HEVC), no audio.
```

---

## 3. Onde Salvar os Arquivos Gerados

Assim que o Gemini / Veo gerar os arquivos, basta colocá-los na pasta `landing-page/public/`:

| Arquivo gerado | Caminho no projeto | Componente que consome |
|---|---|---|
| **Logo ASCII Horizontal** | `landing-page/public/logo-ascii.png` | [`AsciiLogo`](file:///Users/matheus/dev/boopaste/landing-page/src/components/ascii-logo.tsx) / [`Hero`](file:///Users/matheus/dev/boopaste/landing-page/src/components/sections/hero.tsx) |
| **Ícone / Favicon ASCII** | `landing-page/public/logo-ascii-icon.png` | Favicon e cabeçalho mobile |
| **Vídeo de Fundo (12s)** | `landing-page/public/ascii-bg.mp4` | [`ScrollVideoBackground`](file:///Users/matheus/dev/boopaste/landing-page/src/components/scroll-video-background.tsx) |

> **Nota:** O componente [`ScrollVideoBackground`](file:///Users/matheus/dev/boopaste/landing-page/src/components/scroll-video-background.tsx) já está programado para escutar o scroll e escrubar o vídeo instantaneamente assim que `ascii-bg.mp4` for colocado em `public/`.
