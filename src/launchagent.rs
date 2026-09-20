// Geração, instalação e controle do LaunchAgent que roda `boopaste run` em
// background, sobrevivendo a reboots - mesmo mecanismo do `imgwatch`:
// `launchctl load -w` / `unload -w` (o `-w` grava o estado on/off no plist
// overrides do launchd, então ele persiste entre reinicializações).

use std::env;
use std::fs;
use std::os::unix::fs::symlink;
use std::path::PathBuf;
use std::process::Command;

const LABEL: &str = "com.matheus.boopaste";

const LSREGISTER: &str = "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister";

const TCC_SERVICES: &[&str] = &["ListenEvent", "Accessibility", "PostEvent"];

/// Ícone do app (o fantasminha verde usado na landing page), embutido no
/// binário em tempo de compilação - assim o `.app` sai com ícone próprio
/// nas telas de permissão do macOS (Acessibilidade, Monitoramento de
/// Entrada), em vez do ícone genérico de executável.
const APP_ICON: &[u8] = include_bytes!("../assets/AppIcon.icns");

/// Imprime uma mensagem de erro amigável e encerra o processo com código 1 -
/// usado no lugar de `.expect()` em operações que podem falhar por motivos
/// legítimos de ambiente (disco cheio, permissão negada, HOME ausente), pra
/// não expor um panic com stack trace bruto pro usuário final.
fn fail(msg: impl std::fmt::Display) -> ! {
    eprintln!("[x] boopaste: {msg}");
    std::process::exit(1);
}

fn home_dir() -> PathBuf {
    let home = env::var("HOME").unwrap_or_else(|_| fail("HOME environment variable is not set"));
    PathBuf::from(home)
}

fn plist_path() -> PathBuf {
    home_dir()
        .join("Library/LaunchAgents")
        .join(format!("{LABEL}.plist"))
}

fn install_dir() -> PathBuf {
    home_dir().join("Library/Application Support/boopaste")
}

/// O binário fica dentro de um `.app` mínimo (não só um executável solto)
/// para que o macOS o registre no Launch Services com um `CFBundleIdentifier`
/// de verdade. Sem isso, `tccutil reset` (usado no `uninstall` pra apagar as
/// permissões de Acessibilidade/Monitoramento de Entrada) não consegue achar
/// o app - ele só aceita bundle identifiers registrados, não caminhos soltos.
fn bundle_path() -> PathBuf {
    install_dir().join("Boopaste.app")
}

fn bundle_macos_dir() -> PathBuf {
    bundle_path().join("Contents/MacOS")
}

fn installed_binary_path() -> PathBuf {
    bundle_macos_dir().join("boopaste")
}

fn logs_dir() -> PathBuf {
    home_dir().join("Library/Logs")
}

fn symlink_path() -> PathBuf {
    home_dir().join(".local/bin/boopaste")
}

fn info_plist_contents() -> String {
    format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>{LABEL}</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleExecutable</key>
    <string>boopaste</string>
    <key>CFBundleName</key>
    <string>boopaste</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSUIElement</key>
    <true/>
    <key>LSBackgroundOnly</key>
    <true/>
</dict>
</plist>
"#
    )
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
        eprintln!("[x] boopaste is not installed. Run `boopaste init` first.");
        std::process::exit(1);
    }
    run_launchctl(&["load", "-w", &plist.to_string_lossy()]);
    println!("[on]  boopaste is now ON  (stays on across reboots until you turn it off)");
    println!(
        "      first time around? macOS should prompt for Input Monitoring -> click Allow.\n      nothing happened and Cmd+V won't paste the image path? run `boopaste permissions`."
    );
}

/// Desliga o boopaste: descarrega o LaunchAgent (persiste até `on`).
pub fn turn_off() {
    let plist = plist_path();
    run_launchctl(&["unload", "-w", &plist.to_string_lossy()]);
    println!("[off] boopaste is now OFF (stays off across reboots until you turn it on)");
}

