#!/bin/sh
# Installs the latest boopaste release straight from GitHub Releases.
# Usage: curl -fsSL https://boopaste.vercel.app/install.sh | sh
set -eu

REPO="0kira-vgl/boopaste"
INSTALL_DIR="${HOME}/.local/bin"

fail() {
  echo "[x] boopaste: $1" >&2
  exit 1
}

# boopaste only ships an arm64 binary, since it targets Apple Silicon.
os="$(uname -s)"
arch="$(uname -m)"
[ "$os" = "Darwin" ] || fail "unsupported OS '$os' (boopaste is macOS-only)"
[ "$arch" = "arm64" ] || fail "unsupported architecture '$arch' (boopaste requires Apple Silicon)"

command -v curl >/dev/null 2>&1 || fail "curl is required but not installed"
command -v tar >/dev/null 2>&1 || fail "tar is required but not installed"

echo "[*] fetching latest release info..."
latest_tag="$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')"
[ -n "$latest_tag" ] || fail "could not find a published release for ${REPO}"

version="${latest_tag#v}"
asset="boopaste-${version}-aarch64-apple-darwin.tar.gz"
url="https://github.com/${REPO}/releases/download/${latest_tag}/${asset}"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

echo "[*] downloading ${latest_tag}..."
curl -fsSL "$url" -o "${tmp_dir}/${asset}" || fail "failed to download ${url}"

echo "[*] extracting..."
tar -xzf "${tmp_dir}/${asset}" -C "$tmp_dir"

staging_dir="${tmp_dir}/boopaste-${version}-aarch64-apple-darwin"
[ -x "${staging_dir}/boopaste" ] || fail "extracted archive is missing the boopaste binary"

echo "[*] running 'boopaste init'..."
"${staging_dir}/boopaste" init

echo "[✓] boopaste installed. run 'boopaste on' to turn it on."
echo "    make sure ${INSTALL_DIR} is in your PATH."
