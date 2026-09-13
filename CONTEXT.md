# Contexto completo — imgwatch → boopaste

> Este arquivo existe para dar contexto completo a qualquer agente/IA que
> trabalhe neste repositório. Cobre tudo que foi decidido e implementado até
> agora, do workaround original (`imgwatch`) até o planejamento do `boopaste`.
> Não contém nada sobre outros projetos do usuário (ex: barbearia).

## Quem é o usuário

Matheus. Não tem experiência com Rust ("literalmente nada" — nenhuma
ferramenta Rust estava instalada no computador antes deste projeto). Usa
fish shell, macOS (Apple Silicon, arm64), Homebrew instalado. Prefere
decisões práticas e diretas, e gosta de entender o "porquê" antes de agir
(ex: perguntou a diferença entre MIT e Apache 2.0 antes de decidir).

## Origem do problema

O usuário usa o terminal **Ghostty** com Claude Code, e queria colar imagens
copiadas (Cmd+C de um print, por exemplo) diretamente no terminal. Terminais
não recebem bytes de imagem via paste — só texto. A solução é: quando uma
imagem está no clipboard, salvá-la como arquivo e colocar o **caminho do
arquivo** no clipboard no lugar, para que o paste no terminal cole um path
válido (que ferramentas como o Claude Code conseguem interpretar como imagem).

## Fase 1 — `imgwatch` (workaround já implementado e funcionando)

Solução inicial, simples, baseada em **polling** com `pngpaste`. Liga/desliga
manualmente via comando fish, mas quando ligado funciona em qualquer app (não
só Ghostty) — é "global" e sem distinção de app em foco.

### Arquivos implementados

**`~/.local/bin/clipimg-watch.sh`** — script bash que roda em loop infinito,
checando o clipboard a cada 0.5s via `pngpaste`. Se achar uma imagem, salva em
`/tmp/claude-clip-images/clip_<timestamp>.png` e substitui o clipboard pelo
caminho do arquivo via `pbcopy`.

```bash
#!/bin/bash
PNGPASTE="/opt/homebrew/bin/pngpaste"
DEST_DIR="/tmp/claude-clip-images"
mkdir -p "$DEST_DIR"

while true; do
    TMP_FILE="$DEST_DIR/.tmp_check.png"
    if "$PNGPASTE" "$TMP_FILE" 2>/dev/null; then
        FINAL_FILE="$DEST_DIR/clip_$(date +%Y%m%d_%H%M%S).png"
        mv "$TMP_FILE" "$FINAL_FILE"
        printf '%s' "$FINAL_FILE" | pbcopy
    fi
    sleep 0.5
done
```

**`~/Library/LaunchAgents/com.matheus.clipimgwatch.plist`** — LaunchAgent que
roda o script acima, com `RunAtLoad` e `KeepAlive` true (garante que o processo
sempre volta a rodar, inclusive após reboot, respeitando o estado on/off
setado pelo usuário via `launchctl load -w` / `unload -w`).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.matheus.clipimgwatch</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/matheus/.local/bin/clipimg-watch.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/matheus/Library/Logs/clipimgwatch.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/matheus/Library/Logs/clipimgwatch.err.log</string>
</dict>
</plist>
```

**Função `imgwatch` em `~/.config/fish/config.fish`** — interface de linha de
comando pro usuário ligar, desligar e checar status, usando `launchctl load -w`
/ `unload -w` (o `-w` é o que garante persistência do estado entre reboots).

```fish
function imgwatch
    set -l plist ~/Library/LaunchAgents/com.matheus.clipimgwatch.plist
    switch $argv[1]
        case on
            launchctl load -w $plist 2>/dev/null
            echo "imgwatch: ligado (persiste entre reinicializações até você desligar)"
        case off
            launchctl unload -w $plist 2>/dev/null
            echo "imgwatch: desligado (persiste entre reinicializações até você ligar)"
        case status
            if launchctl list | grep -q com.matheus.clipimgwatch
                echo "imgwatch: rodando"
            else
                echo "imgwatch: parado"
            end
        case '*'
            echo "uso: imgwatch on|off|status"
    end
