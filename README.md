# boopaste

Cola imagens do clipboard como caminho de arquivo — só dentro do
[Ghostty](https://ghostty.org) e do Terminal.app nativo do macOS.

Terminais não recebem bytes de imagem via paste, só texto. Quando você copia
um print e dá Cmd+V dentro de um desses terminais, o `boopaste` intercepta o
atalho, salva a imagem como PNG em disco e troca o conteúdo do clipboard pelo
caminho do arquivo — assim o paste cola um path válido, que ferramentas como
o Claude Code interpretam como imagem. Fora deles o Cmd+V funciona normal,
sem nenhuma interferência.

## Requisitos

- macOS (Apple Silicon)
- [Ghostty](https://ghostty.org) ou o Terminal.app (já vem no macOS)
- [Rust](https://www.rust-lang.org) (só se for compilar a partir do código-fonte)

## Instalação

```bash
git clone https://github.com/0kira-vgl/boopaste.git
cd boopaste
cargo build --release
./target/release/boopaste init
```

O `init` instala o `boopaste` como um app (`Boopaste.app`) em
`~/Library/Application Support/boopaste/`, registra um LaunchAgent e cria um
link simbólico em `~/.local/bin/boopaste` — depois disso o comando
`boopaste` já funciona direto no terminal (adicione `~/.local/bin` ao seu
`PATH` se ainda não estiver).

## Comandos

| Comando | O que faz |
|---|---|
| `boopaste init` | Instala o binário e o LaunchAgent. Não liga automaticamente. |
| `boopaste on` | Liga o boopaste (roda em background, sobrevive a reboot). |
| `boopaste off` | Desliga o boopaste. |
| `boopaste status` | Mostra se está rodando ou parado. |
| `boopaste permissions` | Abre a tela de Monitoramento de Entrada do macOS, caso o alerta automático de permissão não apareça. |
| `boopaste uninstall` | Remove tudo: LaunchAgent, binário instalado, link simbólico e as permissões concedidas no TCC (Acessibilidade, Monitoramento de Entrada). |

## Permissões do macOS

Pra interceptar o Cmd+V globalmente, o macOS exige que o `boopaste` tenha
permissão de **Monitoramento de Entrada** e **Acessibilidade**
(Configurações do Sistema → Privacidade e Segurança).

Na primeira vez que você roda `boopaste on`, deve aparecer um alerta nativo
pedindo essa permissão — é só clicar em Permitir. Se o alerta não aparecer
(ou se você tiver clicado em "Não Permitir" antes, caso em que o macOS não
pergunta de novo), rode `boopaste permissions` para abrir a tela certa
manualmente.

> Como o binário é assinado localmente (sem certificado pago da Apple), toda
> vez que ele for recompilado a permissão concedida deixa de valer e precisa
> ser reconcedida uma vez — isso é uma limitação do macOS para binários sem
> assinatura de um Apple Developer ID, não algo controlável via código.

## Como funciona

- **`eventtap`**: instala um `CGEventTap` global (via `core-graphics`) que
  escuta apenas o atalho Cmd+V, em toda a sessão do usuário.
- **`frontmost`**: verifica se o app em foco é um dos terminais suportados
  (Ghostty ou Terminal.app, via `NSWorkspace`) antes de agir — em qualquer
  outro app o Cmd+V passa direto, sem swap.
- **`clipboard`**: se houver uma imagem no clipboard, salva como PNG em
  `/tmp/boopaste/`, substitui o clipboard pelo caminho do arquivo, e restaura
  a imagem original ~200ms depois (pra não quebrar o paste normal em outros
  apps que compartilhem o mesmo clipboard).
- **`launchagent`**: empacota o binário num `.app` mínimo, cuida da
  instalação/remoção do LaunchAgent (`launchctl load/unload -w`, persistindo
  o estado ligado/desligado entre reboots) e da limpeza das permissões TCC no
  uninstall.

## Licença

MIT — veja [LICENSE](LICENSE).
