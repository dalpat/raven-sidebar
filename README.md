# Raven Sidebar

A GNOME Shell extension that provides a unified right-side sidebar with calendar, clock, volume/microphone controls, and notifications.

![Raven Sidebar](https://placehold.co/400x300/1a1a2e/eee?text=Raven+Sidebar)

## Features

- **Clock & Calendar** - Displays current date, time, and an interactive monthly calendar
- **Volume Control** - Quick access to system audio output volume
- **Microphone Control** - Quick access to microphone input volume
- **Notifications** - View and manage system notifications
- **Keyboard Shortcut** - Toggle sidebar with `Super + V`
- **Theme Aware** - Follows your system dark/light theme preference

## Requirements

- GNOME Shell 45+
- GJS (GNOME JavaScript)
- Gvc (GNOME Volume Control library)

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/dalpat/raven-sidebar.git
cd raven-sidebar

# Run the install script
./install.sh
```

Or manually copy files:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io/
cp extension.js components/*.js stylesheet.css metadata.json schemas/*.xml ~/.local/share/gnome-shell/extensions/raven-sidebar@dalpat.github.io/
```

### Enable the Extension

1. Open **Extensions** app (or press `Alt+F2` and type `extensions`)
2. Find "Raven Sidebar" and enable it
3. Log out and log back in (required on Wayland)

## Usage

- Click the notification icon in the top-right panel to toggle the sidebar
- Press `Super + V` to toggle the sidebar via keyboard
- Switch between **Widgets** and **Notifications** tabs using the tab bar

## Configuration

You can configure the keyboard shortcut in GNOME Settings:

1. Open **Settings** → **Keyboard** → **View and Custom Shortcuts**
2. Find "Toggle Raven Sidebar" under "Custom Shortcuts"
3. Click to modify the binding

## Building from Source

This extension is built from source with:

- ES Modules (GNOME 45+)
- GObject Introspection (GJS)
- CSS for styling

No build step required - files are used directly.

## Troubleshooting

### Changes not taking effect

On Wayland, code changes require a full logout/login cycle. CSS-only changes may reload without logout using:

```bash
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell \
  --method org.gnome.Shell.Eval 'Main.loadTheme()'
```

### Extension not appearing

Check the journal for errors:
```bash
journalctl -f -u gnome-shell
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting PRs.

---

Made with ❤️ for GNOME