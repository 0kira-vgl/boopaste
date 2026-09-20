import { docsDictionary } from "@/lib/docs-content";

export type Locale = "en" | "pt";

const en = {
  nav: {
    howItWorks: "how it works",
    terminals: "terminals",
    install: "install",
    docs: "docs",
    github: "github",
    home: "home",
  },
  hero: {
    tagline: "Paste images as file paths, only in your terminal.",
    description:
      "Copy an image, hit ⌘V in your terminal, get a real file path instead of garbage. No GUI, no menu bar app: just a background daemon that does one thing.",
    badge: "v0 · macOS only · MIT",
  },
  problem: {
    label: "the problem",
    p1: "Paste an image into most terminals and you get nothing useful: some terminals silently drop it, others dump raw binary or a base64 blob into your shell. You end up dragging the file from Finder, or saving it manually, just to get a path you can type into a command.",
    p2: "boopaste exists because that round-trip is friction that shouldn't exist. If it's on your clipboard, it should paste as a path, like everything else in a terminal.",
  },
  howItWorks: {
    label: "how it works",
    steps: [
      {
        title: "Global event tap",
        body: "A CGEventTap listens for ⌘V at the OS level. It never swallows the keystroke: paste still works everywhere, in every app.",
      },
      {
        title: "Frontmost app check",
        body: "Before doing anything, boopaste checks which app is focused via NSWorkspace. It only acts when that app is Ghostty (more terminals coming).",
      },
      {
        title: "Swap and restore",
        body: "If the clipboard holds an image, it's written to disk as a PNG and the clipboard is swapped to that file path right before the paste event reaches the terminal, then restored right after.",
      },
    ],
    closing:
      "It runs as a LaunchAgent: a tiny background daemon, on at login, off with one command. No menu bar icon, no window, nothing to babysit.",
  },
  terminals: {
    label: "terminals",
    ghostty: { status: "live" },
    native: {
      status: "soon",
      line1: "native integration in progress",
      line2: "next in line, right after Ghostty",
    },
    closingPre:
      "Ghostty support ships today. Native macOS Terminal.app is next, and the frontmost-app check in",
    closingPost: "is built to extend, not rewrite, for each new terminal.",
  },
  openSource: {
    label: "why open source",
    p1: 'boopaste hooks into global keystrokes and reads your clipboard. That requires Accessibility / Input Monitoring permission on macOS (a real trust ask). The only honest answer to "why should I grant this" is: read the code yourself.',
    p2: "Every line that touches the event tap or the clipboard is public, MIT-licensed, and small enough to actually audit in a few minutes.",
    cta: "view source on GitHub",
  },
  install: {
    label: "install",
    note: "mocked for now (the tap and the install script don't exist yet, this is a preview of what it'll look like)",
    homebrewCmd: "brew tap 0kira-vgl/boopaste\nbrew install boopaste",
    curlCmd: "curl -fsSL https://boopaste.dev/install.sh | sh",
    copy: "copy",
    copied: "copied",
  },
  footer: {
    tagline: "MIT licensed, open source.",
  },
  docs: docsDictionary.en,
};

const pt: typeof en = {
  nav: {
    howItWorks: "como funciona",
    terminals: "terminais",
    install: "instalar",
    docs: "docs",
    github: "github",
    home: "início",
  },
  hero: {
    tagline: "Cole imagens como caminho de arquivo, só no seu terminal.",
    description:
      "Copie uma imagem, aperte ⌘V no terminal, e receba um caminho de arquivo de verdade em vez de lixo. Sem GUI, sem app na menu bar: só um daemon em background que faz uma coisa só.",
    badge: "v0 · só macOS · MIT",
  },
  problem: {
    label: "o problema",
    p1: "Colar uma imagem na maioria dos terminais não gera nada útil: alguns terminais simplesmente ignoram, outros despejam binário bruto ou um blob em base64 no seu shell. Você acaba arrastando o arquivo do Finder, ou salvando manualmente, só pra ter um caminho que dá pra digitar num comando.",
    p2: "O boopaste existe porque essa volta toda é uma fricção que não deveria existir. Se está no seu clipboard, deveria colar como caminho, igual tudo mais num terminal.",
  },
  howItWorks: {
    label: "como funciona",
    steps: [
      {
        title: "Event tap global",
        body: "Um CGEventTap escuta o ⌘V no nível do sistema operacional. Ele nunca engole a tecla: o paste continua funcionando em qualquer app.",
      },
      {
        title: "Checagem do app em foco",
        body: "Antes de fazer qualquer coisa, o boopaste checa qual app está em foco via NSWorkspace. Só age quando esse app é o Ghostty (mais terminais a caminho).",
      },
      {
        title: "Swap e restore",
        body: "Se o clipboard tem uma imagem, ela é salva em disco como PNG e o clipboard é trocado pra esse caminho de arquivo bem antes do evento de paste chegar no terminal, sendo restaurado logo em seguida.",
      },
    ],
    closing:
      "Ele roda como um LaunchAgent: um daemon minúsculo em background, ligado no login, desligado com um comando. Sem ícone na menu bar, sem janela, nada pra ficar de olho.",
  },
  terminals: {
    label: "terminais",
    ghostty: { status: "ativo" },
    native: {
      status: "em breve",
      line1: "integração nativa em desenvolvimento",
      line2: "próximo na fila, logo depois do Ghostty",
    },
    closingPre:
      "O suporte ao Ghostty já funciona hoje. O Terminal nativo do macOS é o próximo, e a checagem de app em foco em",
    closingPost: "foi feita pra estender, não reescrever, a cada novo terminal.",
  },
  openSource: {
    label: "por que open source",
    p1: 'O boopaste intercepta teclas globalmente e lê seu clipboard. Isso exige permissão de Accessibility / Input Monitoring no macOS (um pedido de confiança de verdade). A única resposta honesta pra "por que eu deveria conceder isso" é: leia o código você mesmo.',
    p2: "Toda linha que toca o event tap ou o clipboard é pública, licenciada em MIT, e pequena o suficiente pra auditar de verdade em poucos minutos.",
    cta: "ver código no GitHub",
  },
  install: {
    label: "instalar",
    note: "ainda mockado (o tap e o script de instalação não existem de verdade ainda, isso é um preview de como vai ficar)",
    homebrewCmd: "brew tap 0kira-vgl/boopaste\nbrew install boopaste",
    curlCmd: "curl -fsSL https://boopaste.dev/install.sh | sh",
    copy: "copiar",
    copied: "copiado",
  },
  footer: {
    tagline: "Licenciado em MIT, open source.",
  },
  docs: docsDictionary.pt,
};

export const dictionaries: Record<Locale, typeof en> = { en, pt };
