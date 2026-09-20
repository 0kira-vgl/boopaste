// Swap-and-restore do clipboard: quando há uma imagem, salva como PNG em
// disco e substitui o clipboard pelo caminho do arquivo — depois restaura a
// imagem original, para não quebrar o paste normal em outros apps que
// compartilham o mesmo clipboard do sistema.

use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use arboard::{Clipboard, ImageData};
use image::RgbaImage;

/// Dá tempo do terminal ler o path do clipboard antes de restaurarmos a
/// imagem original. É uma margem fixa, não um sinal real de "já leu" (a API
/// de clipboard não expõe isso) — 400ms cobre folgadamente o caso comum, mas
/// em máquinas muito lentas ainda é teoricamente possível a restauração
/// acontecer antes do paste. Preferível a um valor menor, que falhava com
/// mais frequência em terminais sob carga.
const RESTORE_DELAY: Duration = Duration::from_millis(400);

/// PNGs mais velhos que isso são apagados na próxima vez que uma imagem é
/// colada — sem isso, o diretório cresce sem limite enquanto o daemon roda.
const MAX_FILE_AGE: Duration = Duration::from_secs(10 * 60);

/// Contador incremental somado ao timestamp no nome do arquivo, pra garantir
/// unicidade mesmo em dois pastes disparados dentro da mesma janela de
/// tempo (o `SystemTime` sozinho não tem granularidade suficiente pra
/// excluir colisão).
static FILE_COUNTER: AtomicU64 = AtomicU64::new(0);

/// Diretório de destino dos PNGs, exclusivo do usuário atual — ao contrário
/// de `/tmp`, `~/Library/Caches` não é compartilhado entre usuários da
/// máquina, e ainda assim é criado com permissão 0700 (veja
/// `restrict_to_owner`) pra reforçar isso. Evita que outro usuário local
/// consiga listar ou ler imagens potencialmente sensíveis já coladas.
fn dest_dir() -> Option<PathBuf> {
    let home = std::env::var("HOME").ok()?;
    Some(PathBuf::from(home).join("Library/Caches/boopaste"))
}

/// Se o clipboard contém uma imagem, salva em disco como PNG, substitui o
/// clipboard pelo caminho do arquivo e agenda a restauração da imagem
/// original logo em seguida. Retorna `None` se não havia imagem no clipboard.
pub fn swap_image_for_path() -> Option<PathBuf> {
    let mut clipboard = Clipboard::new().ok()?;
    let image = clipboard.get_image().ok()?;

    let path = save_png(&image)?;
    clipboard.set_text(path.to_string_lossy().into_owned()).ok()?;

    let original = image.to_owned_img();
    thread::spawn(move || {
        thread::sleep(RESTORE_DELAY);
        if let Ok(mut clipboard) = Clipboard::new() {
            let _ = clipboard.set_image(original);
        }
    });

    Some(path)
}

fn save_png(image: &ImageData) -> Option<PathBuf> {
    let dir = dest_dir()?;
    fs::create_dir_all(&dir).ok()?;
    restrict_to_owner(&dir);

    cleanup_old_files(&dir);

    let width = image.width as u32;
    let height = image.height as u32;
    let buffer = RgbaImage::from_raw(width, height, image.bytes.clone().into_owned())?;

    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).ok()?.as_millis();
    let counter = FILE_COUNTER.fetch_add(1, Ordering::Relaxed);
    let path = dir.join(format!("clip_{timestamp}_{counter}.png"));

    buffer.save(&path).ok()?;
    restrict_to_owner(&path);
    Some(path)
}

/// Restringe o acesso ao dono do arquivo (0600) ou diretório (0700) — evita
/// que outros usuários locais da máquina leiam imagens coladas via boopaste,
/// que podem conter informação sensível (prints de tela, dados privados).
fn restrict_to_owner(path: &Path) {
    let mode = if path.is_dir() { 0o700 } else { 0o600 };
    let _ = fs::set_permissions(path, fs::Permissions::from_mode(mode));
}

/// Apaga PNGs com mais de `MAX_FILE_AGE`. Chamado a cada paste, então o
/// diretório nunca acumula mais que uma janela de tempo limitada de arquivos,
/// mesmo que o daemon fique rodando por dias.
fn cleanup_old_files(dir: &Path) {
    let Ok(entries) = fs::read_dir(dir) else {
        return;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("png") {
            continue;
        }
        let Ok(metadata) = entry.metadata() else {
            continue;
        };
        let Ok(modified) = metadata.modified() else {
            continue;
        };
        if modified.elapsed().unwrap_or_default() > MAX_FILE_AGE {
            let _ = fs::remove_file(&path);
        }
    }
}
