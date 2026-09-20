mod daemon;
mod clipboard;
mod frontmost;
mod eventtap;
mod launchagent;

use clap::{Parser, Subcommand};

const BANNER: &str = r#"
      .-""-.
     /  o o \
    :    ..   :    boopaste
     \  __  /       paste clipboard images as a file path,
      `----`        in Ghostty and Terminal.app
"#;

#[derive(Parser)]
#[command(
    name = "boopaste",
    version,
    about = "Paste clipboard images as a file path, in Ghostty and Terminal.app",
    long_about = BANNER
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Turn boopaste on (runs in the background, survives reboots)
    On,
    /// Turn boopaste off
    Off,
    /// Show the current status (running / stopped)
    Status,
    /// Install the LaunchAgent (does not turn it on automatically)
    Init,
    /// Open the Input Monitoring settings screen, in case the system prompt never showed up
    Permissions,
    /// Remove the LaunchAgent and every file boopaste installed
    Uninstall,
    /// Run the daemon in the foreground (internal use by the LaunchAgent)
    #[command(hide = true)]
    Run,
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::On => launchagent::turn_on(),
        Commands::Off => launchagent::turn_off(),
        Commands::Status => launchagent::status(),
        Commands::Init => launchagent::install(),
        Commands::Permissions => launchagent::open_permissions_fallback(),
        Commands::Uninstall => launchagent::uninstall(),
        Commands::Run => daemon::run(),
    }
}
