#!/usr/bin/env bash
# Make the x86-64 Android build tools (aapt2, and other host binaries)
# runnable on this aarch64 workstation.
#
# The Android Gradle Plugin ships host tools for x86-64 only. This wraps the
# binaries with qemu-x86_64 and an x86-64 glibc sysroot so `gradlew` can build
# unmodified. Nothing in the repository depends on this script: it only
# affects this machine's local toolchain.
set -euo pipefail

SYSROOT="${POCKETTTS_X86_SYSROOT:-/opt/x86_64-sysroot}"
LOADER="$SYSROOT/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2"
LIBPATH="$SYSROOT/lib/x86_64-linux-gnu:$SYSROOT/usr/lib/x86_64-linux-gnu"
WRAP_DIR="${POCKETTTS_WRAP_DIR:-/opt/x86_64-wrap}"

command -v qemu-x86_64 >/dev/null || { echo "qemu-x86_64 is required (apk add qemu-x86_64)" >&2; exit 1; }
[ -f "$LOADER" ] || { echo "x86-64 sysroot missing at $SYSROOT" >&2; exit 1; }

mkdir -p "$WRAP_DIR"

wrap() {
    local bin="$1" name
    name="$(basename "$bin")"
    if [ ! -x "$bin" ]; then return; fi
    # Only wrap x86-64 ELF binaries; native ones run directly.
    if ! head -c 20 "$bin" | grep -q "ELF" || ! readelf -h "$bin" 2>/dev/null | grep -q "X86-64"; then
        return
    fi
    local target="$WRAP_DIR/$name"
    cat > "$target" <<EOF
#!/bin/sh
exec qemu-x86_64 "$LOADER" --library-path "$LIBPATH" "$bin" "\$@"
EOF
    chmod +x "$target"
    echo "  wrapped $name"
}

# The SDK ships cmake/ninja as x86-64 too. Wrap those explicitly, because
# AGP resolves them by absolute path rather than through PATH.
wrap_named() {
    local bin="$1"
    [ -f "$bin" ] && wrap "$bin"
}

echo "Wrapping x86-64 build tools into $WRAP_DIR"
for dir in "$@"; do
    [ -d "$dir" ] || continue
    for bin in "$dir"/*; do
        [ -f "$bin" ] && wrap "$bin"
    done
done

SDK_CMAKE="${ANDROID_HOME:-/root/android-sdk}/cmake/3.22.1/bin"
for name in cmake ninja cpack ctest; do
    wrap_named "$SDK_CMAKE/$name"
done
# Keep the real binary next to the wrapper so relative lookups still work.
echo "Done. Prepend $WRAP_DIR to PATH before invoking gradlew."
