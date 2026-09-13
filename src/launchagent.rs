// Geração, instalação e controle do LaunchAgent que roda `boopaste run` em
// background, sobrevivendo a reboots — mesmo mecanismo do `imgwatch`:
// `launchctl load -w` / `unload -w` (o `-w` grava o estado on/off no plist
// overrides do launchd, então ele persiste entre reinicializações).

use std::env;
use std::fs;
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
    fs::copy(&current_exe, installed_binary_path()).expect("falha ao copiar o binário");

    fs::create_dir_all(logs_dir()).expect("falha ao criar diretório de logs");

    let plist_dir = plist_path()
        .parent()
        .expect("plist path sempre tem diretório pai")
        .to_path_buf();
    fs::create_dir_all(&plist_dir).expect("falha ao criar diretório do LaunchAgent");

    fs::write(plist_path(), plist_contents(&installed_binary_path()))
        .expect("falha ao escrever o plist");

    println!("boopaste: instalado (rode `boopaste on` para ligar)");
}

/// Remove o LaunchAgent e os arquivos instalados.
pub fn uninstall() {
    let plist = plist_path();
    if plist.exists() {
        run_launchctl(&["unload", "-w", &plist.to_string_lossy()]);
        let _ = fs::remove_file(&plist);
    }
    let _ = fs::remove_dir_all(install_dir());
    println!("boopaste: desinstalado");
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
