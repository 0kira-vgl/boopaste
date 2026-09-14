"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Definição das zonas de scroll e espécies de fantasmas
interface GhostDef {
  id: string;
  name: string;
  lines: string[];
  zoneY: number; // Posição Y no espaço 3D (0 no hero até -120 no footer)
  x: number;
  z: number;
  scale: number;
  floatSpeed: number;
  driftRange: number;
  glowColor: string;
}

const GHOSTS: GhostDef[] = [
  // --- ZONA 1: HERO (0% a 20%) ---
  {
    id: "hero-boo",
    name: "Boo Clássico",
    lines: [
      "  .-.  ",
      " (o.o) ",
      " /\"\"\"\\ ",
      " ~ ~ ~ "
    ],
    zoneY: 2,
    x: -14,
    z: 6,
    scale: 6.8,
    floatSpeed: 0.9,
    driftRange: 1.6,
    glowColor: "#00FF66",
  },
  {
    id: "hero-baby",
    name: "Baby Boo",
    lines: [
      "(..)",
      " ~ "
    ],
    zoneY: -2,
    x: 16,
    z: 4,
    scale: 3.4,
    floatSpeed: 1.3,
    driftRange: 1.2,
    glowColor: "#00FF66",
  },

  // --- ZONA 2: PROBLEM (20% a 40%) ---
  {
    id: "problem-spooked",
    name: "Boo Confuso",
    lines: [
      "  /\"\"\"\\  ",
      " (O_o)? ",
      " [ ! ? ]",
      "  V V V "
    ],
    zoneY: -30,
    x: -13,
    z: 5,
    scale: 6.5,
    floatSpeed: 1.1,
    driftRange: 1.8,
    glowColor: "#FFB000",
  },

  // --- ZONA 3: HOW IT WORKS (40% a 60%) ---
  {
    id: "helper-paste",
    name: "Boo ⌘V",
    lines: [
      "   .-.   ",
      "  (o_o)  ",
      " [ ⌘V ]  ",
      "  ~ ~ ~  "
    ],
    zoneY: -62,
    x: 14,
    z: 6,
    scale: 7.0,
    floatSpeed: 0.85,
    driftRange: 2.0,
    glowColor: "#00FF66",
  },

  // --- ZONA 4: TERMINALS (60% a 80%) ---
  {
    id: "terminal-hacker",
    name: "Ghostty Hacker",
    lines: [
      "  .-----.  ",
      " (⌐■ _ ■) ",
      " [Ghostty] ",
      "   ~ ~ ~   "
    ],
    zoneY: -92,
    x: -14,
    z: 6,
    scale: 7.2,
    floatSpeed: 0.8,
    driftRange: 1.9,
    glowColor: "#00FF66",
  },

  // --- ZONA 5: INSTALL & FOOTER (80% a 100%) ---
  {
    id: "party-cheer",
    name: "Boo Celebrando",
    lines: [
      " \\( ^o^ )/ ",
      "   (boo!)  ",
      "   /\"\"\"\\   ",
      "   ~ ~ ~   "
    ],
    zoneY: -124,
    x: 0,
    z: 8,
    scale: 8.0,
    floatSpeed: 1.2,
    driftRange: 2.2,
    glowColor: "#00FF66",
  },
  {
    id: "party-baby-left",
    name: "Baby Boo",
    lines: [
      "\\(^.^)/",
      "  ~ ~  "
    ],
    zoneY: -127,
    x: -15,
    z: 4,
    scale: 4.0,
    floatSpeed: 1.4,
    driftRange: 1.5,
    glowColor: "#00F0FF",
  },
  {
    id: "party-baby-right",
    name: "Baby Boo",
    lines: [
      " (o.o) ",
      "  ~ ~  "
    ],
    zoneY: -126,
    x: 15,
    z: 4,
    scale: 4.0,
    floatSpeed: 1.3,
    driftRange: 1.5,
    glowColor: "#FFB000",
  },
];

