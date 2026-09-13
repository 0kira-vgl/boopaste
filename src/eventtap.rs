// CGEventTap global para interceptar especificamente o atalho Cmd+V.

use core_foundation::runloop::CFRunLoop;
use core_graphics::event::{
    CGEventFlags, CGEventTap, CGEventTapLocation, CGEventTapOptions, CGEventTapPlacement,
    CGEventType, CallbackResult, EventField,
};

const KEYCODE_V: i64 = 0x09;

/// Instala um event tap global e bloqueia rodando o run loop da thread atual.
///
/// `on_paste` é chamado toda vez que Cmd+V é pressionado em qualquer app.
/// Se retornar `true`, o evento é descartado (não chega ao app em foco) —
/// usado quando o `daemon` já substituiu o clipboard e quer deixar o próprio
/// app tratar o paste em seguida; se retornar `false`, o evento segue normal.
pub fn run(on_paste: impl Fn() -> bool + Send + 'static) -> Result<(), ()> {
    CGEventTap::with_enabled(
        CGEventTapLocation::Session,
        CGEventTapPlacement::HeadInsertEventTap,
        CGEventTapOptions::Default,
        vec![CGEventType::KeyDown],
        move |_proxy, _etype, event| {
            let keycode = event.get_integer_value_field(EventField::KEYBOARD_EVENT_KEYCODE);
            let is_cmd = event.get_flags().contains(CGEventFlags::CGEventFlagCommand);
            if is_cmd && keycode == KEYCODE_V && on_paste() {
                CallbackResult::Drop
            } else {
                CallbackResult::Keep
            }
        },
        CFRunLoop::run_current,
    )
}
