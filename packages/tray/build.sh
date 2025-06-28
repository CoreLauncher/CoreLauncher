#!/bin/sh

cargo build --release

DLL_PATH=target/release/tray.dll
DEST_DIR=.

if [ -f "$DLL_PATH" ]; then
    cp "$DLL_PATH" "$DEST_DIR"
    echo "Copied tray.dll to $DEST_DIR"
else
    echo "tray.dll not found at $DLL_PATH"
    exit 1
fi