// Helper para desenhar a textura do fantasma em um Canvas 2D
function createGhostTexture(
  lines: string[],
  textColor: string,
  glowColor: string,
  isDark: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const fontSize = 26;
  const lineHeight = 32;
  ctx.font = `bold ${fontSize}px 'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace`;

  let maxW = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > maxW) maxW = w;
  }

  const padX = 20;
  const padY = 16;
  canvas.width = Math.ceil(maxW + padX * 2);
  canvas.height = Math.ceil(lines.length * lineHeight + padY * 2);

  ctx.font = `bold ${fontSize}px 'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace`;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";

  const centerX = canvas.width / 2;

  if (isDark) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;
  }

  for (let i = 0; i < lines.length; i++) {
    const y = padY + i * lineHeight;
    ctx.fillStyle = textColor;
    ctx.fillText(lines[i], centerX, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function ThreeGhostSwarm() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Cena, Câmera e Renderizador com Performance Otimizada
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 800);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Evita sobrecarga de antialias em shaders de partículas
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Detecção de Tema
    function getTheme() {
      const isDark = document.documentElement.classList.contains("dark");
      return {
        isDark,
        textColor: isDark ? "#EDEDED" : "#171717",
      };
    }
    let { isDark, textColor } = getTheme();

    // -------------------------------------------------------------
    // 3. CÉU VIVO (Starfield cintilante no estilo Yucatan)
    // -------------------------------------------------------------
    // Criamos 350 estrelas/partículas distribuídas pelo céu e ao longo de todo o eixo Y.
    // Usamos um ShaderMaterial executado na GPU para taxa de 60-120 FPS suave e zero consumo de CPU!
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starPhases = new Float32Array(starCount);
    const starSizes = new Float32Array(starCount);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Distribuição em 3D: X de -40 a +40, Y de +30 até -160, Z de -25 a +15
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 1] = 30 - Math.random() * 190;
      starPositions[i * 3 + 2] = -25 + Math.random() * 35;

      starPhases[i] = Math.random() * Math.PI * 2;
      starSizes[i] = 1.2 + Math.random() * 2.8;
      starSpeeds[i] = 1.2 + Math.random() * 2.5;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(starPhases, 1));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute("aSpeed", new THREE.BufferAttribute(starSpeeds, 1));

    // Shader do céu vivo (GPU) — cintilação, pulsar orgânico e leve deriva
    const starShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(isDark ? 0xffffff : 0x222222) },
        uAccentColor: { value: new THREE.Color(isDark ? 0x00ff66 : 0x008833) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aPhase;
        attribute float aSize;
        attribute float aSpeed;
        varying float vAlpha;
        varying float vAccent;

        void main() {
          vec3 pos = position;

          // Deriva sutil do céu no estilo Yucatan (efeito de brisa espacial constante)
          pos.x += sin(uTime * 0.4 + aPhase) * 0.35;
          pos.y += cos(uTime * 0.3 + aPhase) * 0.35;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Cintilação suave (twinkle) baseada em seno
          float twinkle = sin(uTime * aSpeed + aPhase) * 0.5 + 0.5;
          vAlpha = 0.35 + twinkle * 0.65;
          
          // Algumas estrelas ganham toque de verde fósforo brilhante
          vAccent = step(0.80, sin(aPhase * 3.0));

          // Ponto com tamanho ideal para ser visível e cintilante sem ficar microscópico
          gl_PointSize = clamp(aSize * (80.0 / -mvPosition.z) * uPixelRatio, 2.5, 14.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uAccentColor;
        varying float vAlpha;
        varying float vAccent;

        void main() {
          // Ponto circular suave com halo fosforescente
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float intensity = pow(1.0 - (dist * 2.0), 1.2);
          vec3 col = mix(uColor, uAccentColor, vAccent);
          gl_FragColor = vec4(col, intensity * vAlpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const starfield = new THREE.Points(starGeo, starShaderMat);
    scene.add(starfield);

    // -------------------------------------------------------------
    // 4. FANTASMAS POR SEÇÃO (Com Inicialização Suave e Zero Pop-In)
    // -------------------------------------------------------------
    interface GhostItem {
      def: GhostDef;
      sprite: THREE.Sprite;
      baseX: number;
      baseY: number;
      baseZ: number;
      phase: number;
      phaseX: number;
    }

    const ghostItems: GhostItem[] = [];

    GHOSTS.forEach((def, i) => {
      const texture = createGhostTexture(def.lines, textColor, def.glowColor, isDark);
      const aspect = texture.image.width / texture.image.height;

      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0, // Inicia em 0 absoluto para NUNCA piscar verde na primeira renderização!
        depthWrite: false,
      });

      const sprite = new THREE.Sprite(mat);
      const s = def.scale;
      sprite.scale.set(s * aspect, s, 1);
      sprite.position.set(def.x, def.zoneY, def.z);
      scene.add(sprite);

      ghostItems.push({
        def,
        sprite,
        baseX: def.x,
        baseY: def.zoneY,
        baseZ: def.z,
        phase: i * 1.5 + Math.random(),
        phaseX: i * 0.8 + Math.random(),
      });
    });

    // -------------------------------------------------------------
    // 5. ROLAGEM E SINCRONIZAÇÃO DA CÂMERA
    // -------------------------------------------------------------
    let targetScroll = 0;
    let currentScroll = 0;
    let mouseX = 0;
    let mouseY = 0;

    function calcScroll() {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      return maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
    }

    function onScroll() {
      targetScroll = calcScroll();
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function onResize() {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      starShaderMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.5);
    }

    // Inicializa a câmera imediatamente na posição de rolagem correta (sem saltos de Y)
    targetScroll = calcScroll();
    currentScroll = targetScroll;
    camera.position.y = -targetScroll * 135;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    // -------------------------------------------------------------
    // 6. OBSERVAÇÃO DE TEMA (Dark/Light)
    // -------------------------------------------------------------
    const observer = new MutationObserver(() => {
      const theme = getTheme();
      isDark = theme.isDark;
      textColor = theme.textColor;

      starShaderMat.uniforms.uColor.value.set(isDark ? 0xffffff : 0x222222);
      starShaderMat.uniforms.uAccentColor.value.set(isDark ? 0x00ff66 : 0x008833);

      ghostItems.forEach(({ sprite, def }) => {
        const oldTex = sprite.material.map;
        const newTex = createGhostTexture(def.lines, textColor, def.glowColor, isDark);
        sprite.material.map = newTex;
        sprite.material.needsUpdate = true;
        if (oldTex) oldTex.dispose();
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // -------------------------------------------------------------
    // 7. LOOP DE ANIMAÇÃO COM ENTRADA SUAVE (FADE-IN CONTROLADO)
    // -------------------------------------------------------------
    let animId = 0;
    const clock = new THREE.Clock();
    let entranceAlpha = 0; // Fade-in suave de entrada para eliminar qualquer glitch

    function animate() {
      animId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Fade-in progressivo de 0.6s ao abrir a página
      if (entranceAlpha < 1) {
        entranceAlpha = Math.min(1, entranceAlpha + delta * 1.8);
      }

      // Atualiza o tempo no shader do céu (GPU cuida do movimento/cintilação)
      starShaderMat.uniforms.uTime.value = time;

      // Interpolação suave do scroll (lerp fluido)
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Movimentação vertical contínua da câmera através do mundo 3D
      const targetCamY = -currentScroll * 135;
      camera.position.y += (targetCamY - camera.position.y) * 0.09;

      // Parallax sutil do mouse
      camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.04;
      camera.rotation.y = -mouseX * 0.02;
      camera.rotation.x = -mouseY * 0.015;

      // Atualiza fantasmas: física orgânica suave e visibilidade por seção
      const camY = camera.position.y;

      for (let i = 0; i < ghostItems.length; i++) {
        const g = ghostItems[i];
        const { def, sprite } = g;
        const t = time * def.floatSpeed;

        // Movimento orgânico de flutuação e respiração
        sprite.position.y = g.baseY + Math.sin(t + g.phase) * def.driftRange;
        sprite.position.x = g.baseX + Math.cos(t * 0.6 + g.phaseX) * (def.driftRange * 0.4);

        // Distância vertical da câmera para modulação suave de visibilidade
        const distFromCam = Math.abs(sprite.position.y - camY);

        if (distFromCam > 36) {
          // Fora de alcance: desativa renderização para economizar 100% de GPU
          sprite.visible = false;
        } else {
          sprite.visible = true;
          // Fade-in suave conforme a câmera se aproxima da seção
          const sectionAlpha = 1 - (distFromCam / 36);
          sprite.material.opacity = sectionAlpha * 0.85 * entranceAlpha;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup completo
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      observer.disconnect();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starShaderMat.dispose();
      ghostItems.forEach((g) => {
        g.sprite.material.map?.dispose();
        g.sprite.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none overflow-hidden"
      aria-hidden="true"
    />
  );
}
