#!/usr/bin/env bash
# Local build helper for PocketTTS.
# Pins the SDK/NDK/JDK locations provisioned in this environment so a plain
# `./gradlew` invocation works without exporting variables first.
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-/root/android-sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export ANDROID_NDK_HOME="${ANDROID_NDK_HOME:-$ANDROID_HOME/ndk/27.2.12479018}"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk}"
# Host Android build tools (aapt2, aidl, ...) ship as x86-64 only. On this
# aarch64 workstation they run through qemu-x86_64; see
# scripts/setup-aapt2-emulation.sh.
export PATH="/opt/x86_64-wrap:$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

cd "$(dirname "$0")/.."
exec ./gradlew "$@"