end
```

### Bugs encontrados e corrigidos durante a implementação

1. **Parse error no `config.fish`** logo após adicionar a função (linha 7) —
   corrigido ajustando a sintaxe do append.
2. **`pbpaste` retornando vazio no primeiro teste** — o LaunchAgent roda como
   o usuário `matheus`, mas sem sessão de terminal, e inicialmente parecia não
   ter acesso ao Pasteboard da GUI.
3. **Causa raiz real**: o LaunchAgent tem um `PATH` mínimo que não inclui
   `/opt/homebrew/bin`, então o `pngpaste` (instalado via Homebrew) não era
   encontrado dentro do contexto do LaunchAgent — funcionava normal quando
   rodado manualmente no terminal, mas falhava silenciosamente dentro do
   LaunchAgent. **Fix**: usar o caminho absoluto do binário
   (`/opt/homebrew/bin/pngpaste`) direto no script, em vez de confiar no PATH.
4. Depois desse fix, a conversão automática de imagem → caminho de arquivo
   passou a funcionar **end-to-end**, com o serviço rodando de forma estável
   via LaunchAgent.

### Limitações do `imgwatch` que motivaram o `boopaste`

- É **global**: troca o clipboard em qualquer app, não só no Ghostty. Isso
  quebra o comportamento normal de paste em apps como WhatsApp, Preview, etc.
  quando ligado.
- Baseado em **polling** (checagem a cada 0.5s), não em interceptação real do
  evento de paste — funciona, mas é uma abordagem mais rudimentar.
- Por causa da limitação acima, o usuário precisa ligar/desligar manualmente
  dependendo do que vai fazer — não é "liga e esquece".

`imgwatch` continua funcionando e nenhum arquivo dele foi alterado durante o
planejamento do `boopaste` — são projetos paralelos, não um substituindo o
outro ainda.

## Fase 2 — `boopaste` (novo projeto, em construção)

### Objetivo

Resolver a limitação principal do `imgwatch`: só trocar o clipboard quando o
paste (Cmd+V) acontecer **dentro do Ghostty**, deixando todos os outros apps
com comportamento de clipboard/paste 100% normal e nativo. Escopo inicial:
apenas macOS + Ghostty (outros terminais ficam para depois).

### Requisitos funcionais

- Totalmente configurável via CLI: ligar, desligar, checar status.
- Estado persiste entre reboots com a mesma garantia do `imgwatch`: se
  desligado, continua desligado até o usuário ligar; se ligado, continua
  ligado até o usuário desligar.
- Open-source, self-hostable.

### Decisão de arquitetura técnica

Em vez de polling, usar:

- **CGEventTap** — event tap global do macOS, interceptando especificamente o
  atalho Cmd+V (não fica processando o clipboard toda hora, só reage ao
  gesto de paste).
- **NSWorkspace.frontmostApplication** (via crate `objc2-app-kit`) — detecta
  qual app está em foco no momento do Cmd+V, pra só agir se for o Ghostty.
- **arboard** (crate Rust) — leitura/escrita do clipboard, incluindo imagens,
  cross-platform.
- **image** (crate Rust) — grava os bytes de imagem do clipboard como PNG em
  disco.
- **launchd/LaunchAgent** com `launchctl load -w` / `unload -w` — mesmo
  mecanismo de persistência do `imgwatch`, reaproveitando o padrão que já
  funciona.

### Fricção de adoção esperada

CGEventTap exige permissão de **Accessibility / Input Monitoring** no macOS —
a mesma categoria de permissão usada por keyloggers, o que é a maior barreira
de confiança esperada para quem for instalar essa ferramenta vinda de terceiro.
Mitigação: código aberto e auditável, com documentação clara no README
explicando exatamente por que essa permissão é necessária e o que o código
faz com ela.

### Estrutura de módulos Rust (`src/`)

- `main.rs` — parsing do CLI via `clap` (derive), com os subcomandos abaixo.
- `eventtap.rs` — CGEventTap + intercept do Cmd+V. (stub, `todo!()`)
- `clipboard.rs` — swap-and-restore do clipboard via `arboard`. (stub, `todo!()`)
- `frontmost.rs` — detecção do app em foco. (stub, `todo!()`)
- `daemon.rs` — loop principal do daemon. (stub, comentário só)
- `launchagent.rs` — geração/instalação/remoção do plist, `load -w`/`unload -w`.
  (stub, todas as funções são `todo!()`)

### Subcomandos do CLI (já definidos no `main.rs`, lógica ainda não implementada)

- `boopaste on` — liga (roda em background, sobrevive a reboot)
- `boopaste off` — desliga
- `boopaste status` — mostra se está ligado ou desligado
- `boopaste init` — instala o LaunchAgent (sem ligar automaticamente)
- `boopaste uninstall` — remove o LaunchAgent e os arquivos instalados

### Histórico do nome do projeto

1. Nome original: **ghostpaste**. Trocadilho com "ghost" (terminal invisível
   agindo por trás dos panos) + "paste" (ação de colar).
2. Problema identificado: `ghostpaste.dev` e `ghostpaste.com` já são usados
   por um produto não relacionado (ferramenta de compartilhamento de código
   com criptografia). `ghostpaste.com.br` estava disponível, mas o usuário
   não quer `.com.br` de jeito nenhum — só aceita `.dev` ou `.com` puro.
3. Risco de marca avaliado como baixo (nichos completamente diferentes, sem
   um grande brand em jogo), mas o problema de disponibilidade de domínio é
   real — decisão de trocar o nome agora, antes de criar repositório público,
   tap do Homebrew, README, etc. sob o nome conflitante.
4. Brainstorm de alternativas mantendo o trocadilho "ghost": `ghostclip`,
   `wraithpaste`, `phantompaste`, `spectrepaste`, `ghostjack`, `hauntpaste`,
   `ectopaste`, `ghostslip`, `vanishpaste`, `spookypaste`, `boopaste`,
   `booclip`.
5. Usuário propôs **boopaste** por conta própria — "boo" é o som clássico de
   fantasma assustando alguém, mantendo o trocadilho, curto e fácil de
   lembrar. Risco identificado: "boo" é palavra comum em inglês informal
   (também usada como "amor/babe"), o que pode gerar mais concorrência de
   domínio/redes sociais do que termos mais nichados como "wraith" ou
   "phantom" — mas ainda assim ficou como favorito.
6. Comparação final entre **boopaste** e **booclip**: escolhido **boopaste**
   porque "paste" comunica com mais precisão a ação específica que a
   ferramenta intercepta (o momento do paste/Cmd+V), enquanto "clip"
   (clipboard) é mais genérico; e porque "boopaste" soa mais fluido como uma
   palavra só.
7. Verificação informal de disponibilidade: `boopaste.com` e `boopaste.dev`
   não resolvem via DNS (`ENOTFOUND`) e não aparecem em buscas na web — bom
   sinal, mas **ainda não confirmado via WHOIS num registrador de verdade**
   antes de qualquer compra.
8. **Nome final decidido: `boopaste`.**

### Licença

**MIT** — decisão confirmada pelo usuário. Motivo: curta, permissiva, exige
só atribuição; não há preocupações de patente que justifiquem Apache 2.0
(que adiciona concessão explícita de patente e exige documentar mudanças —
mais comum em projetos de organizações maiores). Arquivo `LICENSE` ainda
precisa ser criado no repositório.

### Distribuição planejada

Duas vias, nenhuma dependente de aprovação externa de terceiros:

1. **Homebrew tap próprio** (`homebrew-boopaste`) — repositório separado com
   uma fórmula Ruby apontando para os binários publicados nas GitHub Releases
   do `boopaste`.
2. **Script `curl | sh`** — baixa o binário certo (por arquitetura) direto das
   GitHub Releases.

Entrar no `homebrew-core` oficial exigiria critérios de maturidade/popularidade
não relevantes no lançamento — as duas opções acima bastam para começar.

### Landing page

**Decisão: monorepo.** A landing page vive na subpasta `landing/` dentro do
mesmo repositório do `boopaste` (não em repositório separado). É deployada
separadamente (ex: Vercel apontando o "Root Directory" para `landing/`).
Só valeria a pena separar em outro repo se a landing crescesse muito ou
virasse um produto à parte (blog, dashboard, etc.) — não é o caso aqui.

- **Stack**: Next.js (decisão do usuário).
- **Estilo visual**: minimalista, estética "dev", com ASCII art e animações
  em Three.js.
- Setup do Next.js dentro de `landing/`: como a pasta já existe vazia, criar
  direto nela (`npx create-next-app@latest landing` a partir da raiz do repo,
  ou `npx create-next-app@latest .` de dentro de `landing/`) — sem criar uma
  subpasta extra dentro de `landing/`.

## Estrutura atual do repositório (`~/dev/boopaste`)

```
boopaste/
├── .git/
├── .gitignore
├── Cargo.toml          # deps: clap (derive), arboard, image
├── Cargo.lock
├── src/
│   ├── main.rs          # CLI com clap, 5 subcomandos definidos
│   ├── daemon.rs         # stub (só comentário)
│   ├── clipboard.rs      # stub (só comentário)
│   ├── frontmost.rs      # stub (só comentário)
│   ├── eventtap.rs       # stub (só comentário)
│   └── launchagent.rs    # stub (funções com todo!())
├── landing/             # vazia, Next.js ainda não inicializado
├── PLANO.md             # plano resumido do projeto
└── CONTEXT.md           # este arquivo
```

Ambiente: Rust foi instalado via Homebrew nesta sessão (`brew install rust`),
já que o usuário não tinha nenhuma ferramenta Rust antes. `cargo build`
compila sem erros (só warnings esperados de código ainda não implementado).
Nada foi commitado ainda no git — os arquivos estão staged (`git add -A`),
aguardando o usuário pedir o primeiro commit.

## Estado de decisões (tudo confirmado pelo usuário, nada em aberto)

| Decisão | Valor |
|---|---|
| Nome do projeto | `boopaste` |
| Linguagem do CLI | Rust |
| Escopo inicial | macOS + Ghostty apenas |
| Licença | MIT |
| Distribuição | Homebrew tap próprio + script curl |
| Estrutura do repo | Monorepo (CLI + `landing/` juntos) |
| Stack da landing page | Next.js |
| Estilo da landing page | Minimalista, dev, ASCII art + Three.js |

## Pendências / próximos passos

- [ ] Confirmar disponibilidade real do domínio `boopaste` via WHOIS num
      registrador (Porkbun, Namecheap, etc.) antes de comprar.
- [ ] Implementar `launchagent.rs`, reaproveitando a lógica do `imgwatch`
      (plist + `launchctl load -w`/`unload -w`).
- [ ] Implementar `eventtap.rs` (CGEventTap para Cmd+V).
- [ ] Implementar `frontmost.rs` (detecção do Ghostty via `objc2-app-kit`).
- [ ] Implementar `clipboard.rs` (swap-and-restore via `arboard` + `image`).
- [ ] Implementar `daemon.rs` (loop principal ligando tudo acima).
- [ ] Criar `LICENSE` (MIT).
- [ ] Escrever `README.md` com instruções de instalação e explicação clara
      sobre a permissão de Accessibility/Input Monitoring.
- [ ] Inicializar o Next.js dentro de `landing/`.
- [ ] Criar o repositório `homebrew-boopaste` (tap) + script de instalação
      via curl.
- [ ] Primeiro commit do repositório (ainda não feito).
