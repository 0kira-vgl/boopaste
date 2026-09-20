export type DocSectionId =
  | "overview"
  | "how-it-works"
  | "cli-commands"
  | "architecture"
  | "permissions"
  | "installation"
  | "troubleshooting";

export interface DocCommandItem {
  name: string;
  syntax: string;
  summary: string;
  behavior: string;
  details: string[];
}

export interface DocModuleItem {
  file: string;
  role: string;
  description: string;
  highlights: string[];
}

export interface DocContent {
  navTitle: string;
  backToHome: string;
  badge: string;
  title: string;
  subtitle: string;
  quickSummary: string;
  tocTitle: string;
  sections: {
    id: DocSectionId;
    title: string;
    tag: string;
  }[];
  overview: {
    tag: string;
    title: string;
    p1: string;
    p2: string;
    problemBox: {
      title: string;
      beforeTitle: string;
      beforeBody: string;
      afterTitle: string;
      afterBody: string;
    };
    keyBenefitsTitle: string;
    keyBenefits: { title: string; desc: string }[];
  };
  pipeline: {
    tag: string;
    title: string;
    description: string;
    steps: {
      num: string;
      title: string;
      code: string;
      desc: string;
    }[];
    flowDiagramTitle: string;
    flowDiagramAscii: string;
  };
  commands: {
    tag: string;
    title: string;
    description: string;
    items: DocCommandItem[];
  };
  architecture: {
    tag: string;
    title: string;
    description: string;
    modules: DocModuleItem[];
  };
  permissions: {
    tag: string;
    title: string;
    description: string;
    calloutTitle: string;
    calloutBody: string;
    points: { title: string; desc: string }[];
  };
  installation: {
    tag: string;
    title: string;
    description: string;
    requirementsTitle: string;
    requirements: string[];
    steps: {
      title: string;
      command: string;
      notes: string;
    }[];
  };
  troubleshooting: {
    tag: string;
    title: string;
    description: string;
    items: {
      issue: string;
      solution: string;
      code?: string;
    }[];
  };
}

