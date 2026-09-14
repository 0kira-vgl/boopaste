// Geração, instalação e controle do LaunchAgent que roda `boopaste run` em
// background, sobrevivendo a reboots — mesmo mecanismo do `imgwatch`:
// `launchctl load -w` / `unload -w` (o `-w` grava o estado on/off no plist
// overrides do launchd, então ele persiste entre reinicializações).

use std::env;
use std::fs;
use std::os::unix::fs::symlink;
use std::path::PathBuf;
use std::process::Command;

const LABEL: &str = "com.matheus.boopaste";

fn home_dir() -> PathBuf {
    PathBuf::from(env::var("HOME").expect("variável de ambiente HOME não definida"))
}

fn plist_path() -> PathBuf {
    home_dir()
        .join("Library/LaunchAgents")
        .join(format!("{LABEL}.plist"))
}

fn install_dir() -> PathBuf {
    home_dir().join("Library/Application Support/boopaste")
}

fn installed_binary_path() -> PathBuf {
    install_dir().join("boopaste")
}

fn logs_dir() -> PathBuf {
    home_dir().join("Library/Logs")
}

fn symlink_path() -> PathBuf {
    home_dir().join(".local/bin/boopaste")
}

fn plist_contents(binary_path: &std::path::Path) -> String {
    let binary_path = binary_path.display();
    let stdout_log = logs_dir().join("boopaste.log");
    let stderr_log = logs_dir().join("boopaste.err.log");
    let stdout_log = stdout_log.display();
    let stderr_log = stderr_log.display();
    format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>{LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>{binary_path}</string>
        <string>run</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>{stdout_log}</string>
    <key>StandardErrorPath</key>
    <string>{stderr_log}</string>
</dict>
</plist>
"#
    )
}

/// Liga o boopaste: carrega o LaunchAgent (persiste entre reboots até `off`).
pub fn turn_on() {
    let plist = plist_path();
    if !plist.exists() {
        eprintln!("boopaste não está instalado — rode `boopaste init` primeiro.");
        std::process::exit(1);
    }
    run_launchctl(&["load", "-w", &plist.to_string_lossy()]);
    println!("boopaste: ligado (persiste entre reinicializações até você desligar)");
    println!(
        "se essa for a primeira vez, deve aparecer um alerta pedindo Monitoramento de Entrada — clique em Permitir. Se não aparecer nada e o Cmd+V não colar o caminho da imagem, rode `boopaste permissions`."
    );
}

/// Desliga o boopaste: descarrega o LaunchAgent (persiste até `on`).
pub fn turn_off() {
    let plist = plist_path();
    run_launchctl(&["unload", "-w", &plist.to_string_lossy()]);
    println!("boopaste: desligado (persiste entre reinicializações até você ligar)");
}

/// Mostra se o LaunchAgent está carregado no momento.
pub fn status() {
    let loaded = Command::new("launchctl")
        .args(["list", LABEL])
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false);

    if loaded {
        println!("boopaste: rodando");
    } else {
        println!("boopaste: parado");
    }
}

/// Instala o binário e o LaunchAgent (não liga automaticamente).
pub fn install() {
    let current_exe = env::current_exe().expect("não foi possível localizar o próprio binário");

    fs::create_dir_all(install_dir()).expect("falha ao criar diretório de instalação");
    install_binary_atomically(&current_exe);

    fs::create_dir_all(logs_dir()).expect("falha ao criar diretório de logs");

    let plist_dir = plist_path()
        .parent()
        .expect("plist path sempre tem diretório pai")
        .to_path_buf();
    fs::create_dir_all(&plist_dir).expect("falha ao criar diretório do LaunchAgent");

    fs::write(plist_path(), plist_contents(&installed_binary_path()))
        .expect("falha ao escrever o plist");

    link_binary_for_cli_use();

    println!("boopaste: instalado (rode `boopaste on` para ligar)");
}

/// Remove o LaunchAgent e os arquivos instalados.
pub fn uninstall() {
    let plist = plist_path();
    if plist.exists() {
        run_launchctl(&["unload", "-w", &plist.to_string_lossy()]);
        let _ = fs::remove_file(&plist);
    }
    unlink_binary_for_cli_use();
    let _ = fs::remove_dir_all(install_dir());
    println!("boopaste: desinstalado");
}

