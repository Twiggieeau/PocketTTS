#!/usr/bin/env bash
# Provision a minimal x86-64 glibc sysroot so the x86-64 Android build tools
# (aapt2, cmake, NDK clang/lld) can run on this aarch64 workstation under
# qemu-x86_64.
#
# Machine-local only: the repository does not depend on this script.
set -euo pipefail

SYSROOT="${POCKETTTS_X86_SYSROOT:-/opt/x86_64-sysroot}"
MIRROR="${POCKETTTS_DEB_MIRROR:-http://deb.debian.org/debian/pool/main}"

command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 1; }

mkdir -p "$SYSROOT"

export SYSROOT MIRROR
python3 - <<'PY'
import io, os, tarfile, urllib.request

sysroot = os.environ["SYSROOT"]
mirror = os.environ["MIRROR"]

# (pool path, package file) for the libraries the Android host tools need.
PACKAGES = [
    ("g/glibc", "libc6_2.36-9+deb12u14_amd64.deb"),
    ("g/gcc-12", "libgcc-s1_12.2.0-14+deb12u1_amd64.deb"),
    ("g/gcc-12", "libstdc++6_12.2.0-14+deb12u1_amd64.deb"),
    ("z/zlib", "zlib1g_1.2.13.dfsg-1_amd64.deb"),
    ("b/bzip2", "libbz2-1.0_1.0.8-5+b1_amd64.deb"),
    ("libx/libxml2", "libxml2_2.9.14+dfsg-1.3~deb12u6_amd64.deb"),
    ("o/openssl", "libssl3_3.0.17-1~deb12u2_amd64.deb"),
    ("o/openssl", "libcrypto3-udeb_3.0.17-1~deb12u2_amd64.udeb"),
    ("i/icu", "libicu72_72.1-3+deb12u1_amd64.deb"),
    ("x/xz-utils", "liblzma5_5.4.1-1+deb12u1_amd64.deb"),
    ("l/lz4", "liblz4-1_1.9.4-1_amd64.deb"),
    ("n/ncurses", "libtinfo6_6.4-4_amd64.deb"),
]

def get(url):
    with urllib.request.urlopen(url, timeout=300) as response:
        return response.read()

def install(url):
    data = get(url)
    offset = 8
    while offset < len(data):
        header = data[offset:offset + 60]
        if len(header) < 60:
            break
        name = header[0:16].decode().strip().rstrip("/")
        size = int(header[48:58].decode().strip())
        if name.startswith("data.tar"):
            with tarfile.open(fileobj=io.BytesIO(data[offset + 60:offset + 60 + size]), mode="r:*") as archive:
                archive.extractall(sysroot, filter="tar")
            return True
        offset += 60 + size + (size % 2)
    return False

for pool, package in PACKAGES:
    url = f"{mirror}/{pool}/{package}"
    try:
        install(url)
        print(f"  ok   {package}")
    except Exception as error:
        print(f"  FAIL {package}: {error}")
PY

LOADER="$SYSROOT/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2"
if [ -f "$LOADER" ]; then
    echo "x86-64 sysroot ready at $SYSROOT"
else
    echo "sysroot incomplete: $LOADER is missing" >&2
    exit 1
fi
