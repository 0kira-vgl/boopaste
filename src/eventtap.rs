// CGEventTap global para interceptar especificamente o atalho Cmd+V.

use core_foundation::runloop::CFRunLoop;
use core_graphics::event::{
    CGEventFlags, CGEventTap, CGEventTapLocation, CGEventTapOptions, CGEventTapPlacement,
    CGEventTapProxy, CGEventType, CallbackResult, EventField,
};

const KEYCODE_V: i64 = 0x09;

const K_IOHID_REQUEST_TYPE_LISTEN_EVENT: u32 = 1;

#[link(name = "IOKit", kind = "framework")]
unsafe extern "C" {
    /// Dispara o alerta nativo do macOS pedindo Monitoramento de Entrada —
    /// o mesmo tipo de prompt com botão "Permitir" que câmera/microfone
    /// usam. Evita mandar o usuário pro System Settings manualmente: só cai
    /// nisso se o pedido já tiver sido negado antes, caso em que essa
    /// chamada não reabre o alerta (limitação do próprio macOS).
    fn IOHIDRequestAccess(request_type: u32) -> bool;
}

#[link(name = "CoreGraphics", kind = "framework")]
unsafe extern "C" {
    /// O macOS desativa um event tap sozinho se o callback demorar demais
    /// pra responder (ou por pedido explícito do usuário), entregando um
    /// evento `TapDisabledByTimeout`/`TapDisabledByUserInput` no lugar dos
    /// eventos normais — sem isso, o tap fica morto pro resto da execução e
    /// o Cmd+V some silenciosamente depois de um tempo. `proxy` é o mesmo
    /// mach port do tap, só que repassado ao callback com outro tipo
    /// opaco; a função não é exportada publicamente pelo crate `core-graphics`
    /// (só usada internamente ao criar o tap), por isso é redeclarada aqui.
    fn CGEventTapEnable(proxy: CGEventTapProxy, enable: bool);
}

/// Instala um event tap global e bloqueia rodando o run loop da thread atual.
///
/// `on_paste` é chamado de forma síncrona toda vez que Cmd+V é pressionado,
/// antes do evento ser repassado ao app em foco — dando a ele a chance de
/// trocar o conteúdo do clipboard a tempo de o paste já pegar o novo valor.
/// O evento nunca é descartado: só interceptamos o clipboard, não o gesto
/// de paste em si, que deve continuar funcionando normalmente em todo app.
pub fn run(on_paste: impl Fn() + Send + 'static) -> Result<(), ()> {
    unsafe {
        IOHIDRequestAccess(K_IOHID_REQUEST_TYPE_LISTEN_EVENT);
    }

    CGEventTap::with_enabled(
        CGEventTapLocation::Session,
        CGEventTapPlacement::HeadInsertEventTap,
        CGEventTapOptions::Default,
        vec![CGEventType::KeyDown],
        move |proxy, etype, event| {
            match etype {
                CGEventType::TapDisabledByTimeout | CGEventType::TapDisabledByUserInput => {
                    unsafe { CGEventTapEnable(proxy, true) };
                    return CallbackResult::Keep;
                }
                _ => {}
            }
            let keycode = event.get_integer_value_field(EventField::KEYBOARD_EVENT_KEYCODE);
            let is_cmd = event.get_flags().contains(CGEventFlags::CGEventFlagCommand);
            if is_cmd && keycode == KEYCODE_V {
                on_paste();
            }
            CallbackResult::Keep
        },
        CFRunLoop::run_current,
    )
}
