#!/bin/bash

DEST=~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io

echo "Copying files..."
cp -r ~/raven-sidebar/* "$DEST"/

echo "Compiling schemas..."
glib-compile-schemas "$DEST/schemas/"

echo "Restarting extension..."
gnome-extensions disable raven-sidebar@dalpat.github.io
gnome-extensions enable  raven-sidebar@dalpat.github.io

echo "Done. Hotkey: Super+\\ (change via gsettings — see schemas/README below)"
