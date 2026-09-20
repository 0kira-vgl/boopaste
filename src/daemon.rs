// Loop principal: instala o event tap e reage ao Cmd+V só quando um terminal
// suportado está em foco, delegando o swap-and-restore do clipboard pro
// módulo `clipboard`.

use crate::{clipboard, eventtap, frontmost};

pub fn run() {
    eventtap::run(|| {
        if frontmost::is_supported_terminal_frontmost() {
            clipboard::swap_image_for_path();
        }
    })
    .expect("falha ao instalar o event tap (verifique a permissão de Input Monitoring/Accessibility)");
}
