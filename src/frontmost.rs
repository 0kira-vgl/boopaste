// Detecta qual app está em foco (NSWorkspace.frontmostApplication)
// para restringir o comportamento ao Ghostty.

use objc2_app_kit::NSWorkspace;

const GHOSTTY_BUNDLE_ID: &str = "com.mitchellh.ghostty";

/// Retorna true se o app em foco no momento for o Ghostty.
pub fn is_ghostty_frontmost() -> bool {
    let workspace = NSWorkspace::sharedWorkspace();
    let Some(app) = workspace.frontmostApplication() else {
        return false;
    };
    let Some(bundle_id) = app.bundleIdentifier() else {
        return false;
    };
    bundle_id.to_string() == GHOSTTY_BUNDLE_ID
}