export const docsEn: DocContent = {
  navTitle: "boopaste_ docs",
  backToHome: "home",
  badge: "v0.1 · macOS Apple Silicon",
  title: "Under the Hood",
  subtitle:
    "Complete technical reference for boopaste: command semantics, internal Rust modules, macOS event tap interception, and launchd daemon management.",
  quickSummary:
    "boopaste runs silently as a background macOS LaunchAgent. When you press ⌘V inside Ghostty or macOS Terminal with an image in your clipboard, it transparently writes the image to disk and pastes the absolute file path instead.",
  tocTitle: "Table of Contents",
  sections: [
    { id: "overview", title: "Overview & Purpose", tag: "01" },
    { id: "how-it-works", title: "Execution Pipeline", tag: "02" },
    { id: "cli-commands", title: "CLI Commands Reference", tag: "03" },
    { id: "architecture", title: "Codebase & Rust Modules", tag: "04" },
    { id: "permissions", title: "macOS Permissions & TCC", tag: "05" },
    { id: "installation", title: "Build & Installation", tag: "06" },
    { id: "troubleshooting", title: "Diagnostics & Logs", tag: "07" },
  ],
  overview: {
    tag: "01 / Overview & Purpose",
    title: "Why boopaste exists",
    p1: "Terminal emulators are text-only streams. When you copy a screenshot or image to your clipboard and hit ⌘V in modern terminal workflows (like asking Claude Code, Aider, or CLI tools to inspect a screenshot), traditional terminals either drop the keystroke silently or dump unreadable raw binary garbage into your shell.",
    p2: "Developers normally have to switch to Finder, drag and drop the image file, or open Preview and manually save it to disk just to type its path. boopaste solves this at the operating system level without adding an invasive UI, electron bloat, or menu bar icons.",
    problemBox: {
      title: "The Clipboard Friction",
      beforeTitle: "Without boopaste",
      beforeBody:
        "⌘C screenshot → switch to terminal (Ghostty / Terminal.app) → ⌘V → terminal drops it or outputs escape codes → open Finder → drag file into terminal.",
      afterTitle: "With boopaste",
      afterBody:
        "⌘C screenshot → switch to terminal (Ghostty / Terminal.app) → ⌘V → /tmp/boopaste/clip_1726345678123.png is pasted instantly. Original image restored 200ms later.",
    },
    keyBenefitsTitle: "Core Design Tenets",
    keyBenefits: [
      {
        title: "Zero UI overhead",
        desc: "No menu bar item, no dock icon (LSUIElement + LSBackgroundOnly), and no memory leaks. Just a native binary compiled with zero junk.",
      },
      {
        title: "Terminal isolated",
        desc: "Uses Cocoa NSWorkspace APIs to inspect the frontmost application. Only triggers inside Ghostty and macOS Terminal. ⌘V in Chrome, WhatsApp, Slack, or Figma is 100% untouched.",
      },
      {
        title: "Transient swap with auto-restore",
        desc: "Replaces clipboard with path synchronously before paste, then schedules an asynchronous thread to restore the original image bytes in 200ms.",
      },
      {
        title: "Persistent state via launchd",
        desc: "Uses launchctl load -w / unload -w. If you turn it on, it survives computer reboots; if you turn it off, it stays off until you say so.",
      },
    ],
  },
  pipeline: {
    tag: "02 / Execution Pipeline",
    title: "How interception happens in milliseconds",
    description:
      "boopaste does not poll your clipboard in loops. It attaches an event tap directly to the CoreGraphics session run loop, firing only when the physical key combination ⌘V is detected.",
    steps: [
      {
        num: "01",
        title: "Global Key Intercept",
        code: "eventtap.rs → CGEventTap",
        desc: "Listens for KeyDown events at HeadInsertEventTap. If Command flag is active and keycode is 0x09 ('V'), the paste callback triggers. The key event is never swallowed.",
      },
      {
        num: "02",
        title: "Frontmost Application Check",
        code: "frontmost.rs → NSWorkspace",
        desc: "Queries Cocoa's NSWorkspace frontmostApplication bundle identifier. If the bundle is not 'com.mitchellh.ghostty' or 'com.apple.Terminal', boopaste exits immediately without touching the pasteboard.",
      },
      {
        num: "03",
        title: "Atomic Image Flush",
        code: "clipboard.rs → arboard + image",
        desc: "Reads clipboard raw bytes. If image data is present, encodes it as PNG into /tmp/boopaste/clip_<timestamp>.png and replaces the clipboard string with the absolute path.",
      },
      {
        num: "04",
        title: "Terminal Receives Path",
        code: "OS → Terminal (Ghostty / Terminal.app)",
        desc: "The original ⌘V event passes through to the active terminal, which reads the clipboard text stream and receives the valid path string.",
      },
      {
        num: "05",
        title: "Original Clipboard Restored",
        code: "thread::spawn → 200ms delay",
        desc: "A background thread restores the original image data to the system clipboard, ensuring your clipboard history or subsequent pastes outside your terminal keep the image intact.",
      },
    ],
    flowDiagramTitle: "Flow Diagram",
    flowDiagramAscii: `[User presses ⌘+V]
        │
        ▼
[CGEventTap in eventtap.rs] ── (Not ⌘+V) ─────────────► [Pass through untouched]
        │ (⌘+V detected)
        ▼
[Is supported terminal frontmost?] ─ (No, another app) ─► [Pass through untouched]
        │ (Yes: Ghostty / Terminal.app)
        ▼
[Does clipboard hold image?] ─ (No, just text/empty) ─► [Pass through untouched]
        │ (Yes, ImageData found)
        ▼
[1. Save /tmp/boopaste/clip_<ts>.png]
[2. Set clipboard text = file path]
[3. Allow ⌘+V event into terminal (pastes path)]
[4. Spawn background thread: wait 200ms → restore original image bytes]`,
  },
  commands: {
    tag: "03 / CLI Commands Reference",
    title: "Command-Line Interface",
    description:
      "All interaction is performed through the boopaste CLI binary installed at ~/.local/bin/boopaste.",
    items: [
      {
        name: "init",
        syntax: "boopaste init",
        summary: "Prepares files, app bundle, LaunchAgent plist, and symlink without starting.",
        behavior:
          "Installs Boopaste.app in ~/Library/Application Support/boopaste, writes the launchd plist to ~/Library/LaunchAgents/com.matheus.boopaste.plist, links ~/.local/bin/boopaste, and registers the app with Launch Services (lsregister).",
        details: [
          "Creates application bundle containing custom AppIcon.icns for native macOS permission dialogues.",
          "Atomically copies the binary using rename to avoid file descriptor conflicts with running processes.",
          "Signs the app ad-hoc (codesign --sign - --identifier com.matheus.boopaste --force).",
          "Does NOT start the service automatically: run boopaste on afterwards.",
        ],
      },
      {
        name: "on",
        syntax: "boopaste on",
        summary: "Enables boopaste daemon in background and ensures it survives system reboots.",
        behavior: "Executes launchctl load -w on the plist file.",
        details: [
          "The -w flag instructs launchd to write the enabled override into its database, making it boot-persistent.",
          "Triggers the macOS Input Monitoring dialog if not granted already.",
          "Verifies plist presence; prompts to run boopaste init if missing.",
        ],
      },
      {
        name: "off",
        syntax: "boopaste off",
        summary: "Stops the background daemon and keeps it stopped across reboots.",
        behavior: "Executes launchctl unload -w on the plist file.",
        details: [
          "Immediately terminates the background daemon process.",
          "Persists the stopped state in launchd until you explicitly run boopaste on.",
        ],
      },
      {
        name: "status",
        syntax: "boopaste status",
        summary: "Reports whether the daemon is actively running in background or stopped.",
        behavior: "Queries launchctl list com.matheus.boopaste.",
        details: [
          "Prints 'boopaste: rodando' (running) if active in launchd session.",
          "Prints 'boopaste: parado' (stopped) if not running.",
        ],
      },
      {
        name: "permissions",
        syntax: "boopaste permissions",
        summary: "Opens macOS System Settings directly to the Input Monitoring privacy pane.",
        behavior:
          "Runs open 'x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent'.",
        details: [
          "Use as a fallback if the automated permission prompt was missed or clicked away.",
          "Enables you to toggle the switch next to Boopaste with its official green ghost icon.",
        ],
      },
      {
        name: "uninstall",
        syntax: "boopaste uninstall",
        summary: "Completely wipes the daemon, bundles, symlink, and TCC permissions from macOS.",
        behavior: "Unloads launchd service, deletes files, and resets privacy database.",
        details: [
          "Unloads and deletes ~/Library/LaunchAgents/com.matheus.boopaste.plist.",
          "Deletes ~/Library/Application Support/boopaste/Boopaste.app.",
          "Removes the symlink at ~/.local/bin/boopaste.",
          "Executes tccutil reset ListenEvent, Accessibility, and PostEvent for com.matheus.boopaste.",
          "Unregisters from Launch Services via lsregister -u.",
        ],
      },
    ],
  },
  architecture: {
    tag: "04 / Code Architecture",
    title: "Rust Modules & Source Map",
    description:
      "boopaste is written in pure Rust with minimal native Cocoa/CoreGraphics bindings. Total implementation is under 500 lines.",
    modules: [
      {
        file: "src/main.rs",
        role: "CLI Entrypoint",
        description: "Uses clap (derive) to parse subcommands (on, off, status, init, permissions, uninstall, run).",
        highlights: [
          "Exposes public user subcommands.",
          "Defines internal hidden subcommand `run` invoked exclusively by launchd.",
        ],
      },
      {
        file: "src/eventtap.rs",
        role: "Global Key Interception",
        description: "Installs a CGEventTap on the active user session run loop to catch ⌘V synchronously.",
        highlights: [
          "Filtered to Session location and HeadInsertEventTap placement.",
          "Checks for CGEventFlagCommand and KEYCODE_V (0x09).",
          "Includes automatic tap recovery: re-enables itself via CGEventTapEnable on TapDisabledByTimeout.",
          "Calls IOHIDRequestAccess(1) on startup to trigger macOS permission prompt smoothly.",
        ],
      },
      {
        file: "src/frontmost.rs",
        role: "App Isolation Check",
        description: "Queries Cocoa's NSWorkspace to inspect the frontmost active application window.",
        highlights: [
          "Uses objc2-app-kit to call [NSWorkspace sharedWorkspace].frontmostApplication.",
          "Validates bundle identifier against 'com.mitchellh.ghostty' and 'com.apple.Terminal'.",
          "Designed to easily accept additional terminals in the future.",
        ],
      },
      {
        file: "src/clipboard.rs",
        role: "Swap & Restore Engine",
        description: "Handles reading images, saving PNG files, and scheduling clipboard restoration.",
        highlights: [
          "Uses arboard for fast cross-process clipboard interaction.",
          "Uses image crate to convert raw RGBA buffer into standard PNG.",
          "Saves to /tmp/boopaste/clip_<timestamp>.png.",
          "Spawns background thread with 200ms sleep (RESTORE_DELAY) to reinstate original image.",
        ],
      },
      {
        file: "src/launchagent.rs",
        role: "macOS Bundle & Service Manager",
        description: "Contains all logic for creating the .app bundle, launchd plist, symlink, and codesign.",
        highlights: [
          "Embeds AppIcon.icns at compile time via include_bytes!.",
          "Creates valid Info.plist with LSUIElement and LSBackgroundOnly true.",
          "Performs atomic binary replacement via rename to prevent corrupted code signatures while running.",
          "Manages launchctl load -w / unload -w and tccutil reset.",
        ],
      },
      {
        file: "src/daemon.rs",
        role: "Core Execution Loop",
        description: "Bridges the event tap callback with frontmost filtering and clipboard swapping.",
        highlights: [
          "Runs eventtap::run() and blocks current thread in CFRunLoop.",
          "Only triggers clipboard::swap_image_for_path() when is_supported_terminal_frontmost() is true.",
        ],
      },
    ],
  },
  permissions: {
    tag: "05 / macOS Permissions & TCC",
    title: "Security, Transparency & macOS TCC",
    description:
      "Because boopaste listens to global keystrokes and reads the clipboard, macOS categorizes it under Input Monitoring and Accessibility.",
    calloutTitle: "Auditability First",
    calloutBody:
      "Input Monitoring is the same permission keyloggers require. This is why boopaste is 100% open source under the MIT license, with no network capabilities and fewer than 500 lines of code you can inspect in five minutes.",
    points: [
      {
        title: "Why Input Monitoring is needed",
        desc: "CGEventTap needs permission to inspect KeyDown events across the operating system. Without this permission, the OS drops the tap callback.",
      },
      {
        title: "Ad-hoc signature & recompilation notice",
        desc: "Because boopaste is compiled locally without a paid $99/year Apple Developer ID certificate, its binary code signature is ad-hoc. Whenever you recompile from source, macOS security invalidates the previous grant, requiring you to re-approve it once.",
      },
      {
        title: "Clean uninstallation guarantee",
        desc: "When running boopaste uninstall, tccutil reset is invoked for ListenEvent, Accessibility, and PostEvent with bundle id com.matheus.boopaste, leaving zero orphan permissions behind.",
      },
      {
        title: "Zero Network Connections",
        desc: "boopaste contains zero networking libraries. It cannot send your keystrokes, clipboard, or files anywhere.",
      },
    ],
  },
  installation: {
    tag: "06 / Build & Installation",
    title: "Compiling from Source",
    description: "Build boopaste from source on your Apple Silicon Mac in under 30 seconds.",
    requirementsTitle: "System Requirements",
    requirements: [
      "macOS on Apple Silicon (arm64)",
      "Ghostty or native macOS Terminal.app installed",
      "Rust & Cargo toolchain (curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh)",
    ],
    steps: [
      {
        title: "1. Clone the repository",
        command: "git clone https://github.com/0kira-vgl/boopaste.git\ncd boopaste",
        notes: "Navigates into the source directory.",
      },
      {
        title: "2. Build release binary",
        command: "cargo build --release",
        notes: "Compiles an optimized arm64 binary at target/release/boopaste.",
      },
      {
        title: "3. Initialize bundle and LaunchAgent",
        command: "./target/release/boopaste init",
        notes:
          "Bundles Boopaste.app into ~/Library/Application Support/boopaste, sets up the LaunchAgent, and links ~/.local/bin/boopaste.",
      },
      {
        title: "4. Turn on the daemon",
        command: "boopaste on",
        notes:
          "Loads the daemon via launchd. Click 'Allow' on the macOS Input Monitoring prompt. Now copy an image and hit ⌘V in Ghostty or Terminal!",
      },
    ],
  },
  troubleshooting: {
    tag: "07 / Diagnostics & Logs",
    title: "Troubleshooting & Diagnostics",
    description:
      "If ⌘V pastes normal text instead of a file path, follow these diagnostic checks.",
    items: [
      {
        issue: "1. Check daemon status",
        solution: "Verify if the launchd service is actively loaded.",
        code: "boopaste status",
      },
      {
        issue: "2. Inspect logs",
        solution: "Output and error logs are saved in standard macOS user log directories.",
        code: "cat ~/Library/Logs/boopaste.log\ncat ~/Library/Logs/boopaste.err.log",
      },
      {
        issue: "3. Input Monitoring permission missing",
        solution:
          "If macOS never showed the permission alert or you rejected it by accident, launch the settings panel directly.",
        code: "boopaste permissions",
      },
      {
        issue: "4. PATH doesn't include ~/.local/bin",
        solution: "Add ~/.local/bin to your shell profile (~/.zshrc, ~/.config/fish/config.fish, etc.).",
        code: 'export PATH="$HOME/.local/bin:$PATH"',
      },
      {
        issue: "5. Clean reset & reinstall",
        solution: "Uninstall completely to reset TCC database flags, then re-init.",
        code: "boopaste uninstall\n./target/release/boopaste init\nboopaste on",
      },
    ],
  },
};

