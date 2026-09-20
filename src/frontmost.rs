// Detecta qual app está em foco (NSWorkspace.frontmostApplication)
// para restringir o comportamento aos terminais suportados.

use objc2_app_kit::NSWorkspace;

const SUPPORTED_TERMINAL_BUNDLE_IDS: &[&str] = &[
    "com.mitchellh.ghostty",
    "com.apple.Terminal",
];

/// Retorna true se o app em foco no momento for um dos terminais suportados.
pub fn is_supported_terminal_frontmost() -> bool {
    let workspace = NSWorkspace::sharedWorkspace();
    let Some(app) = workspace.frontmostApplication() else {
        return false;
    };
    let Some(bundle_id) = app.bundleIdentifier() else {
        return false;
    };
    let bundle_id = bundle_id.to_string();
    SUPPORTED_TERMINAL_BUNDLE_IDS.contains(&bundle_id.as_str())
}