/// Copia o binário pro destino via arquivo temporário + `rename` atômico.
/// Um `fs::copy` direto sobrescreveria o mesmo inode do binário instalado —
/// se uma instância antiga ainda estiver rodando (mapeada em memória a
/// partir desse arquivo), a truncagem no meio da cópia corrompe a
/// assinatura ad-hoc e o kernel mata o processo (`code signature error`).
/// O `rename` troca o inode de uma vez só, sem afetar quem já tem o
/// arquivo antigo aberto.
fn install_binary_atomically(source: &std::path::Path) {
    let dest = installed_binary_path();
    let tmp_dest = install_dir().join("boopaste.tmp");
    fs::copy(source, &tmp_dest).expect("falha ao copiar o binário");
    fs::rename(&tmp_dest, &dest).expect("falha ao mover o binário pro destino final");
    sign_with_stable_identifier(&dest);
}

/// Reassina o binário com um identifier fixo (`com.matheus.boopaste`).
/// Sem isso, cada `cargo build` embute um hash diferente no identifier
/// ad-hoc padrão do rustc — e como o TCC (permissão de Input Monitoring)
/// reconhece o cliente por esse identifier, toda reinstalação de um binário
/// recompilado parece "um app novo" pro macOS, derrubando a permissão já
/// concedida mesmo com o caminho inalterado.
fn sign_with_stable_identifier(binary: &std::path::Path) {
    let status = Command::new("codesign")
        .args(["--sign", "-", "--identifier", LABEL, "--force"])
        .arg(binary)
        .status();
    if !status.map(|s| s.success()).unwrap_or(false) {
        eprintln!("aviso: falha ao assinar o binário com identifier estável — a permissão de Input Monitoring pode precisar ser concedida de novo a cada build");
    }
}

/// Cria/atualiza um symlink em `~/.local/bin/boopaste` apontando pro binário
/// instalado, para que o comando `boopaste` funcione direto no shell — sem
/// isso, `init` deixaria o binário instalado mas inacessível fora do PATH
/// do LaunchAgent.
fn link_binary_for_cli_use() {
    let link = symlink_path();
    let Some(bin_dir) = link.parent() else {
        return;
    };
    if fs::create_dir_all(bin_dir).is_err() {
        return;
    }
    let _ = fs::remove_file(&link);
    if symlink(installed_binary_path(), &link).is_err() {
        eprintln!(
            "aviso: não foi possível criar o symlink em {} — adicione {} ao PATH manualmente",
            link.display(),
            install_dir().display()
        );
    }
}

/// Remove o symlink criado por `link_binary_for_cli_use`, só se ele ainda
/// apontar pro binário instalado (não mexe em algo que o usuário criou).
fn unlink_binary_for_cli_use() {
    let link = symlink_path();
    if fs::read_link(&link).ok() == Some(installed_binary_path()) {
        let _ = fs::remove_file(&link);
    }
}

/// Plano B: `boopaste on` já pede a permissão via alerta nativo
/// (`IOHIDRequestAccess`), mas isso só funciona uma vez — se o usuário
/// clicar em "Não Permitir" o macOS não pergunta de novo, e a única saída
/// vira ir manualmente na tela de Monitoramento de Entrada. Essa função
/// abre essa tela e revela o binário instalado no Finder, já selecionado,
/// pra pelo menos poupar a navegação até
/// `~/Library/Application Support/boopaste/` via Cmd+Shift+G.
pub fn open_permissions_fallback() {
    let _ = Command::new("open")
        .arg("x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent")
        .status();
    let _ = Command::new("open")
        .arg("-R")
        .arg(installed_binary_path())
        .status();
}

fn run_launchctl(args: &[&str]) {
    let status = Command::new("launchctl")
        .args(args)
        .status()
        .expect("falha ao executar launchctl");
    if !status.success() {
        eprintln!("launchctl {} falhou", args.join(" "));
    }
}