/// Mostra se o LaunchAgent está carregado no momento.
pub fn status() {
    let loaded = Command::new("launchctl")
        .args(["list", LABEL])
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false);

    if loaded {
        println!("[*] boopaste is running");
    } else {
        println!("[ ] boopaste is stopped");
    }
}

/// Banner impresso ao final de `install()` - o fantasminha da landing page
/// em ASCII, pra marcar visualmente o primeiro passo bem-sucedido.
const INSTALL_BANNER: &str = r#"
      .-""-.
     /  o o \
    :    ..   :    boopaste installed
     \  __  /       run `boopaste on` to start
      `----`
"#;

/// Instala o binário (dentro de um `.app` mínimo) e o LaunchAgent (não liga
/// automaticamente).
pub fn install() {
    let current_exe =
        env::current_exe().unwrap_or_else(|e| fail(format!("couldn't locate the running binary: {e}")));

    fs::create_dir_all(bundle_macos_dir()).unwrap_or_else(|e| fail(format!("failed to create the app bundle: {e}")));
    fs::write(bundle_path().join("Contents/Info.plist"), info_plist_contents())
        .unwrap_or_else(|e| fail(format!("failed to write Info.plist: {e}")));
    install_icon();
    install_binary_atomically(&current_exe);
    register_with_launch_services();

    fs::create_dir_all(logs_dir()).unwrap_or_else(|e| fail(format!("failed to create the logs directory: {e}")));

    // Invariante do próprio path construído acima (sempre tem um diretório
    // pai), não uma falha de I/O - um panic aqui indicaria um bug real.
    let plist_dir = plist_path()
        .parent()
        .expect("plist path always has a parent directory")
        .to_path_buf();
    fs::create_dir_all(&plist_dir)
        .unwrap_or_else(|e| fail(format!("failed to create the LaunchAgent directory: {e}")));

    fs::write(plist_path(), plist_contents(&installed_binary_path()))
        .unwrap_or_else(|e| fail(format!("failed to write the plist: {e}")));

    link_binary_for_cli_use();

    println!("{INSTALL_BANNER}");
}

/// Remove o LaunchAgent, as permissões concedidas no TCC e todos os arquivos
/// instalados - não deixa vestígio nenhum pra trás.
pub fn uninstall() {
    let plist = plist_path();
    if plist.exists() {
        run_launchctl(&["unload", "-w", &plist.to_string_lossy()]);
        let _ = fs::remove_file(&plist);
    }

    reset_tcc_permissions();
    unregister_from_launch_services();
    unlink_binary_for_cli_use();
    let _ = fs::remove_dir_all(install_dir());
    let _ = fs::remove_dir_all(home_dir().join("Library/Caches/boopaste"));

    println!(
        "[x] boopaste uninstalled -> LaunchAgent, binary, image cache, and Accessibility/Input Monitoring permissions all removed"
    );
}

/// Copia o binário pro destino via arquivo temporário + `rename` atômico.
/// Um `fs::copy` direto sobrescreveria o mesmo inode do binário instalado -
/// se uma instância antiga ainda estiver rodando (mapeada em memória a
/// partir desse arquivo), a truncagem no meio da cópia corrompe a
/// assinatura ad-hoc e o kernel mata o processo (`code signature error`).
/// O `rename` troca o inode de uma vez só, sem afetar quem já tem o
/// arquivo antigo aberto.
fn install_icon() {
    let resources_dir = bundle_path().join("Contents/Resources");
    fs::create_dir_all(&resources_dir)
        .unwrap_or_else(|e| fail(format!("failed to create Contents/Resources: {e}")));
    fs::write(resources_dir.join("AppIcon.icns"), APP_ICON)
        .unwrap_or_else(|e| fail(format!("failed to write the icon: {e}")));
}

