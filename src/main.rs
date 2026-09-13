mod daemon;
mod clipboard;
mod frontmost;
mod eventtap;
mod launchagent;

use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "boopaste", version, about = "Cola imagens do clipboard como caminho de arquivo, só no Ghostty")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Liga o boopaste (roda em background, sobrevive a reboot)
    On,
    /// Desliga o boopaste
    Off,
    /// Mostra o status atual (ligado/desligado)
    Status,
    /// Instala o LaunchAgent (não liga automaticamente)
    Init,
    /// Remove o LaunchAgent e todos os arquivos instalados
    Uninstall,
    /// Roda o daemon em primeiro plano (uso interno do LaunchAgent)
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
        Commands::Uninstall => launchagent::uninstall(),
        Commands::Run => daemon::run(),
    }
}
