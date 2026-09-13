use std::process::Command;

const PLIST_PATH: &str = "~/Library/LaunchAgents/com.matheus.boopaste.plist";

pub fn turn_on() {
    todo!("launchctl load -w no plist")
}

pub fn turn_off() {
    todo!("launchctl unload -w no plist")
}

pub fn status() {
    todo!("checar se o LaunchAgent está carregado")
}

pub fn install() {
    todo!("gerar e escrever o plist em ~/Library/LaunchAgents")
}

pub fn uninstall() {
    todo!("unload -w + remover plist + remover binário instalado")
}