fn install_binary_atomically(source: &std::path::Path) {
    let dest = installed_binary_path();
    let tmp_dest = bundle_macos_dir().join("boopaste.tmp");
    fs::copy(source, &tmp_dest).unwrap_or_else(|e| fail(format!("failed to copy the binary: {e}")));
    fs::rename(&tmp_dest, &dest)
        .unwrap_or_else(|e| fail(format!("failed to move the binary to its final destination: {e}")));
    sign_bundle();
}

/// Assina o `.app` inteiro (não só o executável) com identifier fixo
/// (`com.matheus.boopaste`), igual ao `CFBundleIdentifier` do Info.plist -
/// é o que faz o TCC reconhecer o app de forma consistente entre reinstalações.
/// Importante: como a assinatura é ad-hoc (sem certificado pago da Apple), o
/// hash embutido muda a cada recompilação do binário - então, mesmo com
/// identifier fixo, o macOS ainda vai pedir a permissão de novo depois de
/// qualquer rebuild. Isso é uma limitação de binários não assinados por um
/// Developer ID, não algo resolvível só em software.
fn sign_bundle() {
    let status = Command::new("codesign")
        .args(["--sign", "-", "--identifier", LABEL, "--force"])
        .arg(bundle_path())
        .status();
    if !status.map(|s| s.success()).unwrap_or(false) {
        eprintln!(
            "[!] warning: failed to sign the app with a stable identifier -> Input Monitoring permission may need to be granted again on every build"
        );
    }
}

/// Registra o `.app` no Launch Services. Sem isso, o bundle pode não
/// aparecer pro `tccutil` (que só reconhece bundle identifiers registrados),
/// já que instalar em `~/Library/Application Support` não é um local
/// indexado automaticamente como `/Applications`.
fn register_with_launch_services() {
    let _ = Command::new(LSREGISTER)
        .args(["-f"])
        .arg(bundle_path())
        .status();
}

/// Desfaz o registro no Launch Services no uninstall, pra não deixar uma
/// entrada órfã apontando pra um bundle que não existe mais.
fn unregister_from_launch_services() {
    let _ = Command::new(LSREGISTER)
        .args(["-u"])
        .arg(bundle_path())
        .status();
}

/// Apaga do TCC as decisões de permissão (Acessibilidade, Monitoramento de
/// Entrada, Postar Eventos) dadas ao boopaste, usando o `tccutil` oficial da
/// Apple - só funciona porque agora o boopaste tem um bundle identifier
/// registrado (veja `register_with_launch_services`); em um binário solto
/// não empacotado, `tccutil` não consegue mirar só nele (só reseta pra todo
/// mundo de uma vez, ou falha).
fn reset_tcc_permissions() {
    for service in TCC_SERVICES {
        let _ = Command::new("tccutil")
            .args(["reset", service, LABEL])
            .status();
    }
}

/// Cria/atualiza um symlink em `~/.local/bin/boopaste` apontando pro binário
/// instalado, para que o comando `boopaste` funcione direto no shell - sem
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
            "[!] warning: couldn't create the symlink at {} -> add {} to your PATH manually",
            link.display(),
            bundle_macos_dir().display()
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
/// (`IOHIDRequestAccess`), mas isso só funciona uma vez - se o usuário
/// clicar em "Não Permitir" o macOS não pergunta de novo, e a única saída
/// vira ir manualmente na tela de Monitoramento de Entrada. Essa função
/// abre essa tela e revela o app instalado no Finder, já selecionado.
pub fn open_permissions_fallback() {
    let _ = Command::new("open")
        .arg("x-apple.systempreferences:com.apple.preference.security?Privacy_ListenEvent")
        .status();
    let _ = Command::new("open")
        .arg("-R")
        .arg(bundle_path())
        .status();
}

fn run_launchctl(args: &[&str]) {
    let status = Command::new("launchctl")
        .args(args)
        .status()
        .unwrap_or_else(|e| fail(format!("failed to run launchctl: {e}")));
    if !status.success() {
        eprintln!("[!] launchctl {} failed", args.join(" "));
    }
}
