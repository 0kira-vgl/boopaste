# boopaste — Plano do Projeto

> Ferramenta CLI em Rust, open-source e self-hostable, que converte automaticamente
> uma imagem copiada no clipboard do macOS em um caminho de arquivo — mas **só**
> quando o paste (Cmd+V) acontece dentro do terminal **Ghostty**. Em qualquer outro
> app (WhatsApp, Preview, etc.), o clipboard/paste continua 100% normal.

Substitui o workaround manual `imgwatch` (baseado em polling + `pngpaste`), que
precisava ser ligado/desligado manualmente e não distinguia o app em foco.

## Escopo inicial

- Apenas **macOS** + terminal **Ghostty** (outros terminais ficam para depois).
- Totalmente configurável via CLI: ligar, desligar, checar status.
- Estado persiste entre reboots — se desligado, continua desligado até o usuário
  ligar de novo (mesma garantia que o `imgwatch` já tinha via LaunchAgent).

## Arquitetura técnica

- **CGEventTap** (event tap global do macOS) interceptando especificamente o
  atalho Cmd+V — em vez do polling anterior do `imgwatch`.
- **NSWorkspace.frontmostApplication** (via crate `objc2-app-kit`) para detectar
  qual app está em foco e restringir o comportamento ao Ghostty.
- **arboard** para ler/escrever o clipboard (incluindo imagens).
- **image** para gravar os dados de imagem do clipboard como PNG em disco.
- **launchd/LaunchAgent** (`launchctl load -w` / `unload -w`) para persistência
  do estado on/off entre reboots — mesmo padrão usado no `imgwatch`.
- Maior fricção de adoção esperada: permissão de Accessibility/Input Monitoring
  (mesma categoria de permissão usada por keyloggers) — mitigado por código
  aberto, auditável, e documentação clara no README sobre o motivo da permissão.

### Estrutura de módulos (`src/`)

- `main.rs` — parsing do CLI via `clap` (subcomandos abaixo)
- `eventtap.rs` — CGEventTap + intercept do Cmd+V
- `clipboard.rs` — swap-and-restore do clipboard via `arboard`
- `frontmost.rs` — detecção do app em foco
- `daemon.rs` — loop principal do daemon
- `launchagent.rs` — geração/instalação/remoção do plist, load -w / unload -w

### Subcomandos do CLI

- `boopaste on` — liga (roda em background, sobrevive a reboot)
- `boopaste off` — desliga
- `boopaste status` — mostra se está ligado ou desligado
- `boopaste init` — instala o LaunchAgent (sem ligar automaticamente)
- `boopaste uninstall` — remove o LaunchAgent e os arquivos instalados

## Nome do projeto

Nome original cogitado era `ghostpaste`, mas `ghostpaste.dev` e `ghostpaste.com`
já são usados por um produto não relacionado (compartilhamento de código
criptografado). `ghostpaste.com.br` estava livre, mas o usuário não quer `.com.br`
— quer `.dev` ou `.com` puro.

Decisão: renomear para **boopaste**, mantendo o trocadilho com fantasma ("boo" =
som clássico de fantasma assustando alguém) + "paste" (ação de colar, que é
literalmente o que a ferramenta intercepta). Verificação informal indicou que
`boopaste.com` e `boopaste.dev` não resolvem via DNS e não aparecem em buscas —
bom sinal, mas ainda não confirmado via WHOIS num registrador antes da compra.

Outros nomes cogitados na shortlist: `ghostclip`, `wraithpaste`, `phantompaste`,
`spectrepaste`, `ghostjack`, `hauntpaste`, `ectopaste`, `ghostslip`,
`vanishpaste`, `spookypaste`, `booclip`.

## Licença

**MIT** — recomendado por ser curta, permissiva, exigir só atribuição, e por
não haver preocupações de patente que justifiquem a Apache 2.0 (que adiciona
concessão explícita de patente e exige documentar mudanças — mais comum em
projetos de organizações maiores).

## Distribuição

Duas vias, nenhuma dependente de aprovação externa:

1. **Homebrew tap próprio** (`homebrew-boopaste`) — repo com fórmula Ruby
   apontando pros binários publicados nas GitHub Releases.
2. **Script `curl | sh`** — baixa o binário certo direto das GitHub Releases.

Entrar no `homebrew-core` oficial exige critérios de maturidade/popularidade
não relevantes no lançamento — começar pelas duas opções acima é suficiente.

## Landing page

**Decisão: monorepo.** A landing page (Next.js) vive em `landing/` dentro do
mesmo repositório do `boopaste`, e é deployada separadamente (ex: Vercel
apontando o "Root Directory" pra essa subpasta). Só valeria a pena um repo
separado se a landing crescesse muito ou virasse um produto à parte — não é
o caso de um projeto desse tamanho.

Estilo da landing: minimalista, com estética "dev" — ASCII art e animações em
Three.js.

## Estrutura do repositório

```
boopaste/
├── src/              # CLI em Rust
├── Cargo.toml
├── landing/          # app Next.js (deploy separado via Vercel)
├── README.md
├── LICENSE           # MIT
└── PLANO.md          # este arquivo
```

## Status atual

- [x] Rust instalado via Homebrew (usuário não tinha nenhuma ferramenta Rust)
- [x] Projeto Rust criado em `~/dev/boopaste` (`cargo init`)
- [x] Dependências iniciais adicionadas: `clap` (derive), `arboard`, `image`
- [x] Skeleton dos módulos e subcomandos do CLI criado (todos os handlers são
      `todo!()` por enquanto)
- [x] Pasta `landing/` criada (vazia, Next.js ainda não inicializado)
- [ ] Confirmar disponibilidade real do domínio `boopaste` via WHOIS num
      registrador antes de comprar
- [ ] Implementar `launchagent.rs` (reaproveitando lógica do `imgwatch`)
- [ ] Implementar `eventtap.rs`, `frontmost.rs`, `clipboard.rs`, `daemon.rs`
- [ ] Escrever README com instruções de instalação e nota sobre a permissão
      de Accessibility/Input Monitoring
- [ ] Adicionar LICENSE (MIT)
- [ ] Inicializar Next.js em `landing/`
- [ ] Criar `homebrew-boopaste` tap + script de instalação via curl
