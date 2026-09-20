# boopaste

```
      .-""-.
     /  o o \
    :    ..   :    boopaste
     \  __  /       paste clipboard images as a file path
      `----`
```

Paste clipboard images as a file path, inside [Ghostty](https://ghostty.org)
and macOS's native Terminal.app.

Terminals cannot receive image bytes through paste, only text. So when you
copy a screenshot and hit Cmd+V inside one of the supported terminals,
`boopaste` intercepts the shortcut, saves the image to disk as a PNG, and
swaps the clipboard content for the file's path. The paste then drops a
valid path, which tools like Claude Code interpret as an image. Everywhere
else, Cmd+V is left alone: no interception, no side effects.

## Why this exists

Tools like Claude Code (and other CLI agents) accept images as file paths
in a prompt, but a plain Cmd+V from the system clipboard only ever gives a
terminal raw text. `boopaste` bridges that gap system-wide, without you
having to save the screenshot manually and type the path yourself.

## Requirements

- macOS on Apple Silicon (arm64)
- [Ghostty](https://ghostty.org) or Terminal.app (ships with macOS)
- [Rust](https://www.rust-lang.org) toolchain, only if you're building from
  source (get it via [rustup](https://rustup.rs))

`boopaste` doesn't depend on any other third-party app or CLI tool at
runtime. Everything it needs is either part of macOS or statically linked
into the binary.

## Installation

Pick whichever method you're comfortable with, all three end up in the same
place.

### Homebrew

```bash
brew tap 0kira-vgl/boopaste
brew install boopaste
boopaste init
```

### curl

```bash
curl -fsSL https://boopaste.vercel.app/install.sh | sh
```

Downloads the latest release, extracts it, and runs `boopaste init` for you.

Every release tarball is signed with a
[build provenance attestation](https://github.com/0kira-vgl/boopaste/attestations),
proving it was built by this repo's own CI from a specific commit, not
uploaded by hand. Verify it with:

```bash
gh attestation verify boopaste-*.tar.gz -R 0kira-vgl/boopaste
```

### From source

```bash
git clone https://github.com/0kira-vgl/boopaste.git
cd boopaste
cargo build --release
./target/release/boopaste init
```

`init` packages the binary as a minimal `.app` bundle
(`Boopaste.app`), installs it in
`~/Library/Application Support/boopaste/`, registers a LaunchAgent, and
creates a symlink at `~/.local/bin/boopaste`. After that, the `boopaste`
command works directly from your shell (make sure `~/.local/bin` is in
your `PATH`).

`init` only installs things; it doesn't turn boopaste on. Run
`boopaste on` next to actually start it.

## Commands

| Command | What it does |
|---|---|
| `boopaste init` | Installs the binary and the LaunchAgent. Does not turn it on automatically. |
| `boopaste on` | Turns boopaste on (runs in the background, survives reboots). |
| `boopaste off` | Turns boopaste off. |
| `boopaste status` | Shows whether it's running or stopped. |
| `boopaste permissions` | Opens macOS's Input Monitoring settings screen, in case the automatic permission prompt never showed up. |
| `boopaste uninstall` | Removes everything: LaunchAgent, installed binary, symlink, image cache, and the Accessibility/Input Monitoring permissions granted in TCC. |

## macOS permissions

To intercept Cmd+V globally, macOS requires `boopaste` to have **Input
Monitoring** and **Accessibility** permission (System Settings > Privacy &
Security).

The first time you run `boopaste on`, a native alert should show up asking
for that permission, just click Allow. If the alert doesn't show up (or you
already clicked "Don't Allow" once, in which case macOS won't ask again),
run `boopaste permissions` to open the right settings screen manually.

> Since the binary is signed locally (no paid Apple Developer certificate),
> every time it's rebuilt the granted permission stops being valid and has
> to be granted again. This is a macOS limitation for binaries without a
> Developer ID signature, not something fixable in code.

## How it works

- **`eventtap`**: installs a global `CGEventTap` (via `core-graphics`) that
  listens only for the Cmd+V shortcut, across the whole user session.
- **`frontmost`**: checks whether the focused app is one of the supported
  terminals (Ghostty or Terminal.app, via `NSWorkspace`) before doing
  anything. In any other app, Cmd+V passes straight through, no swap.
- **`clipboard`**: if there's an image in the clipboard, saves it as a PNG
  under `~/Library/Caches/boopaste/`, replaces the clipboard content with
  the file's path, and restores the original image about 400ms later (so
  paste keeps working normally in other apps sharing the same system
  clipboard). Old PNGs are cleaned up automatically as new ones are saved.
- **`launchagent`**: packages the binary into a minimal `.app` bundle,
  handles installing/removing the LaunchAgent (`launchctl load/unload -w`,
  persisting the on/off state across reboots), and cleans up the TCC
  permissions on uninstall.

## Project layout

```
src/
  main.rs         CLI definition (clap) and command dispatch
  daemon.rs       wires the event tap to the clipboard swap logic
  eventtap.rs     global CGEventTap that listens for Cmd+V
  frontmost.rs    checks which app is currently focused
  clipboard.rs    image detection, PNG save, clipboard swap and restore
  launchagent.rs  .app bundling, LaunchAgent, install/uninstall, TCC
```

## Contributing

Issues and pull requests are welcome. If you want to add support for
another terminal, the only two spots that need to know about it are
`SUPPORTED_TERMINAL_BUNDLE_IDS` in `src/frontmost.rs` and the terminal's
name in the CLI help text.

## License

MIT, see [LICENSE](LICENSE).
