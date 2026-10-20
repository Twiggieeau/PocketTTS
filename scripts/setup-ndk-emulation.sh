#!/usr/bin/env bash
# Run the x86-64 Android NDK toolchain on this aarch64 workstation via qemu.
#
# Google publishes the NDK for x86-64 Linux hosts only. This script installs a
# thin wrapper around every tool the Android build needs, so the NDK works
# unchanged. Pristine binaries are kept alongside as <tool>.bin.
#
# lld is a multi-call binary that dispatches on argv[0]. The guest's argv[0] is
# the path handed to the loader, so each flavour keeps its own copy of the
# binary at a path whose basename is that flavour.
#
# Machine-local only: the repository does not depend on this script.
set -euo pipefail

SYSROOT="${POCKETTTS_X86_SYSROOT:-/opt/x86_64-sysroot}"
LOADER="$SYSROOT/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2"
LIBPATH="$SYSROOT/lib/x86_64-linux-gnu:$SYSROOT/usr/lib/x86_64-linux-gnu"
NDK="${ANDROID_NDK_HOME:-/root/android-sdk/ndk/27.2.12479018}"
BIN="$NDK/toolchains/llvm/prebuilt/linux-x86_64/bin"

command -v qemu-x86_64 >/dev/null || { echo "qemu-x86_64 is required (apk add qemu-x86_64)" >&2; exit 1; }
[ -f "$LOADER" ] || { echo "x86-64 sysroot missing at $SYSROOT" >&2; exit 1; }
[ -d "$BIN" ] || { echo "NDK toolchain missing at $BIN" >&2; exit 1; }

is_elf() { head -c 4 "$1" 2>/dev/null | grep -q "ELF"; }

cd "$BIN"

# Keep a pristine copy of every real tool, then replace it with a wrapper.
count=0
for f in *; do
    [ -f "$f" ] || continue
    is_elf "$f" || continue
    [ -f "$f.bin" ] || cp "$f" "$f.bin"
    tmp="$(mktemp)"
    cat > "$tmp" <<EOF
#!/bin/sh
exec qemu-x86_64 "$LOADER" --library-path "$LIBPATH" "$BIN/$f.bin" "\$@"
EOF
    chmod +x "$tmp"
    mv "$tmp" "$f"
    count=$((count + 1))
done

# lld dispatches on argv[0]; give each flavour its own binary copy.
if [ -f "$BIN/lld.bin" ]; then
    for flavour in ld.lld lld-link wasm-ld; do
        cp "$BIN/lld.bin" "$BIN/$flavour.bin"
        cat > "$BIN/$flavour" <<EOF
#!/bin/sh
exec qemu-x86_64 "$LOADER" --library-path "$LIBPATH" "$BIN/$flavour.bin" "\$@"
EOF
        chmod +x "$BIN/$flavour"
    done
fi

echo "Wrapped $count NDK tools under qemu-x86_64."
echo -n "clang:   "; "$BIN/clang" --version 2>&1 | head -1
echo -n "ld.lld:  "; "$BIN/ld.lld" --version 2>&1 | head -1
