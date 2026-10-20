#!/usr/bin/env python3
"""Run an x86-64 Linux binary under qemu-x86_64 with a chosen argv[0].

The NDK ships lld as a multi-call binary that dispatches on argv[0]
(ld.lld, lld-link, wasm-ld). BusyBox ash has no `exec -a`, so this helper
takes the flavour explicitly and re-executes qemu with the right argv[0].

Usage: x86-launcher.py <argv0> <binary> [args...]
"""
import os
import sys

LOADER = os.environ.get(
    "POCKETTTS_X86_LOADER", "/opt/x86_64-sysroot/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2"
)
LIBPATH = os.environ.get(
    "POCKETTTS_X86_LIBPATH",
    "/opt/x86_64-sysroot/lib/x86_64-linux-gnu:/opt/x86_64-sysroot/usr/lib/x86_64-linux-gnu",
)


def main() -> int:
    if len(sys.argv) < 3:
        sys.stderr.write("usage: x86-launcher.py <argv0> <binary> [args...]\n")
        return 2
    argv0, binary, *rest = sys.argv[1:]
    # qemu-x86_64 replaces the guest program's argv[0] with its own path, so the
    # flavour has to be applied to the qemu process itself.
    os.execvp(
        "qemu-x86_64",
        [
            "qemu-x86_64",
            "-0",
            argv0,
            LOADER,
            "--library-path",
            LIBPATH,
            binary,
            *rest,
        ],
    )
    return 1  # execvp only returns on failure.


if __name__ == "__main__":
    sys.exit(main())
