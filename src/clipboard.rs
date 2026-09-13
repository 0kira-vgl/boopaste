// Swap-and-restore do clipboard: quando há uma imagem, salva como PNG em
// disco e substitui o clipboard pelo caminho do arquivo — depois restaura a
// imagem original, para não quebrar o paste normal em outros apps que
// compartilham o mesmo clipboard do sistema.

use std::path::PathBuf;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use arboard::{Clipboard, ImageData};
use image::RgbaImage;

const DEST_DIR: &str = "/tmp/boopaste";
const RESTORE_DELAY: Duration = Duration::from_millis(200);

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
    std::fs::create_dir_all(DEST_DIR).ok()?;

    let width = image.width as u32;
    let height = image.height as u32;
    let buffer = RgbaImage::from_raw(width, height, image.bytes.clone().into_owned())?;

    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).ok()?.as_millis();
    let path = PathBuf::from(DEST_DIR).join(format!("clip_{timestamp}.png"));

    buffer.save(&path).ok()?;
    Some(path)
}