export const docsPt: DocContent = {
  navTitle: "boopaste_ docs",
  backToHome: "home",
  badge: "v0.1 · macOS Apple Silicon",
  title: "Por Dentro do Código",
  subtitle:
    "Manual técnico e referência completa do boopaste: o que cada comando faz, arquitetura interna em Rust, interceptação de eventos no macOS e daemon launchd.",
  quickSummary:
    "O boopaste roda silenciosamente como um LaunchAgent no macOS. Ao apertar ⌘V dentro do Ghostty ou do Terminal nativo com uma imagem copiada, ele salva a imagem como PNG em disco e cola o caminho absoluto do arquivo no seu terminal.",
  tocTitle: "Índice de Tópicos",
  sections: [
    { id: "overview", title: "Visão Geral & Motivação", tag: "01" },
    { id: "how-it-works", title: "Fluxo de Execução", tag: "02" },
    { id: "cli-commands", title: "Comandos da CLI", tag: "03" },
    { id: "architecture", title: "Arquitetura & Módulos Rust", tag: "04" },
    { id: "permissions", title: "Permissões do macOS (TCC)", tag: "05" },
    { id: "installation", title: "Compilação & Instalação", tag: "06" },
    { id: "troubleshooting", title: "Diagnóstico & Logs", tag: "07" },
  ],
  overview: {
    tag: "01 / Visão Geral & Motivação",
    title: "Por que o boopaste existe",
    p1: "Emuladores de terminal processam fluxos de texto puro. Quando você tira um print ou copia uma imagem e aperta ⌘V num terminal moderno (como ao usar Claude Code, Aider ou ferramentas de linha de comando com suporte a imagens), os terminais ignoram o atalho em silêncio ou cospem bytes binários corrompidos no seu shell.",
    p2: "O desenvolvedor geralmente precisa ir até o Finder, arrastar a imagem com o mouse ou salvar manualmente em disco para obter o caminho. O boopaste resolve essa fricção diretamente no nível do sistema operacional, sem interface gráfica desnecessária, sem peso de Electron e sem ícones na barra de menus.",
    problemBox: {
      title: "A Fricção do Clipboard",
      beforeTitle: "Sem o boopaste",
      beforeBody:
        "⌘C no print → abre o terminal (Ghostty / Terminal.app) → ⌘V → nada acontece ou sai lixo → vai no Finder → arrasta o arquivo para o terminal.",
      afterTitle: "Com o boopaste",
      afterBody:
        "⌘C no print → abre o terminal (Ghostty / Terminal.app) → ⌘V → /tmp/boopaste/clip_1726345678123.png é colado instantaneamente. A imagem original volta ao clipboard 200ms depois.",
    },
    keyBenefitsTitle: "Princípios de Design",
    keyBenefits: [
      {
        title: "Zero interface / Zero bloat",
        desc: "Sem ícone na menu bar, sem ícone no Dock (LSUIElement + LSBackgroundOnly), sem consumo desnecessário de memória. Apenas um binário nativo e ultra-rápido.",
      },
      {
        title: "Isolado exclusivamente para terminais suportados",
        desc: "Consulta a API Cocoa NSWorkspace para inspecionar o app em foco. Só age no Ghostty e no Terminal nativo do macOS. O ⌘V no Chrome, WhatsApp, Slack, Figma ou qualquer outro app fica 100% inalterado.",
      },
      {
        title: "Swap transitório com restauração automática",
        desc: "Substitui o clipboard pelo caminho do arquivo antes do paste chegar ao terminal, e spawna uma thread leve para restaurar a imagem original em 200ms.",
      },
      {
        title: "Persistência real via launchd",
        desc: "Usa launchctl load -w / unload -w. Se você ligar, ele sobrevive à reinicialização da máquina; se você desligar, ele permanece desligado até nova ordem.",
      },
    ],
  },
  pipeline: {
    tag: "02 / Fluxo de Execução",
    title: "Como a interceptação acontece em milissegundos",
    description:
      "O boopaste não faz polling no clipboard consumindo CPU à toa. Ele instala um event tap no run loop da sessão do CoreGraphics, disparando apenas quando a combinação física de teclas ⌘V é detectada.",
    steps: [
      {
        num: "01",
        title: "Interceptação Global de Tecla",
        code: "eventtap.rs → CGEventTap",
        desc: "Escuta eventos KeyDown em HeadInsertEventTap. Se a flag Command estiver ativa e a tecla for 0x09 ('V'), o callback dispara. O evento do teclado nunca é descartado.",
      },
      {
        num: "02",
        title: "Checagem do Aplicativo em Foco",
        code: "frontmost.rs → NSWorkspace",
        desc: "Consulta o bundle identifier do app em foco via Cocoa. Se não for 'com.mitchellh.ghostty' ou 'com.apple.Terminal', o boopaste sai de imediato sem encostar no clipboard.",
      },
      {
        num: "03",
        title: "Escrita Atômica do PNG",
        code: "clipboard.rs → arboard + image",
        desc: "Lê os bytes da imagem no clipboard. Se for imagem, codifica como PNG em /tmp/boopaste/clip_<timestamp>.png e grava a string do caminho no clipboard.",
      },
      {
        num: "04",
        title: "O Terminal Cola o Caminho",
        code: "OS → Terminal (Ghostty / Terminal.app)",
        desc: "O evento original do ⌘V prossegue para o terminal ativo, que lê o clipboard como texto e recebe o caminho válido do arquivo PNG salvo.",
      },
      {
        num: "05",
        title: "Restauração do Clipboard Original",
        code: "thread::spawn → 200ms delay",
        desc: "Uma thread em segundo plano aguarda 200 milissegundos e devolve a imagem original ao clipboard, garantindo que o histórico e pastes fora do terminal permaneçam intactos.",
      },
    ],
    flowDiagramTitle: "Diagrama do Fluxo",
    flowDiagramAscii: `[Usuário pressiona ⌘+V]
        │
        ▼
[CGEventTap em eventtap.rs] ── (Não é ⌘+V) ───────────► [Passa direto sem tocar]
        │ (⌘+V detectado)
        ▼
[Terminal suportado em foco?] ─ (Não, outro app) ─────► [Passa direto sem tocar]
        │ (Sim: Ghostty / Terminal.app)
        ▼
[Clipboard tem imagem?] ───── (Não, texto/vazio) ────► [Passa direto sem tocar]
        │ (Sim, ImageData encontrada)
        ▼
[1. Grava /tmp/boopaste/clip_<ts>.png]
[2. Coloca caminho do arquivo no clipboard]
[3. Evento ⌘+V entra no terminal (cola o path)]
[4. Thread em background: espera 200ms → restaura imagem original no clipboard]`,
  },
  commands: {
    tag: "03 / Comandos da CLI",
    title: "Referência da Interface de Linha de Comando",
    description:
      "Toda a administração do boopaste é feita através do binário de linha de comando instalado em ~/.local/bin/boopaste.",
    items: [
      {
        name: "init",
        syntax: "boopaste init",
        summary: "Prepara arquivos, bundle do app, plist do LaunchAgent e symlink, sem ligar automaticamente.",
        behavior:
          "Cria o Boopaste.app em ~/Library/Application Support/boopaste, gera o plist em ~/Library/LaunchAgents/com.matheus.boopaste.plist, cria o link em ~/.local/bin/boopaste e registra no Launch Services (lsregister).",
        details: [
          "Cria a estrutura de app bundle com AppIcon.icns para exibir o ícone nativo do fantasma nas permissões do macOS.",
          "Copia o binário de forma atômica usando rename para evitar erros de assinatura de código em instâncias já em execução.",
          "Assina o app localmente com identificador estável (codesign --sign - --identifier com.matheus.boopaste --force).",
          "NÃO liga o serviço automaticamente: execute boopaste on em seguida.",
        ],
      },
      {
        name: "on",
        syntax: "boopaste on",
        summary: "Ativa o boopaste em segundo plano e garante persistência após reinicializações.",
        behavior: "Executa launchctl load -w no arquivo plist.",
        details: [
          "A flag -w grava a preferência ativada no banco de dados do launchd, mantendo o serviço vivo entre reboots.",
          "Dispara o diálogo nativo de Monitoramento de Entrada do macOS caso a permissão ainda não tenha sido concedida.",
          "Valida a presença do plist e avisa para rodar boopaste init caso não esteja instalado.",
        ],
      },
      {
        name: "off",
        syntax: "boopaste off",
        summary: "Desativa o daemon em segundo plano e mantém desligado após reboots.",
        behavior: "Executa launchctl unload -w no arquivo plist.",
        details: [
          "Finaliza imediatamente o processo em execução no background.",
          "Grava o estado desligado no launchd até que você rode boopaste on explicitamente.",
        ],
      },
      {
        name: "status",
        syntax: "boopaste status",
        summary: "Informa se o daemon está atualmente rodando em background ou parado.",
        behavior: "Consulta launchctl list com.matheus.boopaste.",
        details: [
          "Exibe 'boopaste: rodando' se o daemon estiver ativo na sessão do launchd.",
          "Exibe 'boopaste: parado' se o serviço não estiver em execução.",
        ],
      },
      {
        name: "permissions",
        syntax: "boopaste permissions",
        summary: "Abre o Ajustes do Sistema do macOS diretamente na aba de Monitoramento de Entrada.",
        behavior:
          "Executa open 'x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent'.",
        details: [
          "Útil como alternativa caso você não tenha visto o pop-up nativo ou tenha clicado em Recusar por engano.",
          "Permite ativar a chave ao lado do Boopaste com o ícone oficial do fantasminha.",
        ],
      },
      {
        name: "uninstall",
        syntax: "boopaste uninstall",
        summary: "Remove completamente o daemon, bundle, symlink e permissões TCC do macOS.",
        behavior: "Descarrega o launchd, apaga todos os arquivos e reseta o banco de privacidade.",
        details: [
          "Descarrega e deleta ~/Library/LaunchAgents/com.matheus.boopaste.plist.",
          "Remove ~/Library/Application Support/boopaste/Boopaste.app.",
          "Remove o link simbólico em ~/.local/bin/boopaste.",
          "Executa tccutil reset nos serviços ListenEvent, Accessibility e PostEvent para com.matheus.boopaste.",
          "Remove o registro do bundle do Launch Services via lsregister -u.",
        ],
      },
    ],
  },
  architecture: {
    tag: "04 / Arquitetura & Módulos Rust",
    title: "Módulos do Código-Fonte (`src/`)",
    description:
      "O boopaste é escrito em Rust puro com bindings mínimas e nativas para Cocoa e CoreGraphics. Menos de 500 linhas no total.",
    modules: [
      {
        file: "src/main.rs",
        role: "Ponto de Entrada da CLI",
        description: "Usa clap (derive) para interpretar os subcomandos (on, off, status, init, permissions, uninstall, run).",
        highlights: [
          "Expõe os comandos públicos do usuário com mensagens de ajuda e documentação.",
          "Define o subcomando oculto `run` invocado exclusivamente pelo launchd em segundo plano.",
        ],
      },
      {
        file: "src/eventtap.rs",
        role: "Interceptação Global de Teclado",
        description: "Instala um CGEventTap no run loop da sessão do usuário para capturar o ⌘V de forma síncrona.",
        highlights: [
          "Instalado em CGEventTapLocation::Session e CGEventTapPlacement::HeadInsertEventTap.",
          "Filtra eventos KeyDown checando a flag Command e o keycode 0x09 ('V').",
          "Auto-recuperação: se o macOS desativar o tap por lentidão (TapDisabledByTimeout), reativa automaticamente via CGEventTapEnable.",
          "Chama IOHIDRequestAccess(1) ao iniciar para acionar o prompt nativo de permissão do macOS.",
        ],
      },
      {
        file: "src/frontmost.rs",
        role: "Detecção de App em Foco",
        description: "Consulta a API NSWorkspace da Apple para inspecionar qual janela está ativa no momento.",
        highlights: [
          "Usa objc2-app-kit para chamar [NSWorkspace sharedWorkspace].frontmostApplication.",
          "Compara o bundleIdentifier com 'com.mitchellh.ghostty' e 'com.apple.Terminal'.",
          "Estrutura modular preparada para adicionar novos terminais facilmente.",
        ],
      },
      {
        file: "src/clipboard.rs",
        role: "Motor de Swap e Restauração",
        description: "Responsável pela leitura de imagens, gravação em PNG e restauração do clipboard original.",
        highlights: [
          "Usa arboard para leitura e escrita ultrarrápida do clipboard entre processos.",
          "Usa a crate image para salvar o buffer RGBA cru como PNG em /tmp/boopaste/clip_<timestamp>.png.",
          "Substitui o conteúdo do clipboard pelo caminho do arquivo.",
          "Spawna uma thread em background com sleep de 200ms (RESTORE_DELAY) para devolver a imagem original.",
        ],
      },
      {
        file: "src/launchagent.rs",
        role: "Gerenciador do Bundle e Daemon",
        description: "Empacota o .app, configura o plist do launchd, cria o symlink e assina o executável.",
        highlights: [
          "Embutido o ícone AppIcon.icns em tempo de compilação via include_bytes!.",
          "Gera Info.plist configurando LSUIElement e LSBackgroundOnly como true (invisível no Dock e app switcher).",
          "Cópia atômica via rename para evitar erros de assinatura de código em instâncias já em execução.",
          "Administra o ciclo de vida com launchctl load -w / unload -w e tccutil reset.",
        ],
      },
      {
        file: "src/daemon.rs",
        role: "Loop Principal do Daemon",
        description: "Conecta a escuta do event tap com a checagem do app e a troca do clipboard.",
        highlights: [
          "Inicia eventtap::run() e mantém a thread rodando o CFRunLoop.",
          "Dispara clipboard::swap_image_for_path() exclusivamente quando is_supported_terminal_frontmost() retorna true.",
        ],
      },
    ],
  },
  permissions: {
    tag: "05 / Permissões do macOS (TCC)",
    title: "Segurança, Privacidade e o TCC da Apple",
    description:
      "Como o boopaste escuta eventos globais de teclado e manipula o clipboard, o macOS classifica suas permissões em Monitoramento de Entrada e Acessibilidade.",
    calloutTitle: "Auditabilidade em Primeiro Lugar",
    calloutBody:
      "Monitoramento de Entrada é a mesma permissão usada por keyloggers. Por isso o boopaste é 100% open-source com licença MIT, não faz nenhuma chamada de rede e possui menos de 500 linhas de código que você pode auditar em 5 minutos.",
    points: [
      {
        title: "Por que Monitoramento de Entrada é exigido",
        desc: "A API CGEventTap necessita de autorização explícita para observar eventos KeyDown no sistema. Sem ela, o macOS descarta o callback.",
      },
      {
        title: "Assinatura ad-hoc e recompilações",
        desc: "Como o boopaste é compilado localmente sem certificado pago da Apple ($99/ano), sua assinatura é local (ad-hoc). Se você recompilar o código do fonte, o hash muda e o macOS solicitará a permissão novamente uma vez.",
      },
      {
        title: "Garantia de remoção limpa (uninstall)",
        desc: "Ao rodar boopaste uninstall, o utilitário tccutil reset limpa todas as autorizações concedidas nos serviços ListenEvent, Accessibility e PostEvent para o bundle com.matheus.boopaste.",
      },
      {
        title: "Zero Acesso à Internet",
        desc: "O boopaste não contém dependências de rede (reqwest, curl, etc.). É impossível enviar seus dados ou imagens para qualquer lugar.",
      },
    ],
  },
  installation: {
    tag: "06 / Compilação & Instalação",
    title: "Compilação a partir do Código-Fonte",
    description: "Compile o boopaste localmente no seu Mac Apple Silicon em menos de 30 segundos.",
    requirementsTitle: "Requisitos do Sistema",
    requirements: [
      "macOS em processadores Apple Silicon (arm64)",
      "Ghostty ou Terminal.app nativo do macOS",
      "Rust & Cargo (curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh)",
    ],
    steps: [
      {
        title: "1. Clonar o repositório",
        command: "git clone https://github.com/0kira-vgl/boopaste.git\ncd boopaste",
        notes: "Acessa a pasta do código-fonte.",
      },
      {
        title: "2. Compilar binário release",
        command: "cargo build --release",
        notes: "Gera o executável nativo ultra-otimizado em target/release/boopaste.",
      },
      {
        title: "3. Inicializar bundle e LaunchAgent",
        command: "./target/release/boopaste init",
        notes:
          "Instala o Boopaste.app em ~/Library/Application Support/boopaste, configura o LaunchAgent e cria o atalho em ~/.local/bin/boopaste.",
      },
      {
        title: "4. Ligar o daemon",
        command: "boopaste on",
        notes:
          "Inicia o serviço via launchd. Clique em 'Permitir' no alerta de Monitoramento de Entrada. Pronto: copie qualquer print e dê ⌘V no Ghostty ou no Terminal!",
      },
    ],
  },
  troubleshooting: {
    tag: "07 / Diagnóstico & Logs",
    title: "Solução de Problemas & Diagnóstico",
    description:
      "Se ao apertar ⌘V no terminal o caminho da imagem não for colado, verifique este roteiro de diagnóstico.",
    items: [
      {
        issue: "1. Verificar se o daemon está rodando",
        solution: "Cheque se o serviço do launchd está ativo no momento.",
        code: "boopaste status",
      },
      {
        issue: "2. Visualizar logs de execução e erro",
        solution: "Os logs são gravados no diretório padrão de logs de usuário do macOS.",
        code: "cat ~/Library/Logs/boopaste.log\ncat ~/Library/Logs/boopaste.err.log",
      },
      {
        issue: "3. Permissão de Monitoramento de Entrada não autorizada",
        solution:
          "Se o pop-up nativo não apareceu ou foi fechado, abra diretamente a tela de preferências do sistema.",
        code: "boopaste permissions",
      },
      {
        issue: "4. Comando boopaste não encontrado no terminal",
        solution: "Certifique-se de que ~/.local/bin está presente na variável PATH do seu shell (~/.zshrc, config.fish, etc.).",
        code: 'export PATH="$HOME/.local/bin:$PATH"',
      },
      {
        issue: "5. Reset completo e reinstalação",
        solution: "Remova por completo com o uninstall para resetar as permissões no TCC e reinstale do zero.",
        code: "boopaste uninstall\n./target/release/boopaste init\nboopaste on",
      },
    ],
  },
};

export const docsDictionary = {
  en: docsEn,
  pt: docsPt,
};
