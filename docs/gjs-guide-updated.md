### GNOME 40 Extension Preferences (GTK4, JS)

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Scaffolding for GNOME extension preferences using GTK4 for GNOME 40. Includes `init` for setup and `buildPrefsWidget` for UI creation. This example focuses on basic initialization and returning a GTK widget.

```js
const {Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/**
 * Like `extension.js`, this is used for any one-time setup like translations.
 *
 * @param {object} metadata - The metadata.json file, parsed as JSON
 */
function init(metadata) {
    console.debug(`initializing ${metadata.name} Preferences`);

    ExtensionUtils.initTranslations();
}

/**
 * This function is called when the preferences window is first created to build
 * and return a GTK4 widget.
 *
 * @returns {Gtk.Widget} the preferences widget
 */
function buildPrefsWidget() {
    return new Gtk.Label({
        label: Me.metadata.name,
    });
}

```

--------------------------------

### GNOME 3.x Extension Preferences (GTK3, JS)

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Scaffolding for GNOME extension preferences using GTK3 for GNOME 3.x. Includes `init` for setup and `buildPrefsWidget` for UI creation. This example demonstrates basic initialization and returning a GTK widget.

```js
const {Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/**
 * Like `extension.js`, this is used for any one-time setup like translations.
 *
 * @param {object} metadata - The metadata.json file, parsed as JSON
 */
function init(metadata) {
    log(`initializing ${metadata.name} Preferences`);

    ExtensionUtils.initTranslations();
}

/**
 * This function is called when the preferences window is first created to build
 * and return a GTK3 widget.
 *
 * @returns {Gtk.Widget} the preferences widget
 */
function buildPrefsWidget() {
    return new Gtk.Label({
        label: Me.metadata.name,
        visible: true,
    });
}

```

--------------------------------

### Extension Installation Directory Example

Source: https://gjs.guide/extensions/overview/anatomy

Illustrates the required directory structure for installing an extension's files, which must match the extension's UUID.

```sh
~/.local/share/gnome-shell/extensions/example@gjs.guide/
```

--------------------------------

### Run GJS Tutorial Script

Source: https://gjs.guide/guides/gtk/3/03-installing

This command executes a JavaScript file using the GJS interpreter. Ensure your code is saved in a file (e.g., `file.js`) and then run it from the terminal. The program's output will be displayed directly in the terminal.

```bash
gjs file.js
```

--------------------------------

### GJS Complete GNOME Shell Extension Example

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

A working example of a GNOME Shell extension for GNOME 44 or earlier. It creates a panel button with an icon and adds a preferences action.

```js
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const {
    gettext: _,
} = ExtensionUtils;

class Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, Me.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(Me.metadata.uuid, this._indicator);

        // Add a menu item to open the preferences window
        this._indicator.menu.addAction(_('Preferences'),
            () => ExtensionUtils.openPrefs());

        this._count = 0;
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}

function init() {
    ExtensionUtils.initTranslations();

    return new Extension();
}
```

--------------------------------

### GJS: Defining Basic Classes

Source: https://gjs.guide/guides/gjs/style-guide

Provides examples of defining classes in GJS using the 'class' keyword. It shows how to define a simple class and how to override the constructor when subclassing GObject classes.

```javascript
class MyObject {
    frobnicate() {
    }
}

const MySubclass = GObject.registerClass(
class MySubclass extends GObject.Object {
    constructor(params = {}) {
        /* Chain-up with an object of construct properties */
        super(params);
    }

    frobnicate() {
    }
});
```

--------------------------------

### Verify GJS Version using CLI

Source: https://gjs.guide/guides/gtk/3/03-installing

This command checks the installed version of the GJS (Gnome JavaScript) interpreter on your system. It's crucial for ensuring compatibility with newer features, as older versions might not support advanced topics. The output is the version number, e.g., '1.48.x'.

```bash
gjs --version
```

--------------------------------

### GNOME 42+ Extension Preferences (GTK4, JS)

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Scaffolding for GNOME extension preferences using Adwaita and GTK4 for GNOME 42 to 44. Includes `init` for setup and `buildPrefsWidget` or `fillPreferencesWindow` for UI creation. Demonstrates adding preference pages, groups, and rows with switches.

```js
const {Adw, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/**
 * Like `extension.js` this is used for any one-time setup like translations.
 *
 * @param {object} metadata - The metadata.json file, parsed as JSON
 */
function init(metadata) {
    console.debug(`initializing ${metadata.name} Preferences`);
}

/**
 * This function is called when the preferences window is first created to build
 * and return a GTK4 widget.
 *
 * The preferences window will be a `Adw.PreferencesWindow`, and the widget
 * returned by this function will be added to an `Adw.PreferencesPage` or
 * `Adw.PreferencesGroup` if necessary.
 *
 * @returns {Gtk.Widget} the preferences widget
 */
function buildPrefsWidget() {
    return new Gtk.Label({
        label: Me.metadata.name,
    });
}

/**
 * This function is called when the preferences window is first created to fill
 * the `Adw.PreferencesWindow`.
 *
 * If this function is defined, `buildPrefsWidget()` will NOT be called.
 *
 * @param {Adw.PreferencesWindow} window - The preferences window
 */
function fillPreferencesWindow(window) {
    const prefsPage = new Adw.PreferencesPage({
        name: 'general',
        title: 'General',
        icon_name: 'dialog-information-symbolic',
    });
    window.add(prefsPage);

    const prefsGroup = new Adw.PreferencesGroup({
        title: 'Appearance',
        description: `Configure the appearance of ${Me.metadata.name}`,
    });
    prefsPage.add(prefsGroup);

    const showIndicatorRow = new Adw.ActionRow({
        title: 'Show Indicator',
        subtitle: 'Whether to show the panel indicator',
    });
    prefsGroup.add(showIndicatorRow);

    const showIndicatorSwitch = new Gtk.Switch();
    showIndicatorRow.add_suffix(showIndicatorSwitch);
    showIndicatorRow.set_activatable_widget(showIndicatorSwitch);
}

```

--------------------------------

### Example createIcon Function Implementation

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Provides an example implementation of the `createIcon` function, which generates a Clutter.Actor (like an St.Icon) for a search result, considering the requested size and scaling factors.

```javascript
/**
 * Create an icon for a search result.
 *
 * Implementations may want to take scaling into consideration.
 *
 * @param {number} size - The requested size of the icon
 * @returns {Clutter.Actor} An icon
 */
function createIcon(size) {
    const { scaleFactor } = St.ThemeContext.get_for_stage(global.stage);

    return new St.Icon({
        icon_name: 'dialog-question',
        width: size * scaleFactor,
        height: size * scaleFactor,
    });
}
```

--------------------------------

### GJS Package Initialization Example

Source: https://gjs.guide/guides/gtk/application-packaging

Demonstrates initializing the package module and its dependencies for a GJS application.

```javascript
const pkg = imports.package;

// Initialize gettext for internationalization
pkg.initGettext('my-app');

// Initialize the format module
pkg.initFormat();

// Load a specific GResource
pkg.loadResource('org.example.MyResource');

// Require dependencies
pkg.require({
    'Gtk': '4.0',
    'MyCustomModule': '1.0'
});

// Access package information
console.log(`Package: ${pkg.name} v${pkg.version}`);
console.log(`Data directory: ${pkg.pkgdatadir}`);
```

--------------------------------

### GitLab CI ESLint Configuration

Source: https://gjs.guide/guides/gjs/style-guide

Example GitLab CI configuration (`.gitlab-ci.yml`) to run ESLint on every pull request. It installs ESLint globally, runs the linter with JUnit formatting, and saves the report as an artifact.

```yml
image: node:latest

stages:
- lint

eslint:
  stage: lint
  script:
    - export NODE_PATH=$(npm root -g)
    - npm install -g eslint@^8.0.0
    - eslint --format junit --output-file eslint-report.xml .
  artifacts:
    reports:
      junit: eslint-report.xml
    when: always
  rules:
    - when: always

```

--------------------------------

### Initialize Meson Build System

Source: https://gjs.guide/guides/gtk/3/12-app-dev

Initializes the Meson build system for your GJS project. Replace the placeholder with your project's actual directory path.

```meson
meson --set-prefix=***/your/project/directory***/run/
```

--------------------------------

### Run GLib MainLoop for a Duration and Quit

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Shows how to start a GLib.MainLoop, set a timeout to quit the loop after one second, and log messages before and after the loop runs. This example ensures the loop terminates gracefully after a set period.

```javascript
import GLib from 'gi://GLib';

const loop = new GLib.MainLoop(null, false);

const sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    loop.quit();

    return GLib.SOURCE_REMOVE;
});

log('Starting the main loop');

// This function will return when GLib.MainLoop.quit() is called
await loop.runAsync();

log('The main loop stopped');
```

--------------------------------

### GJS Imports and Gtk Setup

Source: https://gjs.guide/guides/gtk/3/10-building-app

Imports necessary Gtk and Gio modules for GJS applications, setting the Gtk version. This is the foundational setup for Gtk applications in GJS.

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gio, Gtk } = imports.gi;

...
```

--------------------------------

### Verify GJS Version

Source: https://gjs.guide/guides/gtk/3/12-app-dev

Checks the installed GJS version on your system. Versions below 1.50.x may require an update or building from source.

```bash
gjs --version
```

--------------------------------

### GitHub Actions ESLint Configuration

Source: https://gjs.guide/guides/gjs/style-guide

GitHub Actions workflow (`.github/workflows/eslint.yml`) for linting projects. It checks out code, installs dependencies including an ESLint SARIF formatter, runs ESLint, and uploads the results as a security report.

```yml
name: ESLint

on:
  push:
    branches: [ 'main' ]
  pull_request:
    branches: [ 'main' ]
  schedule:
    - cron: '33 14 * * 5'

jobs:
  eslint:
    name: Run eslint scanning
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      # Required for private repositories by github/codeql-action/upload-sarif
      actions: read
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install
        run: |
          npm install eslint@^8.0.0
          npm install @microsoft/eslint-formatter-sarif@2.1.7

      - name: Lint
        run: npx eslint .
          --format @microsoft/eslint-formatter-sarif
          --output-file eslint-results.sarif
        continue-on-error: true

      - name: Report
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: eslint-results.sarif
          wait-for-processing: true

```

--------------------------------

### Basic Toggle: GJS QuickSettings Toggle

Source: https://gjs.guide/extensions/topics/quick-settings

Provides an example of creating a basic toggle button for quick settings using `QuickSettings.QuickToggle`. This class is suitable for simple on/off functionalities like Dark Style or Night Light. The example shows how to initialize it with a title, subtitle, icon, and bind its `checked` state to a GSettings key.

```javascript
const ExampleToggle = GObject.registerClass(
class ExampleToggle extends QuickSettings.QuickToggle {
    _init(extensionObject) {
        super._init({
            title: _('Example Title'),
            subtitle: _('Example Subtitle'),
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });

        // Binding the toggle to a GSettings key
        this._settings = extensionObject.getSettings();
        this._settings.bind('feature-enabled',
            this, 'checked',
            Gio.SettingsBindFlags.DEFAULT);
    }
});
```

--------------------------------

### GJS Extension Example for Session Modes

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

A GJS extension example demonstrating how to manage session mode changes. It adds a status indicator when the session is in 'user' mode and removes it during 'unlock-dialog' mode. It also includes a background task that sends notifications hourly.

```js
const {GLib, St} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

class Extension {
    constructor() {
        this._indicator = null;
        this._timeoutId = null;
        this._sessionId = null;
    }

    _addIndicator() {
        if (this._indicator === null) {
            this._indicator = new PanelMenu.Button(0.0, 'Remindicator', false);

            const icon = new St.Icon({
                icon_name: 'preferences-system-time-symbolic',
                style_class: 'system-status-icon',
            });
            this._indicator.add_child(icon);

            Main.panel.addToStatusArea('Remindicator', this._indicator);
        }
    }

    _removeIndicator() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }

    // When the session mode changes, we will either add or remove our indicator
    // so it is not visible on the lock screen.
    _onSessionModeChanged(session) {
        if (session.currentMode === 'user' || session.parentMode === 'user')
            this._addIndicator();
        else if (session.currentMode === 'unlock-dialog')
            this._removeIndicator();
    }

    // Our extension will be enabled when the user logs in
    enable() {
        // Watch for changes to the session mode
        this._sessionId = Main.sessionMode.connect('updated',
            this._onSessionModeChanged.bind(this));

        // Show a notification every hour
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT,
            60 * 60, () => {
                Main.notify('Reminder', 'An hour has passed!');

                return GLib.SOURCE_CONTINUE;
            });

        this._addIndicator();
    }

    // Our extension will only be disabled when the user logs out
    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }

        if (this._sessionId) {
            Main.sessionMode.disconnect(this._sessionId);
            this._sessionId = null;
        }

        this._removeIndicator();
    }
}

/** */
function init() {
    return new Extension();
}
```

--------------------------------

### Build GJS Project with Meson and Ninja

Source: https://gjs.guide/guides/gtk/3/12-app-dev

Compiles your GJS project using Meson and Ninja. This involves creating a build directory, navigating into it, and executing the build commands.

```bash
mkdir build && cd build && ninja && ninja build
```

--------------------------------

### Create Toggle with Menu

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Illustrates how to create a toggle that includes a popup menu for additional settings or options using QuickSettings.QuickMenuToggle. It demonstrates setting up a menu header, adding menu items, and linking to preferences.

```javascript
const ExampleMenuToggle = GObject.registerClass(
class ExampleMenuToggle extends QuickSettings.QuickMenuToggle {
    _init() {
        super._init({
            title: 'Example Name',
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });

        // This function is unique to this class. It adds a nice header with an
        // icon, title and optional subtitle. It's recommended you do so for
        // consistency with other menus.
        this.menu.setHeader('selection-mode-symbolic', 'Example Header',
            'Optional Subtitle');

        // You may also add sections of items to the menu
        this._itemsSection = new PopupMenu.PopupMenuSection();
        this._itemsSection.addAction('Option 1', () => log('activated'));
        this._itemsSection.addAction('Option 2', () => log('activated'));
        this.menu.addMenuItem(this._itemsSection);

        // Add an entry-point for more settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = this.menu.addAction('More Settings',
            () => ExtensionUtils.openPrefs());

        // Ensure the settings are unavailable when the screen is locked
        settingsItem.visible = Main.sessionMode.allowSettings;
        this.menu._settingsActions[Extension.uuid] = settingsItem;
    }
});

```

--------------------------------

### GJS GTK and Gio D-Bus Action Example

Source: https://gjs.guide/guides/gio/dbus

This snippet initializes the GTK environment, creates a main window, and sets up a D-Bus action group. It then adds buttons and check buttons to the window that trigger actions defined in the D-Bus service. The example demonstrates connecting a close request to quit the main loop and running the event loop asynchronously.

```javascript
// Initialize the GTK environment and prepare an event loop
Gtk.init();
const loop = GLib.MainLoop.new(null, false);

// Create a top-level window
const window = new Gtk.Window({
    title: 'GJS GAction Example',
    default_width: 320,
    default_height: 240,
});
window.connect('close-request', () => loop.quit());

const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    margin_start: 12,
    margin_end: 12,
    margin_top: 12,
    margin_bottom: 12,
    spacing: 12,
});
window.set_child(box);

// GTK will search upwards in the hierarchy of widgets for the group, so we will
// insert our action group into the top-level window.
const remoteGroup = Gio.DBusActionGroup.get(
    Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test'
);
window.insert_action_group('test', remoteGroup);

// We can now refer to our actions using the group name chosen when inserting
// it and the action name we want to activate
const button = new Gtk.Button({
    label: 'Click Me!',
    action_name: 'test.paramAction',
    action_target: new GLib.Variant('s', 'Button was clicked!'),
});
box.append(button);

const check = new Gtk.CheckButton({
    label: 'Toggle Me!',
    action_name: 'test.stateAction',
});
box.append(check);

// Open up the window
window.present();
await loop.runAsync();

```

--------------------------------

### Example Extension: Adding System Indicator to Panel

Source: https://gjs.guide/extensions/topics/quick-settings

Illustrates how to integrate a custom `SystemIndicator` into the GNOME Shell panel. It shows the `enable` and `disable` methods of an `Extension` class, creating an instance of `ExampleIndicator`, adding a `QuickToggle` to its items, and registering it with `Main.panel.statusArea.quickSettings`. Proper cleanup in `disable` is also demonstrated.

```javascript
export default class ExampleExtension extends Extension {
    enable() {
        this._indicator = new ExampleIndicator(this);
        this._indicator.quickSettingsItems.push(new ExampleToggle(this));

        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        this._indicator = null;
    }
}
```

--------------------------------

### Access D-Bus Properties with GJS

Source: https://gjs.guide/guides/gio/dbus

Shows how to interact with D-Bus properties using GJS. It includes examples for getting a property value (e.g., 'ShellVersion') and setting a property value (e.g., 'OverviewActive') via the 'org.freedesktop.DBus.Properties' interface.

```APIDOC
APIDOC:
  Interface: org.freedesktop.DBus.Properties
  Description: Standard interface for accessing and modifying object properties.

  Methods:
    Get(interface_name: s, property_name: s) -> v
      Description: Retrieves the value of a property.
      Parameters:
        interface_name: The name of the interface containing the property.
        property_name: The name of the property to retrieve.
      Returns:
        A GLib.Variant containing the property's value.
      Example:
        Calling 'Get' on 'org.gnome.Shell' for 'ShellVersion':
        await Gio.DBus.session.call(
            'org.gnome.Shell',
            '/org/gnome/Shell',
            'org.freedesktop.DBus.Properties',
            'Get',
            new GLib.Variant('(ss)', ['org.gnome.Shell', 'ShellVersion']),
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null);
        // Reply is unpacked to get the version string.

    Set(interface_name: s, property_name: s, value: v) -> void
      Description: Sets the value of a property.
      Parameters:
        interface_name: The name of the interface containing the property.
        property_name: The name of the property to set.
        value: A GLib.Variant containing the new property value.
      Returns:
        None.
      Example:
        Setting 'OverviewActive' to true on 'org.gnome.Shell':
        await Gio.DBus.session.call(
            'org.gnome.Shell',
            '/org/gnome/Shell',
            'org.freedesktop.DBus.Properties',
            'Set',
            new GLib.Variant('(ssv)', [
                'org.gnome.Shell',
                'OverviewActive',
                GLib.Variant.new_boolean(true),
            ]),
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null);

Error Handling:
  Errors are typically Gio.DBusError instances. Use Gio.DBusError.strip_remote_error(e) to clean up error messages.
```

--------------------------------

### GValue Basic Initialization and Usage

Source: https://gjs.guide/guides/gobject/gvalue

Demonstrates the fundamental steps of creating, initializing, setting, and retrieving values from a GObject.Value in GJS. It covers initializing with a specific GType and using the constructor for combined initialization and setting.

```javascript
const booleanValue = new GObject.Value();

// Initialize it to hold a boolean
booleanValue.init(GObject.TYPE_BOOLEAN);
```

```javascript
const stringValue = new GObject.Value();
stringValue.init(GObject.TYPE_STRING);

// Set and get the value contentsstringValue.set_string('string value');
console.log(stringValue.get_string());
```

```javascript
const intValue = new GObject.Value(GObject.TYPE_INT, 1);
console.log(intValue.get_int());
```

--------------------------------

### JavaScript: Example Usage of ExtensionPreferences Static Methods

Source: https://gjs.guide/extensions/topics/extension

Illustrates the usage of static methods from the ExtensionPreferences class, mirroring the functionality of the Extension class for lookup by UUID or URL. This example also shows how to obtain extension settings and metadata.

```javascript
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

let extensionObject, extensionSettings;

// Getting the extension object by UUID
extensionObject = ExtensionPreferences.lookupByUUID('example@gjs.guide');
extensionSettings = extensionObject.getSettings();
console.log(extensionObject.metadata);

// Getting the extension object by URL
extensionObject = ExtensionPreferences.lookupByURL(import.meta.url);
extensionSettings = extensionObject.getSettings();
console.log(extensionObject.metadata);
```

--------------------------------

### Declare Simple GObject Signal (GJS)

Source: https://gjs.guide/guides/gobject/subclassing

Declares a basic signal for a GObject subclass within the Signals dictionary. This example shows a signal named 'example-signal' with default parameters.

```js
const SignalsExample = GObject.registerClass({
    Signals: {
        'example-signal': {},
    },
}, class SignalsExample extends GObject.Object {
});
```

--------------------------------

### Basic GJS GTK Application Structure

Source: https://gjs.guide/guides/gtk/3/04-running-gtk

Demonstrates the essential components of a GJS script for creating GTK applications. It includes the shebang line, importing GTK, initializing the GTK environment, creating a window, showing widgets, and starting the GTK event loop.

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

/* create a widget to demonstrate */

let win = new Gtk.Window();
win.add(/* widget */);
win.show_all();

Gtk.main();
```

--------------------------------

### PopupSwitchMenuItem Example

Source: https://gjs.guide/extensions/topics/popup-menu

Demonstrates how to create and interact with a PopupSwitchMenuItem in GJS. It covers setting the initial state, toggling the switch, updating the label, and connecting to the 'toggled' signal.

```javascript
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const menuItem = new PopupMenu.PopupSwitchMenuItem('Item Label',
    true, {});

// Getting and setting the switch state (both calls are equivalent)
menuItem.setToggleState(!menuItem.state);
menuItem.toggle();

// Setting the label
menuItem.label.text = 'New Label';

// Watching the switch state and updating the switch label
menuItem.connect('toggled', (item, state) => {
    item.setStatusText(state ? 'On' : 'Off');
});
```

--------------------------------

### Preferences Window Setup with Translation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Illustrates how to set up a preferences window for a GJS extension using `ExtensionPreferences`. It includes importing necessary classes like `Adw.PreferencesPage` and `Adw.PreferencesGroup`, and using `gettext` for UI labels.

```js
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class MyExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const page = new Adw.PreferencesPage();

        const group = new Adw.PreferencesGroup({
            title: _('Group Title'),
        });
        page.add(group);

        window.add(page);
    }
}
```

--------------------------------

### PopupSubMenuMenuItem Example

Source: https://gjs.guide/extensions/topics/popup-menu

Illustrates the creation and customization of a PopupSubMenuMenuItem. This includes setting its icon and label, and adding actions to its associated submenu.

```javascript
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const menuItem = new PopupMenu.PopupSubMenuMenuItem('Item Label',
    true, {});

// Setting the icon
menuItem.icon.icon_name = 'info-symbolic';

// Setting the label
menuItem.label.text = 'New Label';

// Adding items
menuItem.menu.addAction('Submenu Item 1', () => console.log('activated'));
menuItem.menu.addAction('Submenu Item 2', () => console.log('activated'));
```

--------------------------------

### Quick Settings Imports (JavaScript)

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Lists essential imports required for developing GNOME Shell Quick Settings components. These include modules for the main UI, popup menus, and the specific QuickSettings module.

```js
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const QuickSettings = imports.ui.quickSettings;

```

--------------------------------

### Dialog.MessageDialogContent API and Usage (JavaScript)

Source: https://gjs.guide/extensions/topics/dialogs

Describes the MessageDialogContent widget, designed for common dialogs with a title and description, similar to Gtk.MessageDialog. It details its constructor and properties for setting the title and description. An example shows its integration into a Dialog.

```APIDOC
Dialog.MessageDialogContent:
  Parent Class: St.BoxLayout

  new Dialog.MessageDialogContent(params)
    - Constructor for MessageDialogContent.
    - Parameters:
      - params (Object): A dictionary of GObject construct properties.

  Properties:
    - title (String): The title of the message. Read-write.
    - description (String): The main text description of the message. Read-write.

  Example:
    import St from 'gi://St';
    import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';

    const parentActor = new St.Widget();
    const dialogLayout = new Dialog.Dialog(parentActor, 'my-dialog');

    const messageLayout = new Dialog.MessageDialogContent({
        title: 'Important',
        description: 'Something happened that you should know about!',
    });
    dialogLayout.contentLayout.add_child(messageLayout);

    dialogLayout.addButton({
        label: 'Close',
        isDefault: true,
        action: () => {
            dialogLayout.destroy();
        },
    });
```

--------------------------------

### Makefile: GNOME Extension Build, Pack, and Install Automation

Source: https://gjs.guide/extensions/development/typescript

Automates the build, packaging, and installation of a GNOME Shell extension. It handles dependency installation, TypeScript compilation, schema compilation, and creating a distributable zip archive. The Makefile also provides targets for installing the extension directly.

```makefile
NAME=my-extension
DOMAIN=example.com

.PHONY: all pack install clean

all: dist/extension.js

node_modules: package.json
	nnpm install

dist/extension.js dist/prefs.js: node_modules
	tsc

schemas/gschemas.compiled: schemas/org.gnome.shell.extensions.$(NAME).gschema.xml
	glib-compile-schemas schemas

$(NAME).zip: dist/extension.js dist/prefs.js schemas/gschemas.compiled
	@cp -r schemas dist/
	@cp metadata.json dist/
	@(cd dist && zip ../$(NAME).zip -9r .)

pack: $(NAME).zip

install: $(NAME).zip
	@touch ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@rm -rf ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)
	@mv dist ~/.local/share/gnome-shell/extensions/$(NAME)@$(DOMAIN)

clean:
	@rm -rf dist node_modules $(NAME).zip

```

--------------------------------

### Create GNOME Extension Interactively (Shell)

Source: https://gjs.guide/extensions/development/creating

Demonstrates the interactive command-line process for creating a new GNOME Shell extension using `gnome-extensions create --interactive`. Guides through naming, describing, setting a UUID, and choosing a template.

```sh
$ gnome-extensions create --interactive
Name should be a very short (ideally descriptive) string.
Examples are: “Click To Focus”, “Adblock”, “Shell Window Shrinker”
Name: Example Extension

Description is a single-sentence explanation of what your extension does.
Examples are: “Make windows visible on click”, “Block advertisement popups”, “Animate windows shrinking on minimize”
Description: An extension serving as an example

UUID is a globally-unique identifier for your extension.
This should be in the format of an email address (clicktofocus@janedoe.example.com)
UUID: example@gjs.guide

Choose one of the available templates:
1) Plain       –  An empty extension
2) Indicator   –  Add an icon to the top bar
Template [1-2]: 1
```

--------------------------------

### Dialog.Dialog API and Usage (JavaScript)

Source: https://gjs.guide/extensions/topics/dialogs

Details the Dialog class for creating custom dialog windows in GNOME Shell. It includes its constructor, methods for managing buttons, and properties for accessing layout areas. An example shows how to instantiate and add content and buttons.

```APIDOC
Dialog.Dialog:
  new Dialog.Dialog(parentActor, styleClass)
    - Constructor for the Dialog class.
    - Parameters:
      - parentActor (Clutter.Actor): The parent actor to which the dialog layout will be added.
      - styleClass (String): An optional CSS class name to style the dialog.

  addButton(buttonInfo)
    - Adds a button to the dialog's action area.
    - Parameters:
      - buttonInfo (Object): An object containing button properties:
        - label (String): The text displayed on the button.
        - action (Function): A callback function executed when the button is activated.
        - key (Number): An optional Clutter key constant (e.g., Clutter.KEY_A) for keyboard shortcuts.
        - isDefault (Boolean): If true, this button is activated by the Enter key and receives default focus.
    - Returns: void

  clearButtons()
    - Removes all previously added buttons from the dialog.
    - Returns: void

  Properties:
    - contentLayout (St.BoxLayout): The content area of the dialog. Read-only.
    - buttonLayout (St.BoxLayout): The action area where buttons are placed. Read-only.

  Example:
    import St from 'gi://St';
    import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';

    const parentActor = new St.Widget();
    const dialogLayout = new Dialog.Dialog(parentActor, 'my-dialog');

    const icon = new St.Icon({icon_name: 'dialog-information-symbolic'});
    dialogLayout.contentLayout.add_child(icon);

    dialogLayout.addButton({
        label: 'Close',
        isDefault: true,
        action: () => {
            dialogLayout.destroy();
        },
    });
```

--------------------------------

### Prettier Configuration

Source: https://gjs.guide/guides/gjs/style-guide

A sample Prettier configuration file, demonstrating common options for code formatting. It's designed to resemble the style used by many GJS applications, focusing on indentation, quotes, and spacing.

```yml
tabWidth: 4
useTabs: false
semi: true
singleQuote: true
quoteProps: 'as-needed'
trailingComma: 'es5'
bracketSpacing: false
arrowParens: 'avoid'

```

--------------------------------

### GNOME Shell Search Provider Imports and Access

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Illustrates the necessary imports from `imports.gi` and `imports.ui.main` for working with GNOME Shell search providers. It shows how to access the live instance of the search results view.

```javascript
const {St} = imports.gi;

const Main = imports.ui.main;

// This is the live instance of the Search Results view
const SearchResults = Main.overview._overview._controls._searchController._searchResults;
```

--------------------------------

### Run GJS Application

Source: https://gjs.guide/guides/gtk/3/12-app-dev

Executes your built GJS application. The path should point to the application's executable within your project's run directory.

```bash
./run/**your.app.name**
```

--------------------------------

### Toggle Menu: GJS QuickSettings Menu Toggle

Source: https://gjs.guide/extensions/topics/quick-settings

Demonstrates how to create a toggle with an associated popup menu using `QuickSettings.QuickMenuToggle`. This is useful for features requiring more options than a simple toggle. The example shows setting up a menu header, adding menu items, and an entry point for further settings, including conditional visibility based on session mode.

```javascript
const ExampleMenuToggle = GObject.registerClass(
class ExampleMenuToggle extends QuickSettings.QuickMenuToggle {
    _init(extensionObject) {
        super._init({
            title: _('Example Title'),
            subtitle: _('Example Subtitle'),
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });

        // Add a header with an icon, title and optional subtitle. This is
        // recommended for consistency with other quick settings menus.
        this.menu.setHeader('selection-mode-symbolic', _('Example Title'),
            _('Optional Subtitle'));

        // Add suffix to the header, to the right of the title.
        const headerSuffix = new St.Icon({
            iconName: 'dialog-warning-symbolic',
        });
        this.menu.addHeaderSuffix(headerSuffix);

        // Add a section of items to the menu
        this._itemsSection = new PopupMenu.PopupMenuSection();
        this._itemsSection.addAction(_('Menu Item 1'),
            () => console.debug('Menu Item 1 activated!'));
        this._itemsSection.addAction(_('Menu Item 2'),
            () => console.debug('Menu Item 2 activated!'));
        this.menu.addMenuItem(this._itemsSection);

        // Add an entry-point for more settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = this.menu.addAction('More Settings',
            () => extensionObject.openPreferences());

        // Ensure the settings are unavailable when the screen is locked
        settingsItem.visible = Main.sessionMode.allowSettings;
        this.menu._settingsActions[extensionObject.uuid] = settingsItem;
    }
});
```

--------------------------------

### ModalDialog Class Documentation

Source: https://gjs.guide/extensions/topics/dialogs

Comprehensive documentation for the ModalDialog class in GJS, detailing its structure, methods, properties, and signals.

```APIDOC
ModalDialog.ModalDialog
  Parent Class: St.Widget

  Description:
    A modal dialog. This class sets up a Dialog.Dialog layout automatically.

  Enumerations:
    State: Enumeration of dialog states.
      - OPENED: The dialog is opened
      - CLOSED: The dialog is closed
      - OPENING: The dialog is opening
      - CLOSING: The dialog is closing
      - FADED_OUT: The dialog is faded out

  Constructor:
    new ModalDialog.ModalDialog(params)
      Parameters:
        params (Object) — A dictionary of specific construct properties
          - shellReactive (Boolean) — Whether the shell is sensitive when the dialog is open (default: false)
          - actionMode (Shell.ActionMode) — A Shell.ActionMode (default: Shell.ActionMode.SYSTEM_MODAL)
          - shouldFadeIn (Boolean) — Whether the dialog should fade in when opened (default: true)
          - shouldFadeOut (Boolean) — Whether the dialog should fade out when closed (default: true)
          - destroyOnClose (Boolean) — Whether the dialog should be destroyed when closed (default: true)
          - styleClass (String) — CSS class for the dialog (default: null)

  Methods:
    addButton(buttonInfo)
      Description: Add a button to the internal Dialog.Dialog
      Parameters:
        buttonInfo (Object) — Button properties
          - label (String) — The button label
          - action (Function) — Optional button activation callback
          - key (Number) — Optional key constant, such as Clutter.KEY_A or Clutter.KEY_space
          - isDefault (Boolean) — If true, the button will be activated by the enter key and receive the default focus
      Returns: St.Button — The newly added button

    setButtons(buttonInfos)
      Description: Set the buttons for the internal Dialog.Dialog, removing any existing buttons
      Parameters:
        buttonInfos (Array(Object)) — A list of button info objects

    clearButtons()
      Description: Removes all buttons from the internal Dialog.Dialog

    setInitialKeyFocus(actor)
      Description: Set an actor to receive the initial key focus
      Parameters:
        actor (Clutter.Actor) — The actor to focus

    open(timestamp, onPrimary)
      Description: Present the dialog
      Parameters:
        timestamp (Number) — Optional timestamp (i.e. global.get_current_time())
        onPrimary (Boolean) — Whether to show the dialog on the primary display
      Returns: Boolean — true if successful, false otherwise

    close(timestamp)
      Description: Hide the dialog
      Parameters:
        timestamp (Number) — Optional timestamp (i.e. global.get_current_time())

  Properties:
    state (Number) — A ModalDialog.State (GObject: read-only)
    dialogLayout (Dialog.Dialog) — A Dialog.Dialog layout (JavaScript: read-only)
    contentLayout (St.BoxLayout) — The internal Dialog.Dialog.contentLayout (JavaScript: read-only)
    buttonLayout (St.BoxLayout) — The internal Dialog.Dialog.buttonLayout (JavaScript: read-only)

  Signals:
    closed
      Description: Emitted when the dialog closes (GObject: no parameters or return values)

    opened
      Description: Emitted when the dialog opens (GObject: no parameters or return values)

```

--------------------------------

### Install TypeScript and GNOME Shell Dependencies

Source: https://gjs.guide/extensions/development/typescript

Installs necessary development tools like ESLint and TypeScript, along with GNOME Shell GObject Introspection bindings for TypeScript development.

```sh
npm install --save-dev \
    eslint \
    eslint-plugin-jsdoc \
    typescript
npm install @girs/gjs @girs/gnome-shell
```

--------------------------------

### GJS Subprocess Creation with Error Handling

Source: https://gjs.guide/guides/gobject/advanced

Demonstrates creating a `Gio.Subprocess` and catching potential execution errors, such as the command not being found. This is useful for robustly launching external processes.

```js
try {
    const proc = Gio.Subprocess.new(['unknown-command'],
        Gio.SubprocessFlags.NONE);
} catch (e) {
    // GLib.SpawnError: Failed to execute child process “unknown-command” (No such file or directory)
    console.error(e);
}
```

--------------------------------

### Connect and Disconnect Signals

Source: https://gjs.guide/guides/gobject/basics

Provides an example of connecting to a signal ('copy-clipboard') using `GObject.Object.prototype.connect` and subsequently disconnecting it using the returned handler ID and `GObject.Object.prototype.disconnect`. This is fundamental for managing signal subscriptions.

```js
const copyLabel = Gtk.Label.new('Lorem Ipsum');

// Connecting a signal
const handlerId = copyLabel.connect('copy-clipboard', label => {
    console.log(`Copied "${label.label}" to clipboard!`);
});

// Disconnecting a signal
if (handlerId)
    copyLabel.disconnect(handlerId);
```

--------------------------------

### Start GDB Session for GNOME Shell

Source: https://gjs.guide/extensions/development/debugging

Launches the GNOME Shell process within GDB, enabling debugging of GJS extensions and the shell itself. Ensure debug symbols for mozjs and GNOME Shell are installed.

```sh
dbus-run-session -- gdb --args gnome-shell --nested --wayland
```

--------------------------------

### Enable GNOME Extension

Source: https://gjs.guide/extensions/development/creating

Enables a specific GNOME extension using the command-line tool. This command is used after starting a GNOME Shell session to activate the extension.

```sh
$ gnome-extensions enable example@gjs.guide
```

--------------------------------

### Configure GJS Signal Return Types

Source: https://gjs.guide/guides/gobject/subclassing

This example shows how to specify a return type for a GJS signal using the `return_type` key. Handlers connected to such signals must return a value matching the specified type, allowing them to communicate back to the emitting object.

```javascript
const ReturnExample = GObject.registerClass({
    Signals: {
        'example-signal': {
            return_type: GObject.TYPE_BOOLEAN,
        },
    },
}, class ReturnExample extends GObject.Object {
});

const returnExample = new ReturnExample();

returnExample.connect('example-signal', () => {
    return true;
});

// Expected output: "signal handler returned true"
if (returnExample.emit('example-signal'))
    console.log('signal handler returned true');
else
    console.log('signal handler returned false');
```

--------------------------------

### Create Basic Toggle

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Demonstrates how to create a simple on/off toggle for GNOME Shell extensions using QuickSettings.QuickToggle. It includes binding the toggle state to a GSettings key and notes on property name changes in GNOME 44.

```javascript
const ExampleToggle = GObject.registerClass(
class ExampleToggle extends QuickSettings.QuickToggle {
    _init() {
        super._init({
            title: 'Example Name',
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });

        // NOTE: In GNOME 44, the `label` property must be set after
        // construction. The newer `title` property can be set at construction.
        this.label = 'Example Name';

        // Binding the toggle to a GSettings key
        this._settings = ExtensionUtils.getSettings();
        this._settings.bind('feature-enabled',
            this, 'checked',
            Gio.SettingsBindFlags.DEFAULT);
    }
});

```

--------------------------------

### ExtensionUtils.ExtensionType Enum

Source: https://gjs.guide/extensions/topics/extension-utils

Defines the type of extension installation, indicating whether it's a system-wide installation or a per-user installation.

```APIDOC
ExtensionUtils.ExtensionType: Enum
  SYSTEM: A system extension
  PER_USER: A user extension
```

--------------------------------

### External Scripting and Binary Usage Rules

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Guidelines for using external scripts and binaries, emphasizing GJS as the preferred language and outlining restrictions on including binaries or requiring user action for dependency installation.

```bash
# Extensions MUST NOT include binary executables or libraries
# Processes MUST be spawned carefully and exit cleanly
# Scripts MUST be written in GJS, unless absolutely necessary
# Scripts must be distributed under an OSI approved license
```

```bash
# Installing modules from pip, npm, or yarn requires explicit user action.
# Example: Extension preferences may include a button to install dependencies.
```

--------------------------------

### Start Nested GNOME Shell Session (Wayland)

Source: https://gjs.guide/extensions/development/creating

Initiates a nested GNOME Shell session within a Wayland environment. This allows for testing extensions without disrupting the current user session.

```sh
$ dbus-run-session -- gnome-shell --nested --wayland
```

--------------------------------

### GJS Application Entry Point Script

Source: https://gjs.guide/guides/gtk/application-packaging

This script serves as the entry point for a GJS application. It initializes the package, sets up versioning and prefix information, and then runs the main module of the application, which is responsible for setting up and managing the GApplication.

```javascript
#!javascript
#!@GJS@
imports.package.init({
    name: "${package-name}",
    version: "@PACKAGE_VERSION@",
    prefix: "@prefix@"
});
imports.package.run(/* ${main-module} */);
```

--------------------------------

### GJS: Using Async/Await with Gio._promisify

Source: https://gjs.guide/guides/gjs/style-guide

Explains how to enable async/await syntax for asynchronous platform library methods using Gio._promisify(). This requires importing GLib and Gio, and promisifying specific methods like file.delete_async.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

Gio._promisify(Gio.File.prototype, 'delete_async');

const file = Gio.File.new_for_path('file.txt');
await file.delete_async(GLib.PRIORITY_DEFAULT, null /* cancellable */);
```

--------------------------------

### Declaring Properties in GJS GObject Subclasses

Source: https://gjs.guide/guides/gobject/subclassing

Illustrates how to declare properties for a GObject subclass in GJS. Properties are defined in the 'Properties' dictionary using GObject.ParamSpec, with 'get' and 'set' accessors controlling value access and notification.

```javascript
const SubclassExample = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.string(
            'example-property',
            'Example Property',
            'A read-write string property',
            GObject.ParamFlags.READWRITE,
            null
        ),
    },
}, class SubclassExample extends GObject.Object {
    get example_property() {
        // Implementing the default value manually
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        // Skip emission if the value has not changed
        if (this.example_property === value)
            return;

        // Set the property value before emitting
        this._example_property = value;
        this.notify('example-property');
    }
});

const objectInstance = new SubclassExample({
    example_property: 'construct value',
});
```

--------------------------------

### GJS GObject ParamSpec for Double Properties

Source: https://gjs.guide/guides/gobject/subclassing

Provides an example of creating a GObject.ParamSpec for a double-precision floating-point property in GJS. It specifies the property's range and default value, mapping to JavaScript's Number type.

```javascript
GObject.ParamSpec.double(
    'number-property',
    'Number Property',
    'A property holding a JavaScript Number',
    GObject.ParamFlags.READWRITE,
    Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER,
    0.0
);
```

--------------------------------

### Create and Respond to Gtk.MessageDialog

Source: https://gjs.guide/guides/gtk/3/17-dialogs

Demonstrates the creation and response handling of Gtk.MessageDialog in GJS. It covers initializing the dialog with text and buttons, and then processing the user's response to determine the next action.

```js
let dialog = new Gtk.MessageDialog({
    title: 'Save?',
    text: 'Do you want to save your notes?',
    buttons: [Gtk.ButtonsType.NONE],
    parent: this,
    transient_for: this
});

dialog.add_button('Cancel', Gtk.ResponseType.CANCEL);
dialog.add_button('Close Without Saving', Gtk.ResponseType.NO);
dialog.add_button('Save Notes', Gtk.ResponseType.YES);
```

```js
let response = dialog.run();

if(response === Gtk.ResponseType.YES) {
  /* save code */
  /* exit code */
} else if (response === Gtk.ResponseType.NO) {
  /* exit code */
} else {
  /* do nothing */
}
```

--------------------------------

### Dialog.ListSection API and Usage (JavaScript)

Source: https://gjs.guide/extensions/topics/dialogs

Details the ListSection widget, used for dialogs containing a list of items, such as network connection dialogs. It covers its constructor, properties for setting a title and accessing the list container. An example demonstrates adding ListSectionItems to it.

```APIDOC
Dialog.ListSection:
  Parent Class: St.BoxLayout

  new Dialog.ListSection(params)
    - Constructor for ListSection.
    - Parameters:
      - params (Object): A dictionary of GObject construct properties.

  Properties:
    - title (String): The title for the list section. Read-write.
    - list (St.BoxLayout): The container widget holding the list items. Read-only.

  Example:
    import St from 'gi://St';
    import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';

    const parentActor = new St.Widget();
    const dialogLayout = new Dialog.Dialog(parentActor, 'my-dialog');

    const listLayout = new Dialog.ListSection({
        title: 'Todo List',
    });
    dialogLayout.contentLayout.add_child(listLayout);

    const taskOne = new Dialog.ListSectionItem({
        icon_actor: new St.Icon({icon_name: 'dialog-information-symbolic'}),
        title: 'Task One',
        description: 'The first thing I need to do',
    });
    listLayout.list.add_child(taskOne);

    const taskTwo = new Dialog.ListSectionItem({
        icon_actor: new St.Icon({icon_name: 'dialog-information-symbolic'}),
        title: 'Task Two',
        description: 'The next thing I need to do',
    });
    listLayout.list.add_child(taskTwo);

    dialogLayout.addButton({
        label: 'Close',
        action: () => {
            dialogLayout.destroy();
        },
    });
```

--------------------------------

### Run ESLint CLI

Source: https://gjs.guide/guides/gjs/style-guide

Command to execute the ESLint command-line interface (CLI) to lint the current project directory. This is a fundamental step for automated code quality checks.

```sh
npx eslint .

```

--------------------------------

### Define a Simple GObject Interface in GJS

Source: https://gjs.guide/guides/gobject/interfaces

Demonstrates how to define a GObject Interface in GJS, specifying required base types, properties, and signals. This example shows the structure for creating a custom interface.

```javascript
const SimpleInterface = GObject.registerClass({
    GTypeName: 'SimpleInterface',
    Requires: [GObject.Object],
    Properties: {
        'simple-property': GObject.ParamSpec.boolean(
            'simple-property',
            'Simple property',
            'A property that must be implemented',
            GObject.ParamFlags.READABLE,
            true
        ),
    },
    Signals: {
        'simple-signal': {},
    },
}, class SimpleInterface extends GObject.Interface {
    /**
     * By convention interfaces provide methods for emitting their signals, but
     * you can always call `emit()` on the instance of an implementation.
     */
    emitSimple() {
        this.emit('simple-signal');
    }

    /**
     * Interfaces can define methods that MAY be implemented, by providing a
     * default implementation.
     */
    optionalMethod() {
        return true;
    }

    /**
     * Interfaces can define methods that MUST be implemented, by throwing the
     * special error `GObject.NotImplementedError()`.
     */
    requiredMethod() {
        throw new GObject.NotImplementedError();
    }
});
```

--------------------------------

### GSettings Schema Definition Example

Source: https://gjs.guide/guides/glib/gvariant

Defines GSettings keys and their types using XML format. This schema includes examples for simple types like boolean, string, and string arrays, as well as a complex nested type.

```xml
<?xml version="1.0" encoding="utf-8"?>
<schemalist>
  <schema path="/guide/gjs/gvariant/" id="guide.gjs.GVariant">

    <!-- Simple types are most common in GSettings -->
    <key name="boolean-setting" type="b">
      <default>true</default>
    </key>

    <!-- Notice default values are in the GVariant Text format -->
    <key name="string-setting" type="s">
      <default>"default string"</default>
    </key>

    <key name="strv-setting" type="as">
      <default>["one", "two"]</default>
    </key>

    <!-- More complex types are possible, but rare -->
    <key name="complex-setting" type="(sasa{sa{sv}})">
      <default>("", [], {})</default>
    </key>
  </schema>
</schemalist>
```

--------------------------------

### GJS Extension Module Pattern

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Scaffolding for a GNOME Shell extension using a module-based structure with top-level functions. Demonstrates `init`, `enable`, and `disable` for extension lifecycle management.

```js
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/**
 * This function is called once when your extension is loaded, not enabled. This
 * is a good time to setup translations or anything else you only do once.
 *
 * You MUST NOT make any changes to GNOME Shell, connect any signals or add any
 * MainLoop sources here.
 *
 * @param {ExtensionMeta} meta - An extension meta object
 */
function init(meta) {
    console.debug(`initializing ${meta.metadata.name}`);
}

/**
 * This function is called when your extension is enabled, which could be
 * done in GNOME Extensions, when you log in or when the screen is unlocked.
 *
 * This is when you should setup any UI for your extension, change existing
 * widgets, connect signals or modify GNOME Shell's behavior.
 */
function enable() {
    console.debug(`enabling ${Me.metadata.name}`);
}

/**
 * This function is called when your extension is uninstalled, disabled in
 * GNOME Extensions or when the screen locks.
 *
 * Anything you created, modified or setup in enable() MUST be undone here.
 * Not doing so is the most common reason extensions are rejected in review!
 */
function disable() {
    console.debug(`disabling ${Me.metadata.name}`);
}
```

--------------------------------

### GNOME Extension Metadata (Complete JSON)

Source: https://gjs.guide/extensions/overview/anatomy

A comprehensive JSON example for metadata.json, demonstrating all possible fields, including optional ones like gettext-domain, settings-schema, session-modes, donations, version, and version-name.

```json
{
    "uuid": "example@gjs.guide",
    "name": "Example Extension",
    "description": "An example extension",
    "shell-version": [ "3.38", "45" ],
    "url": "https://gjs.guide/extensions",
    "gettext-domain": "example@gjs.guide",
    "settings-schema": "org.gnome.shell.extensions.example",
    "session-modes": ["user", "unlock-dialog"],
    "donations": {
        "github": "john_doe",
        "custom": ["https://example.com/1/", "https://example.com/2/"]
    },
    "version": 2,
    "version-name": "1.1"
}
```

--------------------------------

### PopupMenu Example Usage

Source: https://gjs.guide/extensions/topics/popup-menu

Demonstrates how to create and populate a PopupMenu in GJS. It shows adding menu items, moving them, and controlling the menu's open/close state with animations.

```javascript
import St from 'gi://St';

import * as BoxPointer from 'resource:///org/gnome/shell/ui/boxpointer.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Adding items
const menuItem1 = menu.addAction('Item 1', () => console.log('activated'));

const menuItem2 = new PopupMenu.PopupMenuItem('Item 2');
menu.addMenuItem(menuItem2, 0);

// Moving items
menu.moveMenuItem(menuItem2, 1);

// Opening and closing menus
menu.open(BoxPointer.PopupAnimation.FADE);
menu.close(BoxPointer.PopupAnimation.NONE);

// Removing items
menuItem1.destroy();
menu.removeAll();
```

--------------------------------

### List and Find GObject Properties

Source: https://gjs.guide/guides/gobject/advanced

Demonstrates how to list all properties of a GObject class using `list_properties()` and find a specific property by name using `find_property()`. It also shows how to find properties for an instance via its constructor.

```javascript
for (const pspec of Gtk.Widget.list_properties())
    console.log(`Found property: ${pspec.name}`);

// Looking up a property by canonical name
const wrapParamSpec = Gtk.Label.find_property('wrap');

if (wrapParamSpec instanceof GObject.ParamSpec)
    console.log(`Found property: ${wrapParamSpec.name}`);
```

```javascript
// Looking up a property for an instance
const exampleBox = new Gtk.Box();

// Looking up a property for an instance
const spacingParamSpec = exampleBox.constructor.find_property('spacing');

if (spacingParamSpec instanceof GObject.ParamSpec)
    console.log(`Found property: ${spacingParamSpec.name}`);
```

--------------------------------

### Emit Property Change Notification in GJS Subclass

Source: https://gjs.guide/guides/gobject/subclassing

Provides an example of a GJS GObject subclass implementing a property setter that explicitly emits the 'notify' signal after changing the property's value. This ensures that observers are correctly informed of the change.

```js
const SubclassExample = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.string(
            'example-property',
            'Example Property',
            'A read-write string property',
            GObject.ParamFlags.READWRITE,
            null
        ),
    },
}, class SubclassExample extends GObject.Object {
    get example_property() {
        // Implementing the default value manually
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        // Skip emission if the value has not changed
        if (this.example_property === value)
            return;

        // Set the property value before emitting
        this._example_property = value;
        this.notify('example-property');
    }
});

```

--------------------------------

### GJS Extension Class Pattern

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Scaffolding for a GNOME Shell extension using a class-based structure. Includes `init`, `enable`, and `disable` methods for managing extension lifecycle and UI.

```js
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

class Extension {
    constructor() {
        console.debug(`constructing ${Me.metadata.name}`);
    }

    /**
     * This function is called when your extension is enabled, which could be
     * done in GNOME Extensions, when you log in or when the screen is unlocked.
     *
     * This is when you should setup any UI for your extension, change existing
     * widgets, connect signals or modify GNOME Shell's behavior.
     */
    enable() {
        console.debug(`enabling ${Me.metadata.name}`);
    }

    /**
     * This function is called when your extension is uninstalled, disabled in
     * GNOME Extensions or when the screen locks.
     *
     * Anything you created, modified or setup in enable() MUST be undone here.
     * Not doing so is the most common reason extensions are rejected in review!
     */
    disable() {
        console.debug(`disabling ${Me.metadata.name}`);
    }
}

/**
 * This function is called once when your extension is loaded, not enabled. This
 * is a good time to setup translations or anything else you only do once.
 *
 * You MUST NOT make any changes to GNOME Shell, connect any signals or add any
 * MainLoop sources here.
 *
 * @param {ExtensionMeta} meta - An extension meta object
 * @returns {object} an object with enable() and disable() methods
 */
function init(meta) {
    console.debug(`initializing ${meta.metadata.name}`);

    return new Extension();
}
```

--------------------------------

### GtkHeaderBar GTK4 Example: Setting Title Buttons

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

This JavaScript snippet demonstrates how to use the new `GtkHeaderBar.set_show_title_buttons()` function in GTK4. It shows how to create a HeaderBar and set its title buttons visibility, replacing the older `set_show_close_button()` method. The example assumes context within a `prefsWidget`'s 'realize' signal.

```js
prefsWidget.connect('realize', () => {

    let window = prefsWidget.get_root();

    let headerBar = new Gtk.HeaderBar({show_title_buttons: false});

    // use this instead of headerBar.set_show_close_button(true);
    headerBar.set_show_title_buttons(true);

    window.set_titlebar(headerBar);
});
```

--------------------------------

### Iterate Gio.MenuModel item attributes and links

Source: https://gjs.guide/guides/gio/actions-and-menus

Provides an example of iterating through the attributes and links associated with a specific item in a `Gio.MenuModel`. It shows how to use `iterate_item_attributes` to get properties like label, icon, and action, and `iterate_item_links` to access sections and submenus. It includes handling GVariant deserialization for icons and custom attributes/links.

```js
import Gio from 'gi://Gio';

const menuModel = new Gio.Menu();

/*
 * Get an attribute iterator for the item at index `0`
 */
const attrIter = menuModel.iterate_item_attributes(0);

while (attrIter.next()) {
    const attributeName = attrIter.get_name();
    const value = attrIter.get_value();
    let icon = null;

    switch (attributeName) {
    /*
     * This is the label of the menu item.
     */
    case Gio.MENU_ATTRIBUTE_LABEL:
        console.log(`${attributeName}: "${value.unpack()}"`);
        break;

    /*
     * Icons must be deserialized from GVariant to GIcon.
     */
    case Gio.MENU_ATTRIBUTE_ICON:
        icon = Gio.Icon.deserialize(value);

        console.log(`${attributeName}: ${icon.$gtype.name}`);
        break;

    /*
     * This is the GAction name (e.g. `quit`), but does not include the
     * namespace or scope (e.g. `app`). The full action name is something
     * like `app.quit`, although action names may also contain periods.
     */
    case Gio.MENU_ATTRIBUTE_ACTION:
        console.log(`${attributeName}: "${value.unpack()}"`);
        break;

    /*
     * This is the GAction namespace (e.g. `app`), which should combined
     * with the GAction name (e.g. `${actionNamespace}.${actionName}`).
     */
    case Gio.MENU_ATTRIBUTE_ACTION_NAMESPACE:
        console.log(`${attributeName}: "${value.unpack()}"`);
        break;

    /*
     * This is the activatable parameter, or stateful value of the action.
     */
    case Gio.MENU_ATTRIBUTE_TARGET:
        console.log(`${attributeName}: ${value.print(true)}`);
        break;

    /*
     * Handling custom attributes will require understanding how they are
     * intended to be used.
     */
    case 'my-custom-attribute':
    default:
        console.log(`${attributeName}: ${value.print(true)}`);
        break;
    }
}

/*
 * Get a link iterator for the item at index `0`.
 *
 * Links associate sections and submenus with a particular item.
 */
const linkIter = menuModel.iterate_item_links(0);

while (linkIter.next()) {
    const linkName = linkIter.get_name();
    const value = linkIter.get_value();

    switch (linkIter) {
    /*
     * This is a menu section, an instance of GMenuModel. Sections take the
     * place of a menu item, unlike submenus.
     */
    case Gio.MENU_LINK_SECTION:
        console.log(`${linkName}: ${value.$gtype.name}`);
        break;

    /*
     * This is a submenu, an instance of GMenuModel. Submenus are associated
     * with a menu item, unlike sections which are displayed in place of the
     * item.
     */
    case Gio.MENU_LINK_SUBMENU:
        console.log(`${linkName}: ${value.$gtype.name}`);
        break;

    /*
     * Handling custom link types will require understanding how they are
     * intended to be used.
     */
    case 'my-custom-link':
    default:
        console.log(`${linkName}: ${value.$gtype.name}`);
        break;
    }
}
```

--------------------------------

### GJS AsyncInitable with DBusObjectManagerClient

Source: https://gjs.guide/guides/gobject/advanced

Illustrates asynchronous construction using `Gio.AsyncInitable` with `Gio.DBusObjectManagerClient.new_for_bus`. If construction fails, the returned `Promise` will reject with the error, such as authorization issues.

```js
try {
    const manager = await Gio.DBusObjectManagerClient.new_for_bus(
        Gio.BusType.SYSTEM,
        Gio.DBusObjectManagerClientFlags,
        'org.freedesktop.login1',
        '/org/freedesktop/login1',
        null,
        null);
} catch (e) {
    if (e instanceof Gio.DBusError)
        Gio.DBusError.strip_remote_error(e);

    // Gio.DBusError: Sender is not authorized to send message
    console.error(e);
}
```

--------------------------------

### D-Bus Service Structure Example

Source: https://gjs.guide/guides/gio/dbus

Illustrates the hierarchical structure of a typical D-Bus service, such as UPower, showing object paths and the interfaces they implement. This helps understand how D-Bus services are organized and how applications interact with them.

```APIDOC
org.freedesktop.UPower
    /org/freedesktop/UPower
        org.freedesktop.DBus.Introspectable
        org.freedesktop.DBus.Peer
        org.freedesktop.DBus.Properties
        org.freedesktop.UPower
    /org/freedesktop/UPower/devices/battery_BAT0
        org.freedesktop.DBus.Introspectable
        org.freedesktop.DBus.Peer
        org.freedesktop.DBus.Properties
        org.freedesktop.UPower.Device
```

--------------------------------

### Navigate Files and Directories with Gio.File

Source: https://gjs.guide/guides/gio/file-operations

Demonstrates how to navigate the file system by obtaining `Gio.File` objects for child files and parent directories. It uses `Gio.File.get_child()` to get a file relative to a directory and `Gio.File.get_parent()` to get the directory containing the current file.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// Our starting point, in the current working directory
const cwd = Gio.File.new_for_path('.');

// A child of the directory
const childFile = cwd.get_child('test-file.txt');

// The parent directory
const parentDir = cwd.get_parent();

// A child of the parent directory
const parentFile = parentDir.get_child('parent-file.txt');
```

--------------------------------

### Display Panel Indicator and Toggle

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Shows how to create a panel indicator using QuickSettings.SystemIndicator that displays an icon and manages quick setting items. It binds the indicator's visibility to a GSettings key and associates a custom toggle with it.

```javascript
const ExampleIndicator = GObject.registerClass(
class ExampleIndicator extends QuickSettings.SystemIndicator {
    _init() {
        super._init();

        // Create the icon for the indicator
        this._indicator = this._addIndicator();
        this._indicator.icon_name = 'selection-mode-symbolic';

        // Showing the indicator when the feature is enabled
        this._settings = ExtensionUtils.getSettings();
        this._settings.bind('feature-enabled', this._indicator, 'visible',
            Gio.SettingsBindFlags.DEFAULT);

        // Create the toggle and associate it with the indicator, being sure to
        // destroy it along with the indicator
        this.quickSettingsItems.push(new ExampleToggle());

        this.connect('destroy', () => {
            this.quickSettingsItems.forEach(item => item.destroy());
        });

        // Add the indicator to the panel and the toggle to the menu
        QuickSettingsMenu._indicators.add_child(this);
        QuickSettingsMenu._addItems(this.quickSettingsItems);
    }
});

```

--------------------------------

### Display Standard Text with Gtk.Label in GJS

Source: https://gjs.guide/guides/gtk/3/06-text

Demonstrates how to create a Gtk.Label widget to display plain text. It shows the basic setup using the `label` property and `Gtk.main()` for running the application.

```gjs
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

let label = new Gtk.Label({ label: 'Hello!' });
let win = new Gtk.Window();
win.add(label);
win.show_all();

Gtk.main();

```

--------------------------------

### JavaScript GSettings Interaction Example

Source: https://gjs.guide/guides/glib/gvariant

Demonstrates how to retrieve and set GSettings values using the Gio.Settings API in JavaScript. This example covers handling simple types (boolean, string, string array) and complex types by unpacking and repacking GVariant objects.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const settings = new Gio.Settings({schema_id: 'guide.gjs.GVariant'});

// Simple types are easy to work with
const boolValue = settings.get_boolean('boolean-setting');
settings.set_boolean('boolean-setting', !boolValue);

const stringValue = settings.get_string('string-setting');
settings.set_string('string-setting', 'a different string');

const strvValue = settings.get_strv('strv-setting');
settings.set_strv('strv-setting', strvValue.concat('three'));

// Complex types can be handled manually
const complexVariant = settings.get_value('complex-setting');
const complexValue = complexVariant.recursiveUnpack();

const newComplexValue = GLib.Variant('(sasa{sa{sv}})', [
    '',
    [],
    {},
]);
settings.set_value('complex-setting', newComplexValue);
```

--------------------------------

### GJS SimpleAction: Basic and Parameterized Activation

Source: https://gjs.guide/guides/gio/actions-and-menus

Demonstrates creating and activating `Gio.SimpleAction` instances in GJS. Covers basic activation with no parameters and activation with a string parameter, showing how to connect to the 'activate' signal for handling events.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/*
 * The most basic action, which works similar to a function with no arguments.
 */
const basicAction = new Gio.SimpleAction({
    name: 'basicAction',
});

basicAction.connect('activate', (action, _parameter) => {
    console.log(`${action.name} activated!`);
});

basicAction.activate(null);

/*
 * An action that works similar to a function with a single string argument.
 */
const paramAction = new Gio.SimpleAction({
    name: 'paramAction',
    parameter_type: new GLib.VariantType('s'),
});

paramAction.connect('activate', (action, parameter) => {
    console.log(`${action.name} activated: ${parameter.unpack()}`);
});

paramAction.activate(GLib.Variant.new_string('string'));

```

--------------------------------

### GJS: Constructing Objects with Properties

Source: https://gjs.guide/guides/gjs/style-guide

Demonstrates setting object properties during construction for cleaner code. It highlights the preference for camelCase property accessors in GJS, which GObject can automatically convert.

```javascript
const label = new Gtk.Label({
    label: 'Example',
});
```

--------------------------------

### GJS JavaScript File and Directory Naming

Source: https://gjs.guide/guides/gjs/style-guide

Guidelines for naming JavaScript files and directories in GJS projects. Files should use `lowerCamelCase.js`, while directories should be short and `lowercase`.

```sh
js/misc/extensionSystem.js
js/ui/panel.js

```

--------------------------------

### GJS Module Import Convention

Source: https://gjs.guide/guides/gjs/style-guide

Demonstrates the recommended way to import modules and classes in GJS projects using ES Modules. It shows how to import with `PascalCase` and separate different import types with blank lines.

```js
import * as Util from 'resource:///gjs/guide/Example/js/util.js';

import Gio from 'gi://Gio';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import * as Util from './lib/util.js';

```

--------------------------------

### GNOME Shell 44- Extension Initialization

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Illustrates the initialization process for GNOME Shell extensions in versions 44 and earlier. This snippet includes the `init()` function and the `Extension` class, highlighting the `constructor` and its limitations.

```js
const ExtensionUtils = imports.misc.extensionUtils;

class Extension {
    constructor() {
        // DO NOT create objects, connect signals or add main loop sources here
    }

    enable() {
        // Create objects, connect signals, create main loop sources, etc.
    }

    disable() {
        // Destroy objects, disconnect signals, remove main loop sources, etc.
    }
}

function init() {
    // Initialize translations before returning the extension object
    ExtensionUtils.initTranslations();

    return new Extension();
}
```

--------------------------------

### GNOME Shell Debugging Stack Trace Example

Source: https://gjs.guide/extensions/development/debugging

When SHELL_DEBUG is configured, GNOME Shell outputs detailed stack traces for logged messages or fatal errors. This example demonstrates the format, showing how it maps internal C warnings to specific JavaScript source files and line numbers, facilitating debugging of extension code.

```sh
(gnome-shell:37007): libmutter-WARNING **: 11:08:37.446: (../src/backends/meta-barrier.c:283):init_barrier_impl: runtime check failed: (priv->impl)
== Stack trace for context 0x55cf122c0ce0 ==
#0   55cf1238c058 i   resource:///org/gnome/shell/ui/layout.js:590 (12915b5d6560 @ 281)
#1   55cf1238bfc8 i   resource:///org/gnome/shell/ui/layout.js:569 (12915b5d64c0 @ 22)
#2   55cf1238bf38 i   resource:///org/gnome/shell/ui/init.js:21 (12915b570ba0 @ 48)
```

--------------------------------

### List, Lookup, and Query GObject Signals

Source: https://gjs.guide/guides/gobject/advanced

Demonstrates how to list signal IDs for a class using `signal_list_ids()`, look up a signal by name using `signal_lookup()`, and query signal details using `signal_query()`. It also covers finding signals for an instance via its constructor.

```javascript
for (const signalId of GObject.signal_list_ids(Gtk.Widget))
    console.log(`Found signal: ${signalId}`);

const notifyId = GObject.signal_lookup('notify', GObject.Object);

if (notifyId !== 0)
    console.log(`Found signal: ${notifyId}`);
```

```javascript
const exampleBox = new Gtk.Box();
const destroyId = GObject.signal_lookup('destroy', exampleBox.constructor);

if (destroyId !== 0)
    console.log(`Found signal: ${destroyId}`);
```

```javascript
const destroyQuery = GObject.signal_query(destroyId);

if (destroyQuery !== null)
    console.log(`Found signal: ${destroyQuery.itype.name}::${destroyQuery.signal_name}`);
```

--------------------------------

### Mutter and Meta Integration

Source: https://gjs.guide/extensions/overview/architecture

Details Mutter's role as the Wayland compositor or X11 window manager, and how the 'Meta' import provides access to GNOME Shell's core functionalities.

```APIDOC
Mutter:
  Role: Implements the Wayland compositor or X11 window manager and compositing manager.
  Reference: https://gitlab.gnome.org/GNOME/mutter

Meta:
  Description: Library API for Mutter.
  Access: Provides access to displays, workspaces, windows, clipboard selections, and more.
  Reference: https://gjs-docs.gnome.org/#q=meta
```

--------------------------------

### Get D-Bus Bus Connections

Source: https://gjs.guide/guides/gio/dbus

Demonstrates how to obtain connections to the D-Bus session and system buses using GJS convenience properties. These connections are essential for communicating with D-Bus services.

```javascript
const sessionConnection = Gio.DBus.session;
const systemConnection = Gio.DBus.system;
```

--------------------------------

### GJS Global Variables

Source: https://gjs.guide/guides/gjs/style-guide

Lists and describes the global variables provided by the GJS runtime environment. These are typically available without explicit imports and are marked as read-only.

```APIDOC
GJS Globals:
  ARGV: readonly
  Debugger: readonly
  GIRepositoryGType: readonly
  globalThis: readonly
  imports: readonly
  Intl: readonly
  log: readonly
  logError: readonly
  pkg: readonly
  print: readonly
  printerr: readonly
  window: readonly
  TextEncoder: readonly
  TextDecoder: readonly
  console: readonly
  setTimeout: readonly
  setInterval: readonly
  clearTimeout: readonly
  clearInterval: readonly
  # GNOME Shell Only Globals:
  global: readonly
  _: readonly
  C_: readonly
  N_: readonly
  ngettext: readonly
```

--------------------------------

### Define gettext-domain in metadata.json

Source: https://gjs.guide/extensions/development/translations

Specifies the Gettext domain for an extension, allowing GNOME Shell to automatically initialize translations. This key in `metadata.json` simplifies the localization setup process.

```json
{
    "uuid": "example@gjs.guide",
    "name": "Example Extension",
    "description": "An example extension with translations",
    "shell-version": [ "45" ],
    "url": "https://gjs.guide/extensions",
    "gettext-domain": "example@gjs.guide"
}
```

--------------------------------

### JavaScript: Example Usage of Extension Static Methods

Source: https://gjs.guide/extensions/topics/extension

Demonstrates how to use the static methods of the Extension class to look up an extension by its UUID or import.meta.url. It shows retrieving the extension object and accessing its metadata and settings.

```javascript
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

let extensionObject, extensionSettings;

// Getting the extension object by UUID
extensionObject = Extension.lookupByUUID('example@gjs.guide');
extensionSettings = extensionObject.getSettings();
console.log(extensionObject.metadata);

// Getting the extension object by URL
extensionObject = Extension.lookupByURL(import.meta.url);
extensionSettings = extensionObject.getSettings();
console.log(extensionObject.metadata);
```

--------------------------------

### Import ES Modules in GJS

Source: https://gjs.guide/guides/gjs/intro

Demonstrates importing built-in, platform, and user modules using standard ES Module syntax (`import`). Covers custom specifiers for GJS modules, `gi://` URIs for platform libraries, and relative paths for user modules.

```javascript
/* GJS's Built-in modules have custom specifiers */
import Cairo from 'cairo';
import Gettext from 'gettext';
import System from 'system';

/* Platform libraries use the gi:// URI in the specifier */
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/* Platform libraries with multiple versions may be defined at import */
import Gtk from 'gi://Gtk?version=4.0';

/* User modules may be imported using a relative path
 * 
 * `utils.js` is in the subdirectory `lib`, relative to the current path. The
 * file extension is included in the import specifier.
 */
import * as Utils from './lib/utils.js';
```

--------------------------------

### GtkFileChooserButton Migration Example

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates replacing the deprecated GtkFileChooserButton with GtkButton and GtkFileChooserNative. The XML defines the UI elements, and the JavaScript handles the logic for showing the file chooser and updating the button label.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
    <template class="PrefsWidget" parent="GtkBox">
        <property name="orientation">vertical</property>
        <child>
            <object class="GtkButton" id="file_chooser_button">
                <property name="halign">end</property>
                <property name="valign">center</property>
                <property name="label" translatable="yes">Open</property>
                <signal name="clicked" handler="_onBtnClicked" swapped="no"/>
            </object>
        </child>
    </template>
    <object class="GtkFileChooserNative" id="file_chooser">
        <property name="title" translatable="yes">File Chooser Title</property>
        <property name="select-multiple">0</property>
        <property name="action">open</property>
        <property name="modal">1</property>
        <signal name="response" handler="_onFileChooserResponse" swapped="no"/>
    </object>
</interface>
```

```js
const {GObject, Gtk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'file_chooser',
        'file_chooser_button',
    ],
}, class PrefsWidget extends Gtk.Box {

    _init(params = {}) {
        super._init(params);
    }

    _onBtnClicked(btn) {
        let parent = btn.get_root();
        this._file_chooser.set_transient_for(parent);
        this._file_chooser.show();
    }

    _onFileChooserResponse(native, response) {
        if (response !== Gtk.ResponseType.ACCEPT) {
            return;
        }
        let fileURI = native.get_file().get_uri();
        this._file_chooser_button.set_label(fileURI);
    }
});

function init() {}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

--------------------------------

### Signal Callback Arguments

Source: https://gjs.guide/guides/gobject/basics

Demonstrates how to handle multiple callback arguments when connecting to a signal. The first argument is always the emitting object, followed by signal-specific arguments. This example shows accessing the 'step', 'count', and 'extendSelection' arguments for a 'move-cursor' signal.

```js
const selectLabel = Gtk.Label.new('This label has a popup!');

selectLabel.connect('move-cursor', (label, step, count, extendSelection) => {
    if (label === selectLabel)
        console.log('selectLabel emitted the signal!');

    if (step === Gtk.MovementStep.WORDS)
        console.log(`The cursor was moved ${count} word(s)`);

    if (extendSelection)
        console.log('The selection was extended');
});
```

--------------------------------

### Get System Notification Source

Source: https://gjs.guide/extensions/topics/notifications

Retrieves the default system-provided notification source, which can be used to display notifications originating from the system itself.

```javascript
const systemSource = MessageTray.getSystemSource();

const systemNotification = new MessageTray.Notification({
    source: systemSource,
    title: 'System Notification',
    body: 'This notification will appear to come from the system',
});
systemSource.addNotification(systemNotification);
```

--------------------------------

### GJS Initable Initialization with Cancellation

Source: https://gjs.guide/guides/gobject/advanced

Shows how to initialize a GObject using `Gio.Initable.init()` and pass a `Gio.Cancellable` object to allow for cancellation of the initialization process. This pattern is used for synchronous initialization.

```js
try {
    const proc = new Gio.Subprocess({
        argv: ['ls'],
        flags: Gio.SubprocessFlags.NONE,
    });

    const cancellable = Gio.Cancellable.new();
    cancellable.cancel();
    proc.init(cancellable);
} catch (e) {
    // Gio.IOErrorEnum: Operation was cancelled
    console.error(e);
}
```

--------------------------------

### Logged Error Warning Output

Source: https://gjs.guide/extensions/topics/notifications

Example of how an error notification, triggered by `Main.notifyError()`, is logged as a warning in the GNOME Shell message output.

```sh
GNOME Shell-Message: 00:00:00.000: error: Failed to load configuration: File not found
```

--------------------------------

### St.Widget Label Actor Property

Source: https://gjs.guide/extensions/development/accessibility

The St.Widget:label-actor property is used to establish a relationship between a widget and its descriptive label, which is a common accessibility pattern.

```APIDOC
St.Widget:label-actor
  - A property that should be set to a widget with the role Atk.Role.LABEL, typically an St.Label.
  - This automatically handles the relationship between the widget and its label.
```

--------------------------------

### Construct Gtk.Label with Properties

Source: https://gjs.guide/guides/gobject/basics

Demonstrates creating a Gtk.Label instance using the `new` operator and passing a dictionary of properties for initialization.

```javascript
const cancelLabel = new Gtk.Label({
    label: '_Cancel',
    use_underline: true,
});
```

--------------------------------

### Soup3 POST Request Example

Source: https://gjs.guide/extensions/upgrading/gnome-shell-43

Demonstrates how to make a POST request using Soup 3 in GJS. It sends data asynchronously and handles the response, checking for an OK status and decoding the response body. Requires imports.gi.

```javascript
const {Soup, GLib} = imports.gi;

let session = new Soup.Session();

let params = {
    id: '1',
};

let message = Soup.Message.new_from_encoded_form(
    'POST',
    'https://example.com/',
    Soup.form_encode_hash(params)
);

session.send_and_read_async(
    message,
    GLib.PRIORITY_DEFAULT,
    null,
    (session, result) => {
        if (message.get_status() === Soup.Status.OK) {
            let bytes = session.send_and_read_finish(result);
            let decoder = new TextDecoder('utf-8');
            let response = decoder.decode(bytes.get_data());
            console.log(`Response: ${response}`);
        }
    }
);
```

--------------------------------

### Import GNOME Shell and Local Modules in GJS

Source: https://gjs.guide/extensions/overview/imports-and-modules

Demonstrates importing core GNOME Shell components and custom extension modules. It shows how to use `resource://` URIs for bundled GNOME Shell modules and relative paths for local utility files. The example includes a basic `enable`/`disable` structure for an extension class.

```javascript
/* GNOME Shell modules are imported with a GResource path */
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

/* Your extension's modules are imported with a relative path */
import * as Utils from './utils.js';

/* The default export for `extension.js` and `prefs.js` must be the class */
export default class ExampleExtension extends Extension {
    enable() {
        this._indicator = Utils.createIndicator(this.metadata.name);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
```

--------------------------------

### Importing GNOME Shell Core Modules

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Illustrates importing essential GNOME Shell core modules used for building UI elements and managing extensions. These imports provide access to functionalities like panel menus, modal dialogs, and extension utilities.

```javascript
const ExtensionUtils = imports.misc.extensionUtils;
const ModalDialog = imports.ui.modalDialog;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
```

--------------------------------

### GNOME Extension File Structure (Shell)

Source: https://gjs.guide/extensions/overview/anatomy

Illustrates the typical directory layout for GNOME Shell extensions, showing both user and system installation paths and the essential files like extension.js and metadata.json.

```sh
# User Extension
~/.local/share/gnome-shell/extensions/example@gjs.guide/
    extension.js
    metadata.json

# System Extension
/usr/share/gnome-shell/extensions/example@gjs.guide/
    extension.js
    metadata.json
```

--------------------------------

### Create and Bind Quick Settings Slider

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Demonstrates creating a custom slider component that binds its value to a GSettings key. It handles signal connections for value changes and updates the GSettings value accordingly, ensuring proper blocking of signals during updates.

```javascript
const ExampleSlider = GObject.registerClass(class ExampleSlider extends QuickSettings.QuickSlider {
    _init() {
        super._init({
            iconName: 'selection-mode-symbolic',
        });

        this._sliderChangedId = this.slider.connect('notify::value',
            this._onSliderChanged.bind(this));

        // Binding the slider to a GSettings key
        this._settings = ExtensionUtils.getSettings();
        this._settings.connect('changed::feature-range',
            this._onSettingsChanged.bind(this));

        this._onSettingsChanged();

        // Set an accessible name for the slider
        this.slider.accessible_name = 'Example Range';
    }

    _onSettingsChanged() {
        // Prevent the slider from emitting a change signal while being updated
        this.slider.block_signal_handler(this._sliderChangedId);
        this.slider.value = this._settings.get_uint('feature-range') / 100.0;
        this.slider.unblock_signal_handler(this._sliderChangedId);
    }

    _onSliderChanged() {
        // Assuming our GSettings holds values between 0..100, adjust for the
        // slider taking values between 0..1
        const percent = Math.floor(this.slider.value * 100);
        this._settings.set_uint('feature-range', percent);
    }
});

// Add the slider to the menu, this time passing `2` as the second
// argument to ensure the slider spans both columns of the menu
QuickSettingsMenu._addItems([new FeatureSlider()], 2);
```

--------------------------------

### GObject Signal Introspection API

Source: https://gjs.guide/guides/gobject/advanced

API documentation for GObject signal introspection. These functions allow developers to discover and query information about signals defined for GObject classes.

```APIDOC
GObject.signal_list_ids(gtype: GObject.Type)
  - Lists all signal IDs registered for a given GObject type.
  - Parameters:
    - gtype: The GObject.Type to list signals for.
  - Returns: An array of signal IDs (integers).

GObject.signal_lookup(name: string, gtype: GObject.Type)
  - Looks up a signal ID by its name for a given GObject type.
  - Parameters:
    - name: The name of the signal to look up.
    - gtype: The GObject.Type to search within.
  - Returns: The signal ID if found, otherwise 0.

GObject.signal_query(signal_id: number)
  - Queries detailed information about a signal using its ID.
  - Parameters:
    - signal_id: The ID of the signal to query.
  - Returns: A GObject.SignalQuery object containing signal details, or null if the ID is invalid.

GObject.SignalQuery
  - Represents the specification of a GObject signal.
  - Properties:
    - signal_id: The ID of the signal.
    - signal_name: The name of the signal.
    - return_type: The return type of the signal handler.
    - n_params: The number of parameters the signal handler accepts.
    - c_marshaller: The C marshaller for the signal.
    - flags: Flags indicating signal behavior.
    - owner: The GObject.Type that owns the signal.
    - param_types: An array of GObject.Type for signal parameters.
  - See: https://gjs-docs.gnome.org/gobject20/gobject.signal_list_ids
  - See: https://gjs-docs.gnome.org/gobject20/gobject.signal_lookup
  - See: https://gjs-docs.gnome.org/gobject20/gobject.signal_query
  - See: https://gjs-docs.gnome.org/gobject20/gobject.signalquery
```

--------------------------------

### GJS Application Lifecycle and Window Presentation

Source: https://gjs.guide/guides/gtk/3/10-building-app

This snippet demonstrates basic application control in GJS, including presenting a window and running the main application loop. It assumes the existence of an 'activeWindow' object and an 'application' instance within the GJS environment.

```javascript
activeWindow.present();
});

application.run(null);
```

--------------------------------

### GJS Runtime Package Module API

Source: https://gjs.guide/guides/gtk/application-packaging

Provides access to package information and initialization functions for GJS applications. It allows access to package name, version, installation paths, and initialization of internationalization and formatting modules.

```APIDOC
Runtime API:

Provides access to the package module via `window.pkg` (or `pkg` on the global object).

Functions and Properties:

- `pkg.name`: Returns the package name.
- `pkg.version`: Returns the package version.
- `pkg.prefix`: Returns the installation prefix directory.
- `pkg.datadir`: Returns the installed data directory.
- `pkg.libdir`: Returns the installed library directory.
- `pkg.pkgdatadir`: Returns the package-specific data directory.
- `pkg.moduledir`: Returns the module directory.
- `pkg.pkglibdir`: Returns the package-specific library directory.
- `pkg.localedir`: Returns the locale directory.
- `pkg.initGettext()`: Initializes gettext for internationalization. Makes `window.*`, `window.C*`, and `window.N_*` available.
- `pkg.initFormat()`: Initializes the format module. Makes `String.prototype.format` available.
- `pkg.initSubmodule(name)`: Initializes a submodule named `@name`. Must be called before accessing typelibs installed by that submodule.
- `pkg.loadResource(name)`: Loads and registers a GResource named `@name`. `@name` is optional and defaults to the main resource.
- `pkg.require(deps)`: Marks dependencies on GI and standard JS modules. `@deps` is an object mapping repository names to API versions. If dependencies are not met, it prints an error and quits.
```

--------------------------------

### Create Gio.Settings Action for GSettings Values

Source: https://gjs.guide/guides/gio/actions-and-menus

Illustrates creating a Gio.Action directly from a GSettings value. Boolean settings become activatable actions, while other types create stateful actions. This example shows binding to a setting, connecting to changes, and activating the action.

```javascript
import Gio from 'gi://Gio';

const settings = new Gio.Settings({
    schema_id: 'org.gnome.desktop.interface',
});

settings.connect('changed::enable-animations', (object, _key) => {
    console.log(`GSettings Value: ${object.example_property}`);
});

const settingsAction = settings.create_action('enable-animations');

settingsAction.connect('notify::state', (action, _pspec) => {
    console.log(`Action State: ${action.state.unpack()}`);
});

settings.set_boolean('enable-animations', false);
settingsAction.activate(null);
```

--------------------------------

### GJS: Application-Level Actions with Gio.Application

Source: https://gjs.guide/guides/gio/actions-and-menus

Shows how to use Gio.Application to manage application-wide actions like 'quit'. Demonstrates connecting to application lifecycle signals and activating actions. Requires gi://GLib and gi://Gio.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const application = Gio.Application.new('guide.gjs.Example',
    Gio.ApplicationFlags.DEFAULT_FLAGS);

application.connect('activate', () => {
    console.log('The application has been activated');
});

application.connect('startup', () => {
    console.log('The application will run until instructed to quit');
    application.hold();
});

application.connect('shutdown', () => {
    console.log('The application is shutting down');
    application.hold();
});

/*
 * If activated elsewhere in the application, the action name will be `app.quit`
 */
const quitAction = new Gio.SimpleAction({
    name: 'quit',
});

quitAction.connect('activate', () => {
    console.log('The application is being instructed to quit');
    application.quit();
});

application.add_action(quitAction);

/*
 * Activate the `quit` action, shortly after the application starts.
 */
GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    application.activate_action('quit', null);
});

application.run([imports.system.programInvocationName].concat(ARGV));

```

--------------------------------

### Get GTK Version (JavaScript)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates how to retrieve the major GTK version using `imports.gi.Gtk`. This is useful for supporting older GTK versions in `prefs.js`.

```js
const {Gtk} = imports.gi;
const gtkVersion = Gtk.get_major_version();

log(`GTK version is ${gtkVersion}`);
```

--------------------------------

### PopupMenuSection Example

Source: https://gjs.guide/extensions/topics/popup-menu

Illustrates how to use PopupMenuSection to group menu items. It shows creating a parent menu, a section, adding an item to the section, and then adding the section to the parent menu.

```javascript
import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// Parent Menu
const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Menu Section
const section = new PopupMenu.PopupMenuSection();
section.addAction('Menu Item', () => console.log('activated'));

menu.addMenuItem(section);
```

--------------------------------

### GTK Widget Tree Navigation (APIDOC)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Provides the functions available in GTK4 for navigating the widget hierarchy, such as getting the first, last, next, or previous sibling.

```APIDOC
Widgets Tree Navigation:

Navigate To | Function
--- | ---
first | `Gtk.Widget.get_first_child()`
last | `Gtk.Widget.get_last_child()`
next | `Gtk.Widget.get_next_sibling()`
previous | `Gtk.Widget.get_prev_sibling()`
```

--------------------------------

### Get Settings in prefs.js

Source: https://gjs.guide/extensions/development/preferences

Illustrates how to obtain GSettings within the preferences window script (`prefs.js`). It uses `this.getSettings()` with the appropriate schema ID to manage extension settings displayed in the preferences UI.

```js
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings('org.gnome.shell.extensions.example');
    }
}
```

--------------------------------

### GValue for GObject Property Access

Source: https://gjs.guide/guides/gobject/gvalue

Illustrates how GObject.Value is used with GObject.Object.get_property() and GObject.Object.set_property() to interact with object properties, particularly when a GValue container is required for passing values.

```javascript
const action = new Gio.SimpleAction({
    name: 'test',
    enabled: false,
});

// Create a new boolean GValue
const booleanValue = new GObject.Value();
booleanValue.init(GObject.TYPE_BOOLEAN);

// Get the GValue for a GObject property
action.get_property('enabled', booleanValue);
console.log(booleanValue.get_boolean());

// Set a GObject property from a GValue
booleanValue.set_boolean(true);
action.set_property('enabled', booleanValue);
```

--------------------------------

### St Toolkit Overview

Source: https://gjs.guide/extensions/overview/architecture

Describes the St toolkit, which extends Clutter to provide more complex widgets like buttons and text entries, and adds support for CSS styling.

```APIDOC
St:
  Description: Builds on Clutter to provide more complex widgets and CSS support.
  Widgets: Buttons, icons, text entries, scrollable areas.
  Features: Adds support for CSS styling programmatically or from stylesheets.
  Reference: https://gjs-docs.gnome.org/#q=st
```

--------------------------------

### St.Button State Handling

Source: https://gjs.guide/extensions/development/accessibility

St.Button manages accessibility states like CHECKED based on its toggle mode and checked property, often by applying CSS pseudo-classes.

```APIDOC
St.Button:toggle-mode
  - Property to enable toggle functionality for the button.

St.Button:checked
  - Property indicating if the button is currently checked.
  - Changes to this property update the Atk.StateType.CHECKED state and CSS pseudo-classes.
```

--------------------------------

### Get User Configuration Directory

Source: https://gjs.guide/guides/gtk/3/15-saving-data

Retrieves the user's local configuration directory path using GLib. This ensures cross-platform compatibility for storing application settings and data.

```javascript
let dataDir = GLib.get_user_config_dir();
```

--------------------------------

### GJS ESLint Configuration

Source: https://gjs.guide/guides/gjs/style-guide

This configuration sets up ESLint for a GJS project, enabling specific ECMAScript versions and applying recommended rules. It includes custom restrictions for GJS development, such as disallowing certain globals and properties, and enforcing modern JavaScript syntax.

```javascript
/** @type {import("eslint").Linter.Config} */
// SPDX-FileCopyrightText: No rights reserved

module.exports = {
  env: {
    es2021: true
  },
  extends: 'eslint:recommended',
  rules: {
    // See: https://eslint.org/docs/latest/rules/#possible-problems
    'array-callback-return': 'error',
    'no-await-in-loop': 'error',
    'no-constant-binary-expression': 'error',
    'no-constructor-return': 'error',
    //'no-duplicate-imports': 'error',
    'no-new-native-nonconstructor': 'error',
    'no-promise-executor-return': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-unused-private-class-members': 'error',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: true
      }
    ],
    // See: https://eslint.org/docs/latest/rules/#suggestions
    'block-scoped-var': 'error',
    complexity: 'warn',
    'consistent-return': 'error',
    'default-param-last': 'error',
    eqeqeq: 'error',
    'no-array-constructor': 'error',
    'no-caller': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-loop-func': 'error',
    'no-multi-assign': 'warn',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-proto': 'error',
    'no-shadow': 'warn',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],
    'no-var': 'warn',
    'unicode-bom': 'error',
    // GJS Restrictions
    'no-restricted-globals': [
      'error',
      {
        name: 'Debugger',
        message: 'Internal use only'
      },
      {
        name: 'GIRepositoryGType',
        message: 'Internal use only'
      },
      {
        name: 'log',
        message: 'Use console.log()'
      },
      {
        name: 'logError',
        message: 'Use console.warn() or console.error()'
      }
    ],
    'no-restricted-properties': [
      'error',
      {
        object: 'imports',
        property: 'format',
        message: 'Use template strings'
      },
      {
        object: 'pkg',
        property: 'initFormat',
        message: 'Use template strings'
      },
      {
        object: 'Lang',
        property: 'copyProperties',
        message: 'Use Object.assign()'
      },
      {
        object: 'Lang',
        property: 'bind',
        message: 'Use arrow notation or Function.prototype.bind()'
      },
      {
        object: 'Lang',
        property: 'Class',
        message: 'Use ES6 classes'
      }
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: '>-\n        MethodDefinition[key.name="_init"]\n        CallExpression[arguments.length<=1][callee.object.type="Super"][callee.property.name="_init"]
        ',
        message: 'Use constructor() and super()'
      }
    ]
  }
};

```

--------------------------------

### ExtensionMeta Object Structure

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Defines the structure of the `ExtensionMeta` object, which is passed to the `init()` function of GJS extensions. This object contains metadata about the extension, its UUID, directory, and status.

```APIDOC
/**
 * @typedef ExtensionMeta
 * @type {object}
 * @property {object} metadata - the metadata.json file, parsed as JSON
 * @property {string} uuid - the extension UUID
 * @property {number} type - the extension type; `1` for system, `2` for user
 * @property {Gio.File} dir - the extension directory
 * @property {string} path - the extension directory path
 * @property {string} error - an error message or an empty string if no error
 * @property {boolean} hasPrefs - whether the extension has a preferences dialog
 * @property {boolean} hasUpdate - whether the extension has a pending update
 * @property {boolean} canChange - whether the extension can be enabled/disabled
 * @property {string[]} sessionModes - a list of supported session modes
 */
```

--------------------------------

### Clutter Toolkit Overview

Source: https://gjs.guide/extensions/overview/architecture

Explains the Clutter toolkit, which is more abstract than GTK and used by Mutter and GNOME Shell. It details the concept of 'Actors' and their capabilities.

```APIDOC
Clutter:
  Description: A toolkit used by Mutter and GNOME Shell, more abstract than GTK.
  Widgets: Called Actors.
  Actor Properties: Basic properties and signals expected from a base widget.
  Layout: Can contain other actors using layout managers.
  Features: Built-in support for animations and other effects.
  Reference: https://gjs-docs.gnome.org/#q=clutter
```

--------------------------------

### GLib Event Priority Example

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Compares the dispatch order of two timeout sources with different priorities (`GLib.PRIORITY_DEFAULT_IDLE` vs. `GLib.PRIORITY_DEFAULT`). The source with the lower numerical priority (higher actual priority) is executed first.

```js
import GLib from 'gi://GLib';

const loop = new GLib.MainLoop(null, false);

const idleId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT_IDLE, 1, () => {
    console.log('idle source');

    return GLib.SOURCE_REMOVE;
});

const defaultId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    console.log('default source');

    return GLib.SOURCE_REMOVE;
});

await loop.runAsync();
```

--------------------------------

### GObject Notification Freezing API

Source: https://gjs.guide/guides/gobject/advanced

API documentation for managing GObject property change notifications. These methods help in batching property updates to reduce signal emissions.

```APIDOC
GObject.Object.freeze_notify()
  - Freezes change notifications for the object.
  - Subsequent property changes will not emit 'notify' signals until thaw_notify() is called.

GObject.Object.thaw_notify()
  - Thaws change notifications for the object.
  - If notifications were frozen, a single 'notify' signal may be emitted for all batched changes.

GObject.Object::notify
  - Signal emitted when a property of the object changes.
  - Parameters:
    - object: The object emitting the signal.
    - pspec: The GObject.ParamSpec of the changed property.
  - See: https://gjs-docs.gnome.org/gobject20/gobject.object#method-freeze_notify
  - See: https://gjs-docs.gnome.org/gobject20/gobject.object#method-thaw_notify
  - See: https://gjs-docs.gnome.org/gobject20/gobject.object#signal-notify
```

--------------------------------

### GObject Property Introspection API

Source: https://gjs.guide/guides/gobject/advanced

API documentation for GObject property introspection methods. These functions allow developers to inspect the properties of GObject classes and instances programmatically.

```APIDOC
GObject.Object.list_properties()
  - Lists all properties for a GObject class.
  - Returns: An array of GObject.ParamSpec objects.

GObject.Object.find_property(name: string)
  - Looks up a property by its canonical name for a GObject class.
  - Parameters:
    - name: The canonical name of the property to find.
  - Returns: A GObject.ParamSpec object if found, otherwise null.

GObject.ParamSpec
  - Represents the specification of a GObject property.
  - Properties:
    - name: The name of the property.
    - type: The type of the property.
    - flags: Flags indicating property behavior.
    - default_value: The default value of the property.
    - nick: A short, human-readable name for the property.
    - blurb: A longer, human-readable description of the property.
  - See: https://gjs-docs.gnome.org/gobject20/gobject.paramspec
```

--------------------------------

### GtkPasswordEntry Example

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates the usage of GtkPasswordEntry, a GTK4 widget specifically designed for password input fields. It includes the 'show-peek-icon' property to enable toggling the visibility of the entered text.

```xml
<object class="GtkPasswordEntry">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="show-peek-icon">1</property>
    <property name="placeholder-text" translatable="yes">Text</property>
</object>
```

--------------------------------

### Running the Gtk.Application

Source: https://gjs.guide/guides/gtk/3/10-building-app

Initiates the Gtk.Application's main event loop, allowing it to process signals and display its user interface. This replaces the traditional Gtk.init() and Gtk.main() calls.

```js
application.run(null);
```

--------------------------------

### Get Settings in extension.js

Source: https://gjs.guide/extensions/development/preferences

Demonstrates how to retrieve GSettings within the main extension script (`extension.js`). It calls `this.getSettings()` with the schema ID, typically within the `enable()` method, to access extension preferences.

```js
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ExampleExtension extends Extension {
    enable() {
        this._settings = this.getSettings('org.gnome.shell.extensions.example');
    }

    disable() {
        this._settings = null;
    }
}
```

--------------------------------

### DeepUnpack GLib Variant (js)

Source: https://gjs.guide/guides/glib/gvariant

Illustrates GLib.Variant.prototype.deepUnpack() for unpacking a variant and its children up to one level. Examples show its behavior with string arrays and dictionaries containing mixed types.

```js
import GLib from 'gi://GLib';

// Expected output here is:
//   "one","two"
const variantStrv = GLib.Variant.new_strv(['one', 'two']);
print(variantStrv.deepUnpack());

// Expected result here is:
//   {
//     "key1": "value1",
//     "key2": "value2"
//   }
const shallowDict = new GLib.Variant('a{ss}', {
    'key1': 'value1',
    'key2': 'value2',
});

const shallowDictUnpacked = shallowDict.deepUnpack();

// Expected result here is:
//   {
//     "key1": [object variant of type "s"],
//     "key2": [object variant of type "b"]
//   }
const deepDict = new GLib.Variant('a{sv}', {
    'key1': GLib.Variant.new_string('string'),
    'key2': GLib.Variant.new_boolean(true),
});

const deepDictUnpacked = deepDict.deepUnpack();
```

--------------------------------

### GJS Modal Dialog Creation and Management

Source: https://gjs.guide/extensions/topics/dialogs

This snippet shows how to create a modal dialog using GJS. It covers initializing the dialog, connecting to 'closed' and 'destroy' events for cleanup and reminders, adding custom widgets like list sections and items, and defining action buttons. Dependencies include GLib, St, and specific UI components from the GNOME Shell UI library.

```javascript
import GLib from 'gi://GLib';
import St from 'gi://St';

import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';

// Creating a modal dialog
let testDialog = new ModalDialog.ModalDialog({
    destroyOnClose: false,
    styleClass: 'my-dialog',
});

let reminderId = null;
let closedId = testDialog.connect('closed', () => {
    console.debug('The dialog was dismissed, so set a reminder');

    if (!reminderId) {
        reminderId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60,
            () => {
                testDialog.open(global.get_current_time());

                reminderId = null;
                return GLib.SOURCE_REMOVE;
            });
    }
});

testDialog.connect('destroy', () => {
    console.debug('The dialog was destroyed, so reset everything');

    if (closedId) {
        testDialog.disconnect(closedId);
        closedId = null;
    }

    if (reminderId) {
        GLib.Source.remove(reminderId);
        reminderId = null;
    }

    testDialog = null;
});

// Adding a widget to the content area
const listLayout = new Dialog.ListSection({
    title: 'Todo List',
});
testDialog.contentLayout.add_child(listLayout);

const taskOne = new Dialog.ListSectionItem({
    icon_actor: new St.Icon({icon_name: 'dialog-information-symbolic'}),
    title: 'Task One',
    description: 'The first thing I need to do',
});
listLayout.list.add_child(taskOne);

const taskTwo = new Dialog.ListSectionItem({
    icon_actor: new St.Icon({icon_name: 'dialog-information-symbolic'}),
    title: 'Task Two',
    description: 'The next thing I need to do',
});
listLayout.list.add_child(taskTwo);

// Adding buttons
testDialog.setButtons([
    {
        label: 'Close',
        action: () => testDialog.destroy(),
    },
    {
        label: 'Later',
        isDefault: true,
        action: () => testDialog.close(global.get_current_time()),
    },
]);

```

--------------------------------

### Get GTK Widget Properties in GJS

Source: https://gjs.guide/guides/gtk/3/02-widgets

Shows how to retrieve the value of a widget's property by accessing it directly on the widget object. Properties are accessed using their lowerCamelCase names.

```javascript
let iconName = image.iconName;
let buttonText = button.text;
```

--------------------------------

### Position Quick Settings Items Relative to Background Apps

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Provides a function to add multiple items to the Quick Settings menu and then reposition them to appear above the 'Background Apps' menu. This uses `QuickSettingsMenu._addItems` and `QuickSettingsMenu.menu._grid.set_child_below_sibling` for precise placement.

```javascript
function addQuickSettingsItems(items) {
    // Add the items with the built-in function
    QuickSettingsMenu._addItems(items);

    // Ensure the tile(s) are above the background apps menu
    for (const item of items) {
        QuickSettingsMenu.menu._grid.set_child_below_sibling(item,
            QuickSettingsMenu._backgroundApps.quickSettingsItems[0]);
    }
}
```

--------------------------------

### Implement Gio.ListModel Interface in GJS

Source: https://gjs.guide/guides/gobject/interfaces

Example of implementing the Gio.ListModel interface, which requires overriding virtual functions like vfunc_get_item, vfunc_get_item_type, and vfunc_get_n_items. It also shows custom methods for managing list items.

```javascript
const ArrayStore = GObject.registerClass({
    Implements: [Gio.ListModel],
}, class ArrayStore extends GObject.Object {
    #items = [];

    vfunc_get_item(position) {
        return this.#items[position] || null;
    }

    vfunc_get_item_type() {
        return GObject.Object;
    }

    vfunc_get_n_items() {
        return this.#items.length;
    }

    /**
     * Insert an item in the list. If @position is greater than the number of
     * items in the list or less than `0` it will be appended to the end of the
     * list.
     *
     * @param {GObject.Object} item - the item to add
     * @param {number} [position] - the position to add the item
     */
    insertItem(item, position = -1) {
        // Type check the item
        if (!(item instanceof GObject.Object))
            throw TypeError(`Not a GObject: ${item.constructor.name}`);

        if (!GObject.type_is_a(item.constructor.$gtype, this.get_item_type()))
            throw TypeError(`Invalid type: ${item.constructor.$gtype.name}`);

        // Normalize the position
        if (position < 0 || position > this.#items.length)
            position = this.#items.length;

        // Insert the item, then emit Gio.ListModel::items-changed
        this.#items.splice(position, 0, item);
        this.items_changed(position, 0, 1);
    }

    /**
     * Remove the item at @position. If @position is outside the length of the
     * list, this function does nothing.
     *
     * @param {number} position - the position of the item to remove
     */
    removeItem(position) {
        // NOTE: The Gio.ListModel interface will ensure @position is an
        //       unsigned integer, but other methods must check explicitly.
        if (position < 0 || position >= this.#items.length)
            return;

        // Remove the item and emit Gio.ListModel::items-changed
        this.#items.splice(position, 1);
        this.items_changed(position, 1, 0);
    }
});
```

--------------------------------

### Implement GNOME Shell Extension Preferences (JavaScript)

Source: https://gjs.guide/extensions/topics/extension

Shows how to implement extension preferences by overriding the `fillPreferencesWindow` method. This example creates a preferences page with a group and a switch row, binding it to a GSettings key for user configuration.

```js
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension'),
        });
        page.add(group);

        // Create a new preferences row
        const row = new Adw.SwitchRow({
            title: _('Show Indicator'),
            subtitle: _('Whether to show the panel indicator'),
        });
        group.add(row);

        // Create a settings object and bind the row to the `show-indicator` key
        window._settings = this.getSettings();
        window._settings.bind('show-indicator', row, 'active',
            Gio.SettingsBindFlags.DEFAULT);
    }
}
```

--------------------------------

### ATK/Clutter Object Relationships

Source: https://gjs.guide/extensions/development/accessibility

Manage relationships between accessible objects using ATK and Clutter. This allows for linking elements like labels to the widgets they describe, or establishing other meaningful connections.

```APIDOC
Clutter.Actor.get_accessible()
  - Retrieves the Atk.Object associated with a Clutter.Actor.
  - Returns: The Atk.Object instance.

Atk.Object.add_relationship(relationship_type, target_object)
  - Adds a relationship between this object and a target object.
  - Parameters:
    - relationship_type: An Atk.RelationType specifying the type of relationship.
    - target_object: The Atk.Object to relate to.
  - Returns: void

Atk.Object.remove_relationship(relationship_type, target_object)
  - Removes a relationship between this object and a target object.
  - Parameters:
    - relationship_type: An Atk.RelationType specifying the type of relationship.
    - target_object: The Atk.Object to remove the relationship with.
  - Returns: void
```

--------------------------------

### GValue Type Checking

Source: https://gjs.guide/guides/gobject/gvalue

Shows how to verify the type held by a GObject.Value using GObject.type_check_value_holds. This is useful for ensuring a GValue contains the expected data type before accessing its contents.

```javascript
const doubleValue = new GObject.Value();
doubleValue.init(GObject.TYPE_DOUBLE);

if (GObject.type_check_value_holds(doubleValue, GObject.TYPE_DOUBLE))
    console.log('GValue initialized to hold double values');

if (!GObject.type_check_value_holds(doubleValue, GObject.TYPE_STRING))
    console.log('GValue not initialized to hold string values');
```

--------------------------------

### Application Activation and Window Presentation

Source: https://gjs.guide/guides/gtk/3/10-building-app

Connects to the 'activate' signal of the Gtk.Application to handle window creation and presentation. It ensures a window exists before presenting it, creating a new one if necessary.

```js
application.connect('activate', app => {
    let activeWindow = app.activeWindow;

    if (!activeWindow) {
        let imageViewerWindow = new ImageViewerWindow(app);
        activeWindow = imageViewerWindow.getWidget();
    }

    activeWindow.present();
});

...
```

--------------------------------

### ResultMeta Object Specification

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Defines the `ResultMeta` object structure for GNOME Shell search providers. This object represents a search result and includes properties for identification, display, and interaction.

```javascript
/**
 * @typedef ResultMeta
 * @type {object}
 * @property {string} id - the unique identifier of the result
 * @property {string} name - the name of the result
 * @property {string} [description] - optional description of the result
 * @property {string} [clipboardText] - optional clipboard content
 * @property {Function} createIcon - creates an icon for the result
 */

// The `id` is the result identifier, as returned by the provider.
// The `name` property holds a name or short description of the result.
// The `description` property is optional, holding a longer description of the result that is only displayed in the list view.
// The `clipboardText` property is optional, holding text that will be copied to the clipboard if the result is activated.
```

--------------------------------

### Signal Callback Return Values (Boolean)

Source: https://gjs.guide/guides/gobject/basics

Explains how signal callbacks can return values, often booleans, to control signal emission behavior. This example connects to an 'activate-link' signal and returns `true` to ignore file URIs, preventing default link activation.

```js
const linkLabel = new Gtk.Label({
    label: '<a href="https://www.gnome.org">GNOME</a>',
    use_markup: true,
});

linkLabel.connect('activate-link', (label, uri) => {
    if (uri.startsWith('file://')) {
        console.log(`Ignoring ${uri}`);
        return true;
    }

    return false;
});
```

--------------------------------

### ATK/St Widget States Management

Source: https://gjs.guide/extensions/development/accessibility

Manage the states of accessible widgets using ATK and St. States define the current condition of an element, such as whether it is sensitive, visible, or focusable.

```APIDOC
St.Widget.add_accessible_state(state)
  - Adds an accessible state to the widget.
  - Parameters:
    - state: An Atk.StateType to add.
  - Returns: void

St.Widget.remove_accessible_state(state)
  - Removes an accessible state from the widget.
  - Parameters:
    - state: An Atk.StateType to remove.
  - Returns: void
```

--------------------------------

### GJS SimpleAction: Stateful Actions with Validation

Source: https://gjs.guide/guides/gio/actions-and-menus

Illustrates creating stateful actions using `Gio.SimpleAction` in GJS, allowing for state management and validation. It shows how to set an initial state, define a state hint for validation, and handle state changes via the 'change-state' signal.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/*
 * The value type of a stateful action is set at construction from the initial
 * value, and can't be changed afterwards.
 */
const stateAction = new Gio.SimpleAction({
    name: 'stateAction',
    state: GLib.Variant.new_int32(-1),
    state_hint: new GLib.Variant('(ii)', [-1, GLib.MAXINT32]),
});

/*
 * The state will only change once the handler has approved the request.
 */
stateAction.connect('notify::state', (action, _pspec) => {
    console.log(`${action.name} state changed: ${action.state.print(true)}`);
});

/*
 * The handler may check for equality, and use the hint to validate the request.
 */
stateAction.connect('change-state', (action, value) => {
    console.log(`${action.name} change request: ${value.print(true)}`);

    if (action.state.equal(value))
        return;

    const [min, max] = action.state_hint.deepUnpack();
    const request = value.unpack();

    if (request >= min && request <= max)
        action.set_state(value);
});

```

--------------------------------

### GJS Translation String Formatting

Source: https://gjs.guide/extensions/development/translations

This example demonstrates how to define translatable strings in GJS using `gettext` functions, including support for pluralization. The `javascript-format` tag indicates that the string itself is formatted for JavaScript.

```javascript
msgid "You have been notified %d time"
msgid_plural "You have been notified %d times"

```

--------------------------------

### Declare Dependencies with pkg.require

Source: https://gjs.guide/guides/gtk/3/11-packaging

This snippet demonstrates how to declare expected versions for imported libraries using the global `pkg` utility object. It's crucial to place this declaration before using or importing any library, typically at the start of a file, serving as a replacement for `imports.gi.versions`.

```javascript
pkg.require({
    'Gtk': '3.0',
    'Gio': '2.0'
});
```

--------------------------------

### Adding Action Button to Quick Settings (GJS)

Source: https://gjs.guide/extensions/topics/quick-settings

Provides the method for manually adding a custom action button, such as the `ExampleButton`, to the top action area of the GNOME Shell quick settings menu. It accesses the relevant panel components to append the new button.

```javascript
const QuickSettingsMenu = Main.panel.statusArea.quickSettings;
const QuickSettingsActions = QuickSettingsMenu._system._indicator.child;

QuickSettingsActions.add_child(new ExampleButton());

```

--------------------------------

### GJS GObject ParamSpec for Boolean Properties

Source: https://gjs.guide/guides/gobject/subclassing

Shows the creation of a GObject.ParamSpec for a boolean property in GJS. It defines the property name, display name, description, flags, and a default value.

```javascript
GObject.ParamSpec.boolean(
    'boolean-property',
    'Boolean Property',
    'A property holding a true or false value',
    GObject.ParamFlags.READWRITE,
    true
);
```

--------------------------------

### Add Action Button to Quick Settings

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Shows how to create a custom action button for the top section of the GNOME Shell quick settings menu. This involves extending `QuickSettings.QuickSettingsItem` and adding it to the menu using `QuickSettingsActions.add_child`.

```javascript
const FeatureButton = GObject.registerClass(
class FeatureButton extends QuickSettings.QuickSettingsItem {
    _init() {
        super._init({
            style_class: 'icon-button',
            can_focus: true,
            icon_name: 'selection-mode-symbolic',
            accessible_name: 'Feature',
        });

        this.connect('clicked', () => console.log('activated'));

        // Adding an action button to the Quick Settings menu
        QuickSettingsActions.add_child(this);
    }
});
```

--------------------------------

### Dialog.ListSectionItem API (JavaScript)

Source: https://gjs.guide/extensions/topics/dialogs

Provides API details for ListSectionItem, a widget used within Dialog.ListSection to display individual list entries. It outlines the constructor and its parameters for setting an icon, title, and description for each item.

```APIDOC
Dialog.ListSectionItem:
  Parent Class: St.BoxLayout

  new Dialog.MessageDialogContent(params)
    - Constructor for ListSectionItem. Note: The provided text incorrectly states `MessageDialogContent` as the constructor name here.
    - Parameters:
      - params (Object): A dictionary of GObject construct properties, typically including:
        - icon_actor (St.Icon): An actor to display as an icon for the item.
        - title (String): The main title for the list item.
        - description (String): A secondary description for the list item.
```

--------------------------------

### ESLint Configuration for GJS Projects

Source: https://gjs.guide/guides/gjs/style-guide

This snippet shows the `.eslintrc.yml` configuration file used for GJS projects. It helps maintain code quality and enforce coding standards by integrating with ESLint, a popular JavaScript linter. Placing this file in your project root enables real-time diagnostics in IDEs.

```yml
# SPDX-License-Identifier: CC0-1.0

```

--------------------------------

### TypeScript: GNOME Extension Preferences Window Setup

Source: https://gjs.guide/extensions/development/typescript

Demonstrates setting up a GNOME Shell extension's preferences window using TypeScript. It utilizes Gtk and Adw widgets, binding them to application settings for persistence. This snippet shows how to create preference pages, groups, and input rows.

```typescript
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GnomeRectanglePreferences extends ExtensionPreferences {
  _settings?: Gio.Settings

  fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
    this._settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: _('General'),
      iconName: 'dialog-information-symbolic',
    });

    const animationGroup = new Adw.PreferencesGroup({
      title: _('Animation'),
      description: _('Configure move/resize animation'),
    });
    page.add(animationGroup);

    const animationEnabled = new Adw.SwitchRow({
      title: _('Enabled'),
      subtitle: _('Wether to animate windows'),
    });
    animationGroup.add(animationEnabled);

    const paddingGroup = new Adw.PreferencesGroup({
      title: _('Paddings'),
      description: _('Configure the padding between windows'),
    });
    page.add(paddingGroup);

    const paddingInner = new Adw.SpinRow({
      title: _('Inner'),
      subtitle: _('Padding between windows'),
      adjustment: new Gtk.Adjustment({
        lower: 0,
        upper: 1000,
        stepIncrement: 1
      })
    });
    paddingGroup.add(paddingInner);

    window.add(page)

    this._settings!.bind('animate', animationEnabled, 'active', Gio.SettingsBindFlags.DEFAULT);
    this._settings!.bind('padding-inner', paddingInner, 'value', Gio.SettingsBindFlags.DEFAULT);

    return Promise.resolve();
  }
}
```

--------------------------------

### GNOME Shell Extension Registration

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Demonstrates the standard pattern for registering and unregistering a search provider within a GNOME Shell extension. The `enable()` function registers the provider, and `disable()` handles its unregistration.

```js
class Extension {
    enable() {
        this._provider = new SearchProvider();
        SearchResults._registerProvider(this._provider);
    }

    disable() {
        if (this._provider) {
            SearchResults._unregisterProvider(this._provider);
            this._provider = null;
        }
    }
}

/** */
function init() {
    return new Extension();
}
```

--------------------------------

### GNOME Shell 45+ Extension Initialization

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Demonstrates the standard initialization pattern for GNOME Shell extensions in version 45 and later. It shows the `Extension` class structure and the `constructor` method, emphasizing what operations are disallowed during initialization.

```js
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ExampleExtension extends Extension {
    constructor(metadata) {
        super(metadata);

        // DO NOT create objects, connect signals or add main loop sources here
    }

    enable() {
        // Create objects, connect signals, create main loop sources, etc.
    }

    disable() {
        // Destroy objects, disconnect signals, remove main loop sources, etc.
    }
}
```

--------------------------------

### D-Bus Interface Definition Schema

Source: https://gjs.guide/guides/gio/dbus

An example of a D-Bus interface definition written in XML. This schema specifies methods, properties, and signals that a D-Bus service can expose, adhering to D-Bus API design guidelines.

```xml
<node>
  <interface name="guide.gjs.Test">
    <method name="SimpleMethod"/>
    <method name="ComplexMethod">
      <arg type="s" direction="in" name="input"/>
      <arg type="u" direction="out" name="length"/>
    </method>
    <property name="ReadOnlyProperty" type="s" access="read"/>
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
  </interface>
</node>
```

--------------------------------

### GJS: Create a LinkButton to Open a URI

Source: https://gjs.guide/guides/gtk/3/07-buttons

Provides an example of a Gtk.LinkButton, which is a button that opens a specified URI when clicked. It functions like a regular button but navigates to a web link or opens a default application for the URI. Requires Gtk module and GTK initialization.

```javascript
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.LinkButton({
    label: 'Open Me!',
    uri: 'https://gnome.org'
});
button.connect('clicked', () => {
    log('Visit me!');
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();

```

--------------------------------

### Adding Slider to Quick Settings Panel (GJS)

Source: https://gjs.guide/extensions/topics/quick-settings

Illustrates how to add a custom slider component, like the `ExampleSlider`, to the GNOME Shell quick settings panel. It shows how to create a `SystemIndicator` and add the slider to it, specifying that it should span two columns for layout.

```javascript
const myIndicator = new QuickSettings.SystemIndicator();
myIndicator.quickSettingsItems.push(new ExampleSlider());

Main.panel.statusArea.quickSettings.addExternalIndicator(myIndicator, 2);

```

--------------------------------

### GJS: Subclassing GObject with registerClass

Source: https://gjs.guide/guides/gobject/subclassing

Demonstrates how to subclass GObject in GJS using `GObject.registerClass`. This includes defining a `GTypeName`, `Properties`, and `Signals`. Note the change in constructor chaining from GJS 1.72 onwards.

```javascript
import GObject from 'gi://GObject';

const SubclassExample = GObject.registerClass({
    GTypeName: 'SubclassExample',
    Properties: {
        'example-property': GObject.ParamSpec.boolean(
            'example-property',
            'Example Property',
            'A read-write boolean property',
            GObject.ParamFlags.READWRITE,
            true
        ),
    },
    Signals: {
        'example-signal': {},
    },
}, class SubclassExample extends GObject.Object {
    constructor(constructProperties = {}) {
        super(constructProperties);
    }

    get example_property() {
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        if (this.example_property === value)
            return;

        this._example_property = value;
        this.notify('example-property');
    }
});
```

--------------------------------

### Construct Gtk.Label with Static Method

Source: https://gjs.guide/guides/gobject/basics

Shows how to create a Gtk.Label using a static constructor method, `new_with_mnemonic`, which is common for specific initializations.

```javascript
const saveLabel = Gtk.Label.new_with_mnemonic('_Save');
```

--------------------------------

### GJS: Create Gio.File from Path

Source: https://gjs.guide/guides/gio/file-operations

This example shows how to create a Gio.File object representing a file on the local filesystem using its path. It utilizes GLib.build_filenamev for constructing platform-independent file paths and Gio.File.new_for_path to instantiate the file object.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// This is a useful method for building file paths from GLib. It will use the
// correct path separator for the current operating system (eg. `/` or `\`)
const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'test-file.txt']);

const file = Gio.File.new_for_path(filepath);
```

--------------------------------

### GJS GObject ParamSpec for String Properties

Source: https://gjs.guide/guides/gobject/subclassing

Demonstrates how to define a GObject.ParamSpec for a string property in GJS. This includes setting the property name, display name, description, flags, and a default string value.

```javascript
GObject.ParamSpec.string(
    'string-property',
    'String Property',
    'A property holding a string value',
    GObject.ParamFlags.READWRITE,
    'default string'
);
```

--------------------------------

### Define GObject ParamSpec for Object Property

Source: https://gjs.guide/guides/gobject/subclassing

Demonstrates how to create a GObject.ParamSpec for properties that hold objects derived from GObject. It requires specifying the expected GObject type, which can be a super-class.

```js
GObject.ParamSpec.object(
    'object-property',
    'GObject Property',
    'A property holding an object derived from GObject',
    GObject.ParamFlags.READWRITE,
    GObject.Object);

```

--------------------------------

### GtkImage with Custom Icon

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Example of defining a GtkImage in XML to display a custom icon. This requires the icon file to be placed in a specific directory structure and the icon theme's search path to be updated.

```XML
<object class="GtkImage">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <property name="icon-name">myextension-logo-symbolic</property>
    <property name="icon-size">1</property>
</object>
```

--------------------------------

### Import Versioned GI Libraries (Old vs New)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Shows how to import specific versions of GI libraries, illustrating the shift from setting `imports.gi.versions` to specifying the version directly in the `gi://` URI.

```javascript
// Before GNOME 45
imports.gi.versions.Soup = '3.0';
const Soup = imports.gi.Soup;

// GNOME 45
import Soup from 'gi://Soup?version=3.0';
```

--------------------------------

### ESLint Configuration Rules

Source: https://gjs.guide/guides/gjs/style-guide

Configuration for ESLint, specifying rules for JavaScript code quality. It includes settings for restricted syntax like 'no-restricted-syntax' for specific patterns and messages for code improvements.

```js
[
    {
        'object': 'Lang',
        'property': 'copyProperties',
        'message': 'Use Object.assign()',
    },
    {
        'object': 'Lang',
        'property': 'bind',
        'message': 'Use arrow notation or Function.prototype.bind()',
    },
    {
        'object': 'Lang',
        'property': 'Class',
        'message': 'Use ES6 classes',
    },
],
'no-restricted-syntax': [
    'error',
    {
        'selector': 'MethodDefinition[key.name="_init"] CallExpression[arguments.length<=1][callee.object.type="Super"][callee.property.name="_init"]',
        'message': 'Use constructor() and super()',
    },
],

```

--------------------------------

### EditorConfig Configuration

Source: https://gjs.guide/guides/gjs/style-guide

The `.editorconfig` file for the GJS project, specifying editor preferences like indentation style, character set, and whitespace handling. This ensures consistent formatting across different IDEs and editors.

```ini
# SPDX-License-Identifier: MIT OR LGPL-2.0-or-later
# SPDX-FileCopyrightText: 2021 Sonny Piers <sonny@fastmail.net>

# EditorConfig is awesome: https://EditorConfig.org

root = true

[*]
indent_style = space
indent_size = 4
charset = utf-8
trim_trailing_whitespace = true
end_of_line = lf
insert_final_newline = true

[*.js]
quote_type = single

```

--------------------------------

### GJS: Handling Callbacks with Arrow Functions and bind

Source: https://gjs.guide/guides/gjs/style-guide

Demonstrates using arrow functions for inline callbacks and Function.prototype.bind() for larger callback functions within GJS classes. This is useful for managing context in event handlers.

```javascript
class MyClock {
    constructor() {
        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.interface',
        });

        this._settings.connect('changed::clock-show-seconds', () => {
            this.showSeconds = this._settings.get_boolean('clock-show-seconds');
        });

        this._settings.connect('changed::clock-show-weekdays',
            this._onShowWeekdaysChanged.bind(this));
    }

    _onShowWeekdaysChanged() {
        this.showWeekdays = this._settings.get_boolean('clock-show-weekdays');
    }
}
```

--------------------------------

### GJS: Basic Gio.Subprocess Usage

Source: https://gjs.guide/guides/gio/subprocesses

Illustrates the basic creation and execution of a subprocess using `Gio.Subprocess.new()`. It shows how to pass command arguments and specify I/O pipe flags, and how to immediately terminate the process.

```js
import Gio from 'gi://Gio';

try {
    // The process starts running immediately after this function is called. Any
    // error thrown here will be a result of the process failing to start, not
    // the success or failure of the process itself.
    const proc = Gio.Subprocess.new(
        // The program and command options are passed as a list of arguments
        ['ls', '-l', '/'],

        // The flags control what I/O pipes are opened and how they are directed
        Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
    );

    // Once the process has started, you can end it with `force_exit()`
    proc.force_exit();
} catch (e) {
    logError(e);
}
```

--------------------------------

### GJS Timers API Support

Source: https://gjs.guide/guides/gjs/intro

Starting with GJS 1.70, the Timers API is available, following the WHATWG HTML Standard for timers. Functions like setTimeout, setInterval, clearTimeout, and clearInterval are globally accessible, enabling asynchronous execution control.

```APIDOC
Timers API:
  Available globally without import.
  Implements WHATWG HTML Standard Timers.
  Methods: setTimeout, setInterval, clearTimeout, clearInterval.
  Example:
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
      console.log(`Tick: ${counter}`);
      if (counter >= 3) {
        clearInterval(intervalId);
        console.log('Interval cleared.');
      }
    }, 1000);
```

--------------------------------

### Backlight Quick Settings Integration

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

A new section for keyboard backlight control has been added to the quick settings panel.

```javascript
// Direct Access: /ui/main.js/panel.statusArea.quickSettings._backlight
// Created In: /ui/panel.js/QuickSettings._init()
// Style Class: .keyboard-brightness-item
```

--------------------------------

### GJS: Declaring Variables with const and let

Source: https://gjs.guide/guides/gjs/style-guide

Illustrates the use of 'const' for immutable bindings and 'let' for mutable variables in GJS loops. It advises against using 'var' due to its hoisting behavior.

```javascript
const elementCount = 10;
const elements = [];

for (let i = 0; i < elementCount; i++)
    elements.push(i);

for (const element of elements)
    console.log(`Element #${element + 1}`);
```

--------------------------------

### Connect, Emit, and Disconnect GObject Signals (GJS)

Source: https://gjs.guide/guides/gobject/subclassing

Demonstrates the lifecycle of a GObject signal: connecting a callback handler using 'connect', emitting the signal with 'emit', and disconnecting the handler using 'disconnect' with its ID.

```js
const signalsExample = new SignalsExample();

// Connecting to the signal
const handlerId = signalsExample.connect('example-signal',
    () => console.log('example-signal emitted!'));

// Emitting the signal
signalsExample.emit('example-signal');

// Disconnecting from the signal
signalsExample.disconnect(handlerId);
```

--------------------------------

### GNOME Translation Implementation (JavaScript)

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Demonstrates implementing internationalization (i18n) for GNOME Shell extensions across different GNOME versions (40+). It showcases Gettext functions (`_()`, `ngettext()`, `pgettext()`) for marking strings and handling pluralization, along with setting up panel menu items with translatable content.

```js
const Gettext = imports.gettext;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

// Get all the Gettext functions, while aliasing `gettext()` as `_()`
const {
    gettext: _, 
    ngettext,
    pgettext,
} = ExtensionUtils;

class Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, Me.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(Me.metadata.uuid, this._indicator);

        // A string needing more context is marked with `pgettext()`
        this._indicator.menu.addAction(pgettext('menu item', 'Notify'), () => {
            this._count += 1;

            // A regular translatable string is marked with the `_()` function
            const title = _('Notification');

            // A "countable" string is marked with the `ngettext()` function
            const body = ngettext('You have been notified %d time',
                'You have been notified %d times',
                this._count).format(this._count);

            Main.notify(title, body);
        });

        this._count = 0;
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}

function init() {
    // If the `gettext-domain` key is not set in `metadata.json`, you must
    // pass the unique Gettext domain for your extension when initializing.
    ExtensionUtils.initTranslations(Me.metadata.uuid);

    return new Extension();
}

```

```js
const Gettext = imports.gettext;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

// This creates an object with functions for marking strings as translatable.
// You must pass the same domain as `ExtensionUtils.initTranslations()`.
const Domain = Gettext.domain(Me.metadata.uuid);

// Get all the Gettext functions, while aliasing `gettext()` as `_()`
const {
    gettext: _, 
    ngettext,
    pgettext,
} = Domain;

class Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, Me.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(Me.metadata.uuid, this._indicator);

        // A string needing more context is marked with `pgettext()`
        this._indicator.menu.addAction(pgettext('menu item', 'Notify'), () => {
            this._count += 1;

            // A regular translatable string is marked with the `_()` function
            const title = _('Notification');

            // A "countable" string is marked with the `ngettext()` function
            const body = ngettext('You have been notified %d time',
                'You have been notified %d times',
                this._count).format(this._count);

            Main.notify(title, body);
        });

        this._count = 0;
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}

function init() {
    // If the `gettext-domain` key is not set in `metadata.json`, you must
    // pass the unique Gettext domain for your extension when initializing.
    ExtensionUtils.initTranslations(Me.metadata.uuid);

    return new Extension();
}

```

--------------------------------

### GNOME Shell Search Provider Interface (JavaScript)

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Defines the interface for creating custom search providers in GNOME Shell extensions. This class outlines methods for providing application info, managing search results, activating results, launching searches, and retrieving metadata for search items. It relies on GNOME Shell's internal APIs.

```javascript
class SearchProvider {
    /**
     * The application of the provider.
     *
     * Applications will return a `Gio.AppInfo` representing themselves.
     * Extensions will usually return `null`.
     *
     * @type {Gio.AppInfo}
     */
    get appInfo() {
        return null;
    }

    /**
     * Whether the provider offers detailed results.
     *
     * Applications will return `true` if they have a way to display more
     * detailed or complete results. Extensions will usually return `false`.
     *
     * @type {boolean}
     */
    get canLaunchSearch() {
        return false;
    }

    /**
     * The unique ID of the provider.
     *
     * Applications will return their application ID. Extensions will usually
     * return their UUID.
     *
     * @type {string}
     */
    get id() {
        return imports.misc.extensionUtils.getCurrentExtension().uuid;
    }

    /**
     * Launch the search result.
     *
     * This method is called when a search provider result is activated.
     *
     * @param {string} result - The result identifier
     * @param {string[]} terms - The search terms
     */
    activateResult(result, terms) {
        console.debug(`activateResult(${result}, [${terms}])`);
    }

    /**
     * Launch the search provider.
     *
     * This method is called when a search provider is activated. A provider can
     * only be activated if the `appInfo` property holds a valid `Gio.AppInfo`
     * and the `canLaunchSearch` property is `true`.
     *
     * Applications will typically open a window to display more detailed or
     * complete results.
     *
     * @param {string[]} terms - The search terms
     */
    launchSearch(terms) {
        console.debug(`launchSearch([${terms}])`);
    }

    /**
     * Create a result object.
     *
     * This method is called to create an actor to represent a search result.
     *
     * Implementations may return any `Clutter.Actor` to serve as the display
     * result, or `null` for the default implementation.
     *
     * @param {ResultMeta} meta - A result metadata object
     * @returns {Clutter.Actor|null} An actor for the result
     */
    createResultObject(meta) {
        console.debug(`createResultObject(${meta.id})`);

        return null;
    }

    /**
     * Get result metadata.
     *
     * This method is called to get a `ResultMeta` for each identifier.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} results - The result identifiers
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<ResultMeta[]>} A list of result metadata objects
     */
    getResultMetas(results, cancellable) {
        console.debug(`getResultMetas([${results}])`);

        const {scaleFactor} = St.ThemeContext.get_for_stage(global.stage);

        return new Promise((resolve, reject) => {
            const cancelledId = cancellable.connect(
                () => reject(Error('Operation Cancelled')))
            ;

            const resultMetas = [];

            for (const identifier of results) {
                const meta = {
                    id: identifier,
                    name: 'Result Name',
                    description: 'The result description',
                    clipboardText: 'Content for the clipboard',
                    createIcon: size => {
                        return new St.Icon({
                            icon_name: 'dialog-information',
                            width: size * scaleFactor,
                            height: size * scaleFactor,
                        });
                    },
                };

                resultMetas.push(meta);
            }

            cancellable.disconnect(cancelledId);
            if (!cancellable.is_cancelled())
                resolve(resultMetas);
        });
    }

    /**
     * Initiate a new search.
     *
     * This method is called to start a new search and should return a list of
     * unique identifiers for the results.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<string[]>} A list of result identifiers
     */

```

--------------------------------

### GObject Signal Flags Reference (APIDOC)

Source: https://gjs.guide/guides/gobject/subclassing

Lists and describes common GObject.SignalFlags used to control signal emission behavior, including execution order and the ability to emit signals with specific details.

```APIDOC
GObject.SignalFlags:
  - RUN_FIRST: The default handler is invoked before user handlers.
  - RUN_LAST: The default handler is invoked after user handlers.
  - RUN_CLEANUP: The default handler is invoked after all other handlers, typically for cleanup.
  - DETAILED: Allows the signal to be emitted with an optional detail string (e.g., 'signal-name::detail'). Handlers can be connected to specific details.
```

--------------------------------

### GJS: Create a Toggleable Gtk.ToggleButton

Source: https://gjs.guide/guides/gtk/3/07-buttons

Shows how to create a Gtk.ToggleButton, which has an active and inactive state. The example connects to the 'clicked' signal to log the current active state of the button. It requires the Gtk module and GTK initialization.

```javascript
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.ToggleButton({ label: 'Toggle Me!' });
button.connect('clicked', () => {
    log(`The button is: ${button.get_active() ? 'active' : 'inactive'}!`);
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();

```

--------------------------------

### Extension Enable/Disable Logic

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Provides the core logic for enabling and disabling a GNOME Shell extension. It initializes and destroys a custom indicator, managing its lifecycle within the extension's enable and disable methods.

```javascript
class Extension {
    enable() {
        this._indicator = new ExampleIndicator();
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}

```

--------------------------------

### System Indicator: GJS QuickSettings Class

Source: https://gjs.guide/extensions/topics/quick-settings

Demonstrates the usage of `QuickSettings.SystemIndicator` to manage quick settings items and display an icon. It shows how to add an indicator, set its icon name, and bind its visibility to a GSettings key. This class is essential for extensions needing a presence in the GNOME Shell quick settings panel.

```javascript
const ExampleIndicator = GObject.registerClass(
class ExampleIndicator extends QuickSettings.SystemIndicator {
    _init(extensionObject) {
        super._init();

        // Create an icon for the indicator
        this._indicator = this._addIndicator();
        this._indicator.icon_name = 'selection-mode-symbolic';

        // Showing an indicator when the feature is enabled
        this._settings = extensionObject.getSettings();
        this._settings.bind('feature-enabled',
            this._indicator, 'visible',
            Gio.SettingsBindFlags.DEFAULT);
    }
});
```

--------------------------------

### Importing GJS Built-in and GObject Introspection Libraries

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Shows how to import GJS's built-in modules such as Cairo and Gettext, and libraries exposed via GObject Introspection like Clutter and Meta. It also demonstrates importing multiple GObject Introspected libraries using object destructuring.

```javascript
// GJS's Built-in Modules are in the top-level of the import object
const Gettext = imports.gettext;
const Cairo = imports.cairo;

// Introspected libraries are under the `gi` namespace
const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;

// Multiple libraries can be imported with object destructuring
const {GLib, GObject, Gio} = imports.gi;
```

--------------------------------

### Gtk.FlowBox Container

Source: https://gjs.guide/guides/gtk/3/05-layouts

Conceptually similar to HTML5 Flexbox, it fills rows or columns with child widgets until no space is left, then starts a new row/column, offering high flexibility without predefined sizes.

```APIDOC
Gtk.FlowBox
  Fills rows/columns with widgets until no space is left, then starts a new row/column.
  Learn More: https://gjs-docs.gnome.org/gtk30-flowbox/
```

--------------------------------

### GObject Signal Declaration Parameters (APIDOC)

Source: https://gjs.guide/guides/gobject/subclassing

Defines the configurable parameters available when declaring GObject signals. These parameters control signal behavior, argument types, return types, and accumulation.

```APIDOC
Signals Dictionary Parameters:
  - flags: GObject.SignalFlags (default: GObject.SignalFlags.RUN_FIRST)
    Emission behavior (e.g., RUN_FIRST, RUN_LAST, RUN_CLEANUP, DETAILED).
  - param_types: Array of GType (default: [])
    List of GType arguments the signal accepts.
  - return_type: GObject.GType (default: GObject.TYPE_NONE)
    The return type of the signal's callbacks.
  - accumulator: GObject.AccumulatorType (default: GObject.AccumulatorType.NONE)
    Specifies how return values from multiple handlers are combined.
```

--------------------------------

### Define GObject ParamSpec for JSObject Property

Source: https://gjs.guide/guides/gobject/subclassing

Illustrates creating a GObject.ParamSpec for properties that can hold native JavaScript types derived from Object, such as plain objects, arrays, or Date objects.

```js
GObject.ParamSpec.jsobject(
    'jsobject-property',
    'JSObject Property',
    'A property holding a JavaScript object',
    GObject.ParamFlags.READWRITE);

```

--------------------------------

### Atk Roles and Semantics

Source: https://gjs.guide/extensions/development/accessibility

Details the fundamental concepts of accessibility roles, relationships, and states within the GNOME accessibility framework (Atk). Roles define the primary purpose of UI elements, influencing presentation, behavior, and keyboard focus.

```APIDOC
Atk.Role
  - An enumeration representing the primary purpose of an element in the user interface.
  - Affects presentation, behavior, and keyboard focus.
  - Example: Atk.Role.RADIO_BUTTON

Semantics are the shared language of design, code, translations, and user experience. Roles, relationships, and states define these semantics.
```

--------------------------------

### Setting Custom GTypeName in GJS

Source: https://gjs.guide/guides/gobject/subclassing

Demonstrates how to specify a custom GType name for a GObject subclass in GJS using GObject.registerClass. This is useful when referring to types by name, such as in GtkBuilder interfaces.

```javascript
const SubclassOne = GObject.registerClass({
}, class SubclassOne extends GObject.Object {
});

const SubclassTwo = GObject.registerClass({
    GTypeName: 'CustomName',
}, class SubclassTwo extends GObject.Object {
});

// expected output: 'Gjs_SubclassOne'
console.log(SubclassOne.$gtype.name);

// expected output: 'CustomName'
console.log(SubclassTwo.$gtype.name);
```

--------------------------------

### ESLint Configuration for ES Modules

Source: https://gjs.guide/guides/gjs/style-guide

This snippet shows a typical `eslint.config.js` file for a modern JavaScript project. It configures ESLint to use ES Modules and includes recommended rules, along with specific GJS-related restrictions and global variable definitions.

```javascript
// SPDX-License-Identifier: CC0-1.0
// SPDX-FileCopyrightText: No rights reserved

import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ARGV: 'readonly',
                Debugger: 'readonly',
                GIRepositoryGType: 'readonly',
                globalThis: 'readonly',
                imports: 'readonly',
                Intl: 'readonly',
                log: 'readonly',
                logError: 'readonly',
                pkg: 'readonly',
                print: 'readonly',
                printerr: 'readonly',
                window: 'readonly',
                TextEncoder: 'readonly',
                TextDecoder: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
                // GNOME Shell Only
                global: 'readonly',
                _: 'readonly',
                C_: 'readonly',
                N_: 'readonly',
                ngettext: 'readonly',
            },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
            },
        },
        rules: {
            // See: https://eslint.org/docs/latest/rules/#possible-problems
            'array-callback-return': 'error',
            'no-await-in-loop': 'error',
            'no-constant-binary-expression': 'error',
            'no-constructor-return': 'error',
            'no-new-native-nonconstructor': 'error',
            'no-promise-executor-return': 'error',
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unreachable-loop': 'error',
            'no-unused-private-class-members': 'error',
            'no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: true,
                    variables: true,
                    allowNamedExports: true,
                },
            ],
            // See: https://eslint.org/docs/latest/rules/#suggestions
            'block-scoped-var': 'error',
            'complexity': 'warn',
            'consistent-return': 'error',
            'default-param-last': 'error',
            'eqeqeq': 'error',
            'no-array-constructor': 'error',
            'no-caller': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-extra-label': 'error',
            'no-iterator': 'error',
            'no-label-var': 'error',
            'no-loop-func': 'error',
            'no-multi-assign': 'warn',
            'no-new-object': 'error',
            'no-new-wrappers': 'error',
            'no-proto': 'error',
            'no-shadow': 'warn',
            'no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                },
            ],
            'no-var': 'warn',
            'unicode-bom': 'error',
            // GJS Restrictions
            'no-restricted-globals': [
                'error',
                {
                    name: 'Debugger',
                    message: 'Internal use only',
                },
                {
                    name: 'GIRepositoryGType',
                    message: 'Internal use only',
                },
                {
                    name: 'log',
                    message: 'Use console.log()',
                },
                {
                    name: 'logError',
                    message: 'Use console.warn() or console.error()',
                },
            ],
            'no-restricted-properties': [
                'error',
                {
                    object: 'imports',
                    property: 'format',
                    message: 'Use template strings',
                },
                {
                    object: 'pkg',
                    property: 'initFormat',
                    message: 'Use pkg.init() instead',
                },
            ],
        },
    },
];

```

--------------------------------

### Search Provider API

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Defines the core methods for a GNOME Shell search provider, handling initial result fetching, refining searches, and filtering results based on criteria. These methods are essential for integrating custom search functionality into GNOME Shell.

```APIDOC
getInitialResultSet(terms, cancellable)
  - Fetches the initial set of search results based on provided terms.
  - Parameters:
    - terms: An array of strings representing the search query terms.
    - cancellable: A Gio.Cancellable object to allow cancellation of the operation.
  - Returns: A Promise that resolves with an array of result identifiers (strings).
  - Example:
    ```javascript
    getInitialResultSet(['example', 'search'], cancellable)
    ```

getSubsearchResultSet(results, terms, cancellable)
  - Refines the current search results with expanded terms, returning a subset of the original results.
  - This method can be used to efficiently refine results or pass terms to getInitialResultSet.
  - If the cancellable object is triggered, this method should throw an error.
  - Parameters:
    - results: An array of strings representing the original result set.
    - terms: An array of strings representing the terms to refine the search with.
    - cancellable: A Gio.Cancellable object for the operation.
  - Returns: A Promise that resolves with a subset of the original result set (strings).
  - Example:
    ```javascript
    getSubsearchResultSet(['result-01'], ['new', 'term'], cancellable)
    ```

filterResults(results, maxResults)
  - Truncates the number of search results to a specified maximum.
  - Implementations can use custom criteria or simply return the first n-items.
  - Parameters:
    - results: An array of strings representing the original result set.
    - maxResults: A number indicating the maximum number of results to return.
  - Returns: An array of strings representing the filtered results.
  - Example:
    ```javascript
    filterResults(['res1', 'res2', 'res3'], 2)
    ```
```

--------------------------------

### GtkBuilder Template XML Structure

Source: https://gjs.guide/guides/gobject/gtype

An example of an XML structure used for GtkBuilder templates, defining a widget class named 'Square' that inherits from 'GtkBox'. This XML is typically referenced by GObject.registerClass using the 'Template' property.

```xml
<interface>
  <template class="Square" parent="GtkBox">
    <!-- Template Definition -->
  </template>
</interface>
```

--------------------------------

### Example Extension Method Overriding

Source: https://gjs.guide/extensions/topics/extension

Demonstrates how to use the InjectionManager within a GJS extension to override methods. It shows overriding Panel.prototype.toggleCalendar with an arrow function and Panel.prototype.toggleQuickSettings with a function expression, including logging and calling the original method.

```javascript
export default class ExampleExtension extends Extension {
    enable() {
        this._injectionManager = new InjectionManager();

        // Overriding a method with an *arrow function*
        this._injectionManager.overrideMethod(Panel.prototype, 'toggleCalendar',
            originalMethod => {
                return args => {
                    console.debug(`${this.metadata.name}: toggling calendar`);
                    originalMethod.call(Main.panel, ...args);
                };
            });

        // Overriding a method with a *function expression*
        this._injectionManager.overrideMethod(Panel.prototype, 'toggleQuickSettings',
            originalMethod => {
                const metadata = this.metadata;

                return function (...args) {
                    console.debug(`${metadata.name}: toggling quick settings`);
                    originalMethod.call(this, ...args);
                };
            });
    }

    disable() {
        this._injectionManager.clear();
        this._injectionManager = null;
    }
}
```

--------------------------------

### St.Widget Accessibility Properties

Source: https://gjs.guide/extensions/development/accessibility

Explains how St.Widget integrates with accessibility frameworks, focusing on the `accessible-role` property for defining an element's primary purpose. It highlights that St.Widget provides convenient access to Atk.Object for advanced accessibility configurations.

```APIDOC
St.Widget:accessible-role
  - Property to check and set the proper role for a widget.
  - The role is usually static and represents the primary purpose of an element.
  - Example: Setting a widget's role to a button.

St.Widget includes convenience methods and properties, with access to the Atk.Object for everything else.
```

--------------------------------

### GJS: Exporting Public Constants and Classes

Source: https://gjs.guide/guides/gjs/style-guide

Shows how to make script members public using the 'export' keyword, replacing the older 'var' statement. This is preferred for new code to manage script visibility.

```javascript
export const PUBLIC_CONSTANT = 100;

export const PublicObject = GObject.registerClass(
class PublicObject extends GObject.Object {
    frobnicate() {
    }
});
```

--------------------------------

### GJS: Signal Handling API Reference

Source: https://gjs.guide/guides/gobject/advanced

Provides an overview of key GJS API functions for managing signal handlers, including blocking, unblocking, and stopping signal emissions. These functions are crucial for controlling signal propagation and preventing unintended side effects.

```APIDOC
GObject.signal_handler_block(handler_id)
  - Blocks a signal handler from being invoked.
  - Parameters:
    - handler_id: The ID of the handler to block.
  - Returns: The handler_id if successful.

GObject.signal_handler_unblock(handler_id)
  - Unblocks a previously blocked signal handler.
  - Parameters:
    - handler_id: The ID of the handler to unblock.
  - Returns: The handler_id if successful.

GObject.signal_handlers_block_matched(instance, mask)
  - Blocks all signal handlers on an instance that match the provided mask.
  - Parameters:
    - instance: The object instance.
    - mask: A dictionary containing matching criteria (e.g., `func`, `signalId`, `detail`).
  - Returns: The number of handlers blocked.

GObject.signal_handlers_unblock_matched(instance, mask)
  - Unblocks all signal handlers on an instance that match the provided mask.
  - Parameters:
    - instance: The object instance.
    - mask: A dictionary containing matching criteria (e.g., `func`, `signalId`, `detail`).
  - Returns: The number of handlers unblocked.

GObject.signal_stop_emission(instance, detail_type)
  - Stops the emission of a signal for the current instance and detail type.
  - Parameters:
    - instance: The object instance.
    - detail_type: The detail type of the signal.

GObject.signal_stop_emission_by_name(instance, name)
  - Stops the emission of a signal by its name for the current instance.
  - Parameters:
    - instance: The object instance.
    - name: The name of the signal to stop.
```

--------------------------------

### GJS: Stop Signal Emission with `signal_stop_emission_by_name`

Source: https://gjs.guide/guides/gobject/advanced

Illustrates how to halt the emission of a signal from within a handler using `GObject.signal_stop_emission_by_name`. This prevents any subsequent handlers connected to the same signal from being invoked during the current emission cycle.

```javascript
const linkLabel = new Gtk.Label({label: 'Example'});
linkLabel.connect('activate-current-link', (label, _uri) => {
    console.log('First handler that will be run');

    // No other handlers will run after the emission is stopped
    GObject.signal_stop_emission_by_name(label, 'activate-current-link');
});
linkLabel.connect('activate-current-link', (_label, _uri) => {
    console.log('Second handler that will not be run');
});
linkLabel.emit('activate-current-link');
```

--------------------------------

### Use Detailed GObject Signals with Flags (GJS)

Source: https://gjs.guide/guides/gobject/subclassing

Illustrates using signal flags like RUN_LAST and DETAILED to control emission order and allow signals to be emitted with a detail string. Handlers can be connected to specific details.

```js
const DetailExample = GObject.registerClass({
    Signals: {
        'example-signal': {
            flags: GObject.SignalFlags.RUN_LAST | GObject.SignalFlags.DETAILED,
        },
    },
}, class DetailedExample extends GObject.Object {
    on_example_signal() {
        console.log('default handler invoked');
    }
});

const detailExample = new DetailExample();

detailExample.connect('example-signal',
    () => console.log('user handler invoked'));

detailExample.connect('example-signal::foobar',
    () => console.log('user handler invoked (detailed)'));

detailExample.connect_after('example-signal',
    () => console.log('user handler invoked (after)'));

/* Expected output:
 *   1. "user handler invoked"
 *   2. "user handler invoked (detailed)"
 *   3. "default handler invoked"
 *   4. "user handler invoked (after)"
 */
detailExample.emit('example-signal::foobar');

/* Expected output:
 *   1. "user handler invoked"
 *   2. "default handler invoked"
 *   3. "user handler invoked (after)"
 */
detailExample.emit('example-signal::bazqux');
```

--------------------------------

### Complete GJS Image Viewer Application

Source: https://gjs.guide/guides/gtk/3/10-building-app

Combines all necessary components: imports, class definition, application creation, activation handling, and application execution for a functional GJS image viewer.

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gio, Gtk } = imports.gi;

class ImageViewerWindow {
    constructor(app) {
        this._app = app;
        this._window = null;
        this._box = null;
        this._image = null;
        this._fileChooserButton = null;
    }

    _buildUI() {
        this._window = new Gtk.ApplicationWindow({
            application: this._app,
            defaultHeight: 600,
            defaultWidth: 800
        });
        this._box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL
        });

        this._image = new Gtk.Image({
            vexpand: true
        });
        this._box.add(this._image);

        this._fileChooserButton = Gtk.FileChooserButton.new('Pick An Image', Gtk.FileChooserAction.OPEN);

        this._fileChooserButton.connect('file-set', (button) => {
            const fileName = button.get_filename();
            this._image.set_from_file(fileName);
        });

        this._box.add(this._fileChooserButton);
        this._box.show_all();

        this._window.add(this._box);
    }

    getWidget() {
        this._buildUI();
        return this._window;
    }
}

const application = new Gtk.Application({
    application_id: 'org.gnome.Sandbox.ImageViewerExample',
    flags: Gio.ApplicationFlags.FLAGS_NONE
});

application.connect('activate', app => {
    let activeWindow = app.activeWindow;

    if (!activeWindow) {
        let imageViewerWindow = new ImageViewerWindow(app);
        activeWindow = imageViewerWindow.getWidget();
    }

    activeWindow.present();
});

application.run(null);
```

--------------------------------

### Accessing GObject Properties

Source: https://gjs.guide/guides/gobject/basics

Illustrates multiple ways to retrieve and set GObject properties, including native property access, string-keyed access, and dedicated getter/setter methods.

```javascript
const invisibleLabel = new Gtk.Label({
    visible: false,
});
let visible;

// Three different ways to get or set properties
visible = invisibleLabel.visible;
visible = invisibleLabel['visible'];
visible = invisibleLabel.get_visible();

invisibleLabel.visible = false;
invisibleLabel['visible'] = false;
invisibleLabel.set_visible(false);
```

--------------------------------

### Define GObject ParamSpec for Variant Property

Source: https://gjs.guide/guides/gobject/subclassing

Shows how to define a GObject.ParamSpec for properties holding GLib.Variant values. This requires specifying a GLib.VariantType to describe the variant's structure and an initial GLib.Variant value.

```js
GObject.param_spec_variant(
    'variant-property',
    'GVariant Property',
    'A property holding a GVariant value',
    new GLib.VariantType('as'),
    new GLib.Variant('as', ['one', 'two', 'three']),
    GObject.ParamFlags.READWRITE);

```

--------------------------------

### Importing Local GJS Modules

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Demonstrates how to import custom JavaScript modules within a GJS extension. It shows how to access modules located in subdirectories relative to the extension's root using the `Me.imports` object.

```javascript
// GNOME Shell imports
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// You can import your modules using the extension object we imported as `Me`.
const ExampleLib = Me.imports.exampleLib;

let myObject = new ExampleLib.ExportedClass();
ExampleLib.exportedFunction(0, ExampleLib.EXPORTED_VARIABLE);
```

--------------------------------

### Bind Property with Value Transformation

Source: https://gjs.guide/guides/gobject/basics

Shows how to use `GObject.Object.bind_property_full` to bind properties with a custom transformation function. This example binds the 'text' property of a Gtk.Entry to the 'sensitive' property of a Gtk.Button, making the button sensitive only when the entry has text.

```js
const searchEntry = new Gtk.Entry();
const searchButton = new Gtk.Button({
    label: 'Go',
});

searchEntry.bind_property_full('text', searchButton, 'sensitive',
    GObject.BindingFlags.DEFAULT,
    (binding, value) => [true, !!value],
    null);

```

--------------------------------

### Gio.ListStore Item Management in JavaScript

Source: https://gjs.guide/guides/gio/list-models

Demonstrates the core functionalities of Gio.ListStore, including creating a store, connecting to item-changed signals, adding, inserting, removing, and splicing items. It also shows how to sort and find items using custom functions.

```javascript
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

const listStore = Gio.ListStore.new(GObject.TYPE_OBJECT);

listStore.connect('items-changed', (_list, position, removed, added) => {
    console.log(`${removed} items were removed, and ${added} added at ${position}`);
});

const listItems = [
    new GObject.Object(),
    new GObject.Object(),
    new GObject.Object(),
];

/*
 * Adding and removing items
 */
listStore.append(listItems[0]);
listStore.insert(1, listItems[1]);
listStore.splice(2, 0, [listItems[2]]);

listStore.remove(0);

/**
 * Example sort function.
 *
 * NOTE: This function must be deterministic to ensure a stable sort.
 *
 * @param {GObject.Object} object1 - a GObject
 * @param {GObject.Object} object2 - a GObject
 * @returns {number} `-1` if @object1 should be before @object2, `0` if
 *     equivalent, or `1` if @object1 should be after @object2.
 */
function sortFunc(object1, object2) {
    return object1 === object2 ? 0 : -1;
}

listStore.sort(sortFunc);

listStore.insert_sorted(new GObject.Object(), sortFunc);

/**
 * Example find function.
 *
 * @param {GObject.Object} object1 - a GObject
 * @param {GObject.Object} object2 - a GObject
 * @returns {boolean} %true if equivalent, %false otherwise
 */
function findFunc(object1, object2) {
    return object1 === object2;
}

let [found, position] = listStore.find(listItems[0]);

if (found)
    console.log('This item will not be found, because it was already removed');

[found, position] = listStore.find_with_equal_func(listItems[1], findFunc);

if (found) {
    console.log(`The item found at position ${position} will be removed`);
    listStore.remove(position);
}

```

--------------------------------

### Gio.Settings API

Source: https://gjs.guide/guides/gtk/3/16-settings

Provides an overview of the Gio.Settings API for managing application preferences. Covers instantiation and common getter methods for various data types.

```APIDOC
Gio.Settings:
  __constructor__(properties: { settings_id: string })
    Creates a Gio.Settings instance for a given schema ID.

  get_boolean(name: string): boolean
    Retrieves the boolean value for the specified setting name.

  get_int(name: string): number
    Retrieves the integer value for the specified setting name.

  get_string(name: string): string
    Retrieves the string value for the specified setting name.

  get_double(name: string): number
    Retrieves the double-precision floating-point value for the specified setting name.

  get_variant(name: string): GVariant
    Retrieves the GVariant value for the specified setting name.

  set_boolean(name: string, value: boolean): void
    Sets the boolean value for the specified setting name.

  set_int(name: string, value: number): void
    Sets the integer value for the specified setting name.

  set_string(name: string, value: string): void
    Sets the string value for the specified setting name.

  set_double(name: string, value: number): void
    Sets the double-precision floating-point value for the specified setting name.

  set_variant(name: string, value: GVariant): void
    Sets the GVariant value for the specified setting name.

See also:
  https://gjs-docs.gnome.org/gio20/gio.settings
```

--------------------------------

### GObject.Value Unpacking in Drag-n-Drop

Source: https://gjs.guide/guides/gobject/gvalue

This snippet demonstrates how GJS automatically unpacks `GObject.Value` when it is passed as a callback argument in a Drag-n-Drop operation. It sets up a `Gtk.DragSource` to provide a `GObject.Value` and a `Gtk.DropTarget` to receive and verify the unpacked object.

```javascript
// Create a GObject to pass around
const objectInstance = new GObject.Object();

// A GValue can be used to pass data via Drag-n-Drop
const dragSource = new Gtk.DragSource({
    actions: Gtk.DragAction.COPY,
});

dragSource.connect('prepare', (_dragSource, _x, _y) => {
    const value = new GObject.Value();
    value.init(GObject.Object);
    value.set_object(objectInstance);

    return Gdk.ContentProvider.new_for_value(value);
});

// The Drag-n-Drop target receives the unpacked value
const dropTarget = Gtk.DropTarget.new(GObject.Object,
    Gdk.DragAction.COPY);

dropTarget.connect('drop', (_dropTarget, value, _x, _y) => {
    if (value instanceof GObject.Object)
        console.debug('The GObject.Value was unpacked to a GObject.Object');
});
```

--------------------------------

### Handle Background Processes with Continuous I/O (GJS)

Source: https://gjs.guide/guides/gio/subprocesses

Illustrates handling background processes that require continuous interaction, such as reading from stdout and writing to stdin as the process runs. This example uses `Gio.DataInputStream` for line-based reading and `Gio.OutputStream` for writing, demonstrating an asynchronous loop for interactive subprocess communication.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// This is the process that we'll be running
const script = `
echo "BEGIN";

while read line; do
  echo "$line";
  sleep 1;
done;
`;

/**
 * This function simply writes the current time to `stdin`
 *
 * @param {Gio.InputStream} stdin - the `stdin` stream
 */
async function writeInput(stdin) {
    try {
        const date = new Date().toLocaleString();
        await stdin.write_bytes_async(new GLib.Bytes(`${date}\n`),
            GLib.PRIORITY_DEFAULT, null);

        console.log(`WROTE: ${date}`);
    } catch (e) {
        logError(e);
    }
}

/**
 * Reads a line from `stdout`, then queues another read/write
 *
 * @param {Gio.OutputStream} stdout - the `stdout` stream
 * @param {Gio.DataInputStream} stdin - the `stdin` stream
 */
function readOutput(stdout, stdin) {
    stdout.read_line_async(GLib.PRIORITY_LOW, null, (stream, result) => {
        try {
            const [line] = stream.read_line_finish_utf8(result);

            if (line !== null) {
                console.log(`READ: ${line}`);
                writeInput(stdin);
                readOutput(stdout, stdin);
            }
        } catch (e) {
            logError(e);
        }
    });
}

try {
    const proc = Gio.Subprocess.new(['bash', '-c', script],
        Gio.SubprocessFlags.STDIN_PIPE | Gio.SubprocessFlags.STDOUT_PIPE);

    // Get the `stdin`and `stdout` pipes, wrapping `stdout` to make it easier to
    // read lines of text
    const stdinStream = proc.get_stdin_pipe();
    const stdoutStream = new Gio.DataInputStream({
        base_stream: proc.get_stdout_pipe(),
        close_base_stream: true,
    });

    // Start the loop
    readOutput(stdoutStream, stdinStream);
} catch (e) {
    logError(e);
}
```

--------------------------------

### GNOME Shell CSS Styling

Source: https://gjs.guide/extensions/overview/anatomy

This CSS snippet demonstrates how to apply custom styles to GNOME Shell widgets and extensions. It shows examples of targeting generic widget types (`StLabel`), specific CSS classes (`.example-style`), combinations of types and classes, and custom widget types defined via `GTypeName`.

```css
/* This will change the color of all StLabel elements */
StLabel {
    color: red;
}

/* This will change the color of all elements with the "example-style" class */
.example-style {
    color: green;
}

/* This will change the color of StLabel elements with the "example-style" class */
StLabel.example-style {
    color: blue;
}

/* This will change the color of your StLabel subclass with the custom GTypeName */
ExampleLabel {
    color: yellow;
}
```

--------------------------------

### GJS Console API Support

Source: https://gjs.guide/guides/gjs/intro

GJS versions 1.70 and later provide access to the Console API, adhering to the WHATWG Console Standard. The 'console' object is globally available without requiring explicit imports, facilitating debugging and logging in GJS applications.

```APIDOC
Console API:
  Available globally without import.
  Implements WHATWG Console Standard.
  Example:
    console.log("Hello from GJS!");
    console.warn("This is a warning.");
    console.error("An error occurred.");
```

--------------------------------

### Passing Constructor Objects and ParamSpec

Source: https://gjs.guide/guides/gobject/gtype

Shows idiomatic GJS practices where constructor objects can often be passed directly instead of GTypes. It also includes an example of defining a GObject.ParamSpec for an object property, specifying its name, description, flags, and type.

```javascript
const listStore = Gio.ListStore.new(Gio.Icon);

const pspec = GObject.ParamSpec.object(
    'gicon',
    'GIcon',
    'A property holding a GIcon',
    GObject.ParamFlags.READWRITE,
    Gio.Icon);

```

--------------------------------

### Create and Configure PopupSwitchMenuItem in GJS

Source: https://gjs.guide/extensions/topics/popup-menu

Shows how to create a PopupSwitchMenuItem with a label and an initial switch state. It covers methods to set the switch's text status and toggle its state, and how to connect to the 'toggled' signal.

```javascript
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// Example: Creating a switch item that is initially off
const switchItem = new PopupMenu.PopupSwitchMenuItem('Enable Feature', false, {});

// Setting status text for the switch
switchItem.setStatusText('Feature is currently disabled');

// Toggling the switch programmatically
// switchItem.toggle();

// Connecting to the toggled signal
switchItem.connect('toggled', (item, state) => {
    console.log(`Switch state changed to: ${state}`);
    item.setStatusText(state ? 'Feature is enabled' : 'Feature is currently disabled');
});

// Accessing the current state
// console.log(switchItem.state);
```

--------------------------------

### GLib.Variant API: Creation and Type Checking

Source: https://gjs.guide/guides/glib/gvariant

Details methods for creating GLib.Variant objects from various native JavaScript types and checking their GVariant type strings. Includes examples for boolean, int64, string, and string arrays.

```APIDOC
GLib.Variant.new_boolean(value: boolean): GLib.Variant
  - Creates a new GLib.Variant of type 'b' (boolean).
  - Parameters:
    - value: The boolean value to wrap.
  - Returns: A new GLib.Variant instance.

GLib.Variant.new_int64(value: number): GLib.Variant
  - Creates a new GLib.Variant of type 'x' (signed 64-bit integer).
  - Note: May have limitations with very large numbers in older GJS versions.
  - Parameters:
    - value: The int64 value to wrap.
  - Returns: A new GLib.Variant instance.

GLib.Variant.new_string(value: string): GLib.Variant
  - Creates a new GLib.Variant of type 's' (string).
  - Parameters:
    - value: The string value to wrap.
  - Returns: A new GLib.Variant instance.

GLib.Variant.new_strv(value: string[]): GLib.Variant
  - Creates a new GLib.Variant of type 'as' (array of strings).
  - Parameters:
    - value: An array of strings to wrap.
  - Returns: A new GLib.Variant instance.

GLib.Variant.prototype.get_type_string(): string
  - Returns the GVariant type string representation of the variant.
  - Returns: The type string (e.g., 'b', 'x', 's', 'as').

GLib.Variant.prototype.get_boolean(): boolean
  - Retrieves the boolean value from a 'b' type variant.
  - Returns: The boolean value.

GLib.Variant.prototype.get_int64(): number
  - Retrieves the signed 64-bit integer value from an 'x' type variant.
  - Returns: The int64 value.

GLib.Variant.prototype.get_string(): [string, number]
  - Retrieves the string value and its length from an 's' type variant.
  - Returns: An array containing the string value and its length.

GLib.Variant.prototype.get_strv(): string[]
  - Retrieves the array of strings from an 'as' type variant.
  - Returns: An array of strings.
```

--------------------------------

### metadata.json shell-version Compatibility

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Specifies the GNOME Shell versions an extension supports. For GNOME Shell 40, add "40" to the `shell-version` array. This example shows support for GNOME Shell 40 and 3.36.

```json
{
    "name": "Extension Name",
    "description": "Extension Description",
    "shell-version": ["3.36", "40"],
    "url": "",
    "uuid": "example@example"
}
```

--------------------------------

### GJS Search Provider Implementation

Source: https://gjs.guide/extensions/topics/search-provider

Demonstrates the core methods required for a GJS search provider, including fetching initial results, refining searches, and filtering the output. It outlines the expected signatures and behavior for these methods.

```javascript
class SearchProvider {
    constructor(extension) {
        this._extension = extension;
    }

    /**
     * Get the initial set of search results.
     *
     * This method is called when a new search is initiated.
     *
     * @async
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<string[]>}
     */
    getInitialResultSet(terms, cancellable) {
        console.debug(`getInitialResultSet([${terms}])`);

        return new Promise((resolve, reject) => {
            const cancelledId = cancellable.connect(() => {
                reject(Error('Search Cancelled'));
            });

            // Simulate fetching results
            const identifiers = [
                'result-01',
                'result-02',
                'result-03',
            ];

            cancellable.disconnect(cancelledId);
            if (!cancellable.is_cancelled())
                resolve(identifiers);
        });
    }

    /**
     * Refine the current search.
     *
     * This method is called to refine the current search results with
     * expanded terms and should return a subset of the original result set.
     *
     * Implementations may use this method to refine the search results more
     * efficiently than running a new search, or simply pass the terms to the
     * implementation of `getInitialResultSet()`.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} results - The original result set
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<string[]>}
     */
    getSubsearchResultSet(results, terms, cancellable) {
        console.debug(`getSubsearchResultSet([${results}], [${terms}])`);

        if (cancellable.is_cancelled())
            throw Error('Search Cancelled');

        return this.getInitialResultSet(terms, cancellable);
    }

    /**
     * Filter the current search.
     *
     * This method is called to truncate the number of search results.
     *
     * Implementations may use their own criteria for discarding results, or
     * simply return the first n-items.
     *
     * @param {string[]} results - The original result set
     * @param {number} maxResults - The maximum amount of results
     * @returns {string[]} The filtered results
     */
    filterResults(results, maxResults) {
        console.debug(`filterResults([${results}], ${maxResults})`);

        if (results.length <= maxResults)
            return results;

        return results.slice(0, maxResults);
    }
}
```

--------------------------------

### GNOME Shell Static Objects and Module Scope

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Provides an example of using static data structures and built-in JavaScript types in the module scope for GNOME Shell extensions. It shows how to declare `Map` objects and state variables, and how to manage them within the `enable` and `disable` methods.

```js
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

// Extensions **MAY** construct built-in JavaScript types in the module scope
const FoobarCache = new Map();

// Extensions **MAY** create static data structures in the module scope
const FoobarState = {
    DEFAULT: 0,
    CHANGED: 1,
};

class Foobar {
    state = FoobarState.DEFAULT;
}

let DEFAULT_FOOBAR = null;

export default class ExampleExtension extends Extension {
    constructor(metadata) {
        super(metadata);

        // Extensions **MAY** create and store a reasonable amount of static
        // data during initialization
        this._state = {
            enabled: false,
        };
    }

    enable() {
        // Extensions **MAY** construct instances of classes and assign them
        // to variables in the module scope
        if (DEFAULT_FOOBAR === null)
            DEFAULT_FOOBAR = new Foobar();

        // Extensions **MAY** dynamically store data in the module scope
        for (let i = 0; i < 10; i++)
            FoobarCache.set(`${i}`, new Date());

        this._state.enabled = true;
    }

    disable() {
        // Extensions **MUST** destroy instances of classes assigned to
        // variables in the module scope
        if (DEFAULT_FOOBAR instanceof Foobar)
            DEFAULT_FOOBAR = null;

        // Extensions **MUST** clear dynamically stored data in the module scope
        FoobarCache.clear();

        this._state.enabled = false;
    }
}
```

--------------------------------

### Disconnect Signals (GNOME 44 and earlier)

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Provides an example of disconnecting signal handlers in the `disable()` method for GNOME 44 and earlier versions. This pattern is crucial for resource management, ensuring that connections are properly terminated when the extension is deactivated. It utilizes `global.settings.connect` and `global.settings.disconnect`.

```js
class Extension {
    enable() {
        this._handlerId = global.settings.connect('changed::favorite-apps', () => {
            console.log('app favorites changed');
        });
    }

    disable() {
        if (this._handlerId) {
            global.settings.disconnect(this._handlerId);
            this._handlerId = null;
        }
    }
}

function init() {
    return new Extension();
}
```

--------------------------------

### GJS: Load Gtk.Image from Icon Name on Button

Source: https://gjs.guide/guides/gtk/3/09-images

Shows how to load an image using an icon name and place it within a Gtk.Button. This example creates a button and sets its child to a Gtk.Image widget configured with the 'input-mouse' icon name. It also includes a simple click handler.

```javascript
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.Button();
button.add(new Gtk.Image({ iconName: 'input-mouse' }))
button.connect('clicked', () => {
    log('The button was clicked!');
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();

```

--------------------------------

### Accessing GSettings in GJS

Source: https://gjs.guide/guides/gtk/3/16-settings

Demonstrates how to create a Gio.Settings instance in GJS and retrieve setting values using specific getter methods.

```js
const settings = new Gio.Settings({ settings_id: '[your.app.id]' });

// Example: Retrieve a boolean setting
const isRunning = settings.get_boolean('is-running');
```

--------------------------------

### metadata.json for Session Modes Extension

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Defines the metadata for a GJS extension, specifying its UUID, name, description, supported GNOME Shell versions, and crucially, the session modes it can operate within ('user', 'unlock-dialog'). This file is essential for the GNOME Shell to load and manage the extension's lifecycle.

```json
{
    "uuid": "session-modes@gjs.guide",
    "name": "Session Modes Example",
    "description": "This is an example of using session modes in an extension.",
    "shell-version": [ "42" ],
    "session-modes": ["user", "unlock-dialog"],
    "url": "https://gjs.guide/extensions/"
}
```

--------------------------------

### Create GTK Button Programmatically

Source: https://gjs.guide/guides/gtk/3/13-ui

Demonstrates the basic syntax for instantiating GTK widgets directly in JavaScript for GJS applications. While functional for simple cases, using UI files with Glade is recommended for complex interfaces.

```javascript
const button = new Button();
```

--------------------------------

### Define Default GObject Signal Handler (GJS)

Source: https://gjs.guide/guides/gobject/subclassing

Shows how to define a default handler for a signal by creating a class method prefixed with 'on_'. This handler is invoked automatically when the signal is emitted, regardless of connected user callbacks.

```js
const HandlerExample = GObject.registerClass({
    Signals: {
        'example-signal': {
            flags: GObject.SignalFlags.RUN_FIRST,
        },
    },
}, class HandlerExample extends GObject.Object {
    on_example_signal() {
        console.log('default handler invoked');
    }
});

const handlerExample = new HandlerExample();

handlerExample.connect('example-signal',
    () => console.log('user handler invoked'));

/* Expected output:
 *   1. "default handler invoked"
 *   2. "user handler invoked"
 */
handlerExample.emit('example-signal');
```

--------------------------------

### Basic Extension Structure with Translation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Demonstrates the fundamental structure of a GJS extension, including importing the `Extension` class and using the `gettext` function for translatable strings within the `enable` and `disable` methods.

```js
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class MyTestExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        console.log(_('This is a translatable text'));
    }

    disable() {
        this._settings = null;
    }
}
```

--------------------------------

### Shell.ActionMode Enum for GNOME Shell States

Source: https://gjs.guide/extensions/topics/dialogs

Defines states in which GNOME Shell actions (keybindings, gestures) are handled. Includes modes like NONE, NORMAL, OVERVIEW, LOCK_SCREEN, and ALL. Useful for controlling action visibility based on the current shell state.

```APIDOC
Shell.ActionMode:
  Controls in which GNOME Shell states an action (like keybindings and gestures) should be handled.

  Members:
    NONE: block action
    NORMAL: allow action when in window mode, e.g. when the focus is in an application window
    OVERVIEW: allow action while the overview is active
    LOCK_SCREEN: allow action when the screen is locked, e.g. when the screen shield is shown
    UNLOCK_SCREEN: allow action in the unlock dialog
    LOGIN_SCREEN: allow action in the login screen
    SYSTEM_MODAL: allow action when a system modal dialog (e.g. authentication or session dialogs) is open
    LOOKING_GLASS: allow action in looking glass
    POPUP: allow action while a shell menu is open
    ALL: always allow action
```

--------------------------------

### GJS PopupSwitchMenuItem with Switch Integration

Source: https://gjs.guide/extensions/development/accessibility

Defines a `PopupSwitchMenuItem` that integrates the `Switch` component for menu items. It handles accessibility roles (`Atk.Role.CHECK_MENU_ITEM`), synchronizes switch state, and supports displaying status text when disabled. The item emits a `toggled` signal.

```JavaScript
const PopupSwitchMenuItem = GObject.registerClass({
    Signals: {'toggled': {param_types: [GObject.TYPE_BOOLEAN]}},
}, class PopupSwitchMenuItem extends PopupBaseMenuItem {
    _init(text, active, params) {
        super._init(params);

        this.label = new St.Label({
            text,
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._switch = new Switch(active);

        this.accessible_role = Atk.Role.CHECK_MENU_ITEM;
        this.checkAccessibleState();
        this.label_actor = this.label;

        this.add_child(this.label);

        this._statusBin = new St.Bin({
            x_align: Clutter.ActorAlign.END,
            x_expand: true,
        });
        this.add_child(this._statusBin);

        this._statusLabel = new St.Label({
            text: '',
            style_class: 'popup-status-menu-item',
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._statusBin.child = this._switch;
    }

    setStatus(text) {
        if (text != null) {
            this._statusLabel.text = text;
            this._statusBin.child = this._statusLabel;
            this.reactive = false;
            this.accessible_role = Atk.Role.MENU_ITEM;
        } else {
            this._statusBin.child = this._switch;
            this.reactive = true;
            this.accessible_role = Atk.Role.CHECK_MENU_ITEM;
        }
        this.checkAccessibleState();
    }

    activate(event) {
        if (this._switch.mapped)
            this.toggle();

        // we allow pressing space to toggle the switch
        // without closing the menu
        if (event.type() === Clutter.EventType.KEY_PRESS &&
            event.get_key_symbol() === Clutter.KEY_space)
            return;

        super.activate(event);
    }

    toggle() {
        this._switch.toggle();
        this.emit('toggled', this._switch.state);
        this.checkAccessibleState();
    }

    get state() {
        return this._switch.state;
    }

    setToggleState(state) {
        this._switch.state = state;
        this.checkAccessibleState();
    }

    checkAccessibleState() {
        switch (this.accessible_role) {
        case Atk.Role.CHECK_MENU_ITEM:
            if (this._switch.state)
                this.add_accessible_state(Atk.StateType.CHECKED);
            else
                this.remove_accessible_state(Atk.StateType.CHECKED);
            break;
        default:
            this.remove_accessible_state(Atk.StateType.CHECKED);
        }
    }
});
```

--------------------------------

### GNOME Shell 44- Object Destruction

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Details the process of destroying objects and cleaning up resources in the `disable` method for GNOME Shell extensions in versions 44 and earlier. This example shows how to manage a `St.Widget` instance using the older `imports.gi.St` pattern.

```js
const St = imports.gi.St;

class Extension {
    enable() {
        this._widget = new St.Widget();
    }

    disable() {
        if (this._widget) {
            this._widget.destroy();
            this._widget = null;
        }
    }
}

function init() {
    return new Extension();
}
```

--------------------------------

### JavaScript Imports for Quick Settings

Source: https://gjs.guide/extensions/topics/quick-settings

Provides essential JavaScript imports for GNOME Shell extensions using the Quick Settings UI pattern. These imports include core modules for main shell components, panel menus, popup menus, and quick settings functionalities.

```javascript
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
```

--------------------------------

### St.IconTheme: Managing search paths and rescanning

Source: https://gjs.guide/extensions/upgrading/gnome-shell-44

Illustrates the recommended usage of `St.IconTheme` in GJS extensions, replacing the deprecated `Gtk.IconTheme`. This snippet shows how to initialize the theme, append a custom search path for icons, and rescan for changes.

```javascript
const {St} = imports.gi;

const iconTheme = new St.IconTheme();
if (!iconTheme.get_search_path().includes(ICONS_FOLDER_PATH)) {
    iconTheme.append_search_path(ICONS_FOLDER_PATH);
}
iconTheme.rescan_if_needed();
```

--------------------------------

### GJS: Create a Gtk.TextView Widget

Source: https://gjs.guide/guides/gtk/3/08-editing-text

Illustrates the creation of a multi-line text editing area using Gtk.TextView in GJS. This widget is designed for longer text inputs and supports formatting. The example shows initialization with a Gtk.TextBuffer and retrieving the content upon a button click.

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

const entry = new Gtk.TextView({
    buffer: new Gtk.TextBuffer(),
    vexpand: true
});

box.add(entry);

const button = new Gtk.Button({
    label: 'Enter'
});

button.connect('clicked', () => {
    log('Entered in the text view: ' + entry.get_buffer().text);
});

box.add(button);

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(box);
win.show_all();

Gtk.main();

```

--------------------------------

### GJS GObject ParamSpec for Int64 Properties

Source: https://gjs.guide/guides/gobject/subclassing

Shows the definition of a GObject.ParamSpec for a 64-bit integer property in GJS. Note the limitation that it maps to JavaScript Numbers, restricting the range to safe integers, as indicated by the upstream issue.

```javascript
GObject.ParamSpec.int64(
    'int64-property',
    'Int64 Property',
    'A property holding an JavaScript Number',
    GObject.ParamFlags.READWRITE,
    Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER,
    0
);
```

--------------------------------

### Constructing Complex GLib.Variant Types

Source: https://gjs.guide/guides/glib/gvariant

Provides examples of packing complex GLib.Variant types, including tuples (represented as Arrays in JS), dictionaries with uniform value types, and dictionaries with varying value types using the 'v' format specifier.

```javascript
import GLib from 'gi://GLib';

// Below is an example of a libnotify notification, ready to be sent over DBus
const notification = new GLib.Variant('(susssasa{sv}i)', [
    'gjs.guide Tutorial',
    0,
    'dialog-information-symbolic',
    'Notification Title',
    'Notification Body',
    [],
    {},
    -1,
]);

// Here is another complex variant, showing how child values marked `v` have to
// be packed like other variants.
const variantTuple = new GLib.Variant('(siaua{sv})', [
    'string',                               // a string
    -1,                                     // a signed integer
    [1, 2, 3],                              // an array of unsigned integers
    {
        'code-name': GLib.Variant.new_string('007'),
        'licensed-to-kill': GLib.Variant.new_boolean(true),
    },
]);

// Dictionaries with shallow, uniform value types can be packed in a single step
const shallowDict = new GLib.Variant('a{ss}', {
    'key1': 'value1',
    'key2': 'value2',
});

// Dictionaries with a varying value types use `v` and must be packed
const deepDict = new GLib.Variant('a{sv}', {
    'key1': GLib.Variant.new_string('string'),
    'key2': GLib.Variant.new_boolean(true),
});
```

--------------------------------

### GJS Encoding API Support

Source: https://gjs.guide/guides/gjs/intro

GJS 1.70 and newer versions include the Encoding API, compliant with the WHATWG Encoding Standard. Developers can use TextDecoder and TextEncoder globally without needing to import them, simplifying text encoding and decoding tasks.

```APIDOC
Encoding API:
  Available globally without import.
  Implements WHATWG Encoding Standard.
  Objects: TextDecoder, TextEncoder.
  Example:
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const encoded = encoder.encode("GJS Text");
    const decoded = decoder.decode(encoded);
    console.log(decoded);
```

--------------------------------

### Freeze and Thaw GObject Notifications

Source: https://gjs.guide/guides/gobject/advanced

Explains how to use `freeze_notify()` and `thaw_notify()` to manage GObject property change notifications, preventing excessive signal emissions during multiple updates. Duplicate notifications are squashed, ensuring at most one signal is emitted per property.

```javascript
const exampleLabel = new Gtk.Label({
    label: 'Initial Value',
});

exampleLabel.connect('notify::label', (object, _pspec) => {
    console.log(`New label is "${object.label}"`);
});

// Freeze notification during multiple changes
exampleLabel.freeze_notify();

exampleLabel.label = 'Example 1';
exampleLabel.label = 'Example 2';
exampleLabel.label = 'Example 3';

// Expected output: New label is "Example 3"
exampleLabel.thaw_notify();
```

--------------------------------

### Run Nested GNOME Shell with Debugging

Source: https://gjs.guide/extensions/development/debugging

Starts a nested GNOME Shell instance with enhanced debugging enabled via environment variables. This configuration sets G_MESSAGES_DEBUG and SHELL_DEBUG to 'all' and specifies a dummy display resolution using MUTTER_DEBUG_DUMMY_MODE_SPECS, useful for detailed troubleshooting.

```sh
#!/bin/sh -e

export G_MESSAGES_DEBUG=all
export MUTTER_DEBUG_DUMMY_MODE_SPECS=1366x768
export SHELL_DEBUG=all

dbus-run-session -- \
    gnome-shell --nested \
                --wayland
```

--------------------------------

### Get GType Name for Object Instances

Source: https://gjs.guide/guides/gobject/gtype

Demonstrates how to retrieve the GType name for both base GObject instances and custom subclasses. By default, GJS prefixes subclass names with 'Gjs_'. This is achieved by accessing the '$gtype.name' property on the class or instance constructor.

```js
const ExampleSubclass = GObject.registerClass({
}, class ExampleSubclass extends GObject.Object {
});

const objectInstance = new GObject.Object();
const subclassInstance = new ExampleSubclass();

// expected output: 'GObject'
console.log(GObject.Object.$gtype.name);
console.log(objectInstance.constructor.$gtype.name);

// expected output: 'Gjs_ExampleSubclass'
console.log(ExampleSubclass.$gtype.name);
console.log(subclassInstance.constructor.$gtype.name);
```

--------------------------------

### GJS: Manage Actions with Gio.SimpleActionGroup

Source: https://gjs.guide/guides/gio/actions-and-menus

Demonstrates how to add, remove, and manage actions within a Gio.SimpleActionGroup. Covers adding actions with parameters, state management, and handling action events. Requires gi://GLib and gi://Gio.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/*
 * GSimpleActionGroup implements both GActionGroup and GActionMap
 */
const actionGroup = new Gio.SimpleActionGroup();

/*
 * Using GActionMap, the writable interface for groups of actions.
 *
 * This is an override in GJS, necessary because the standard method is not
 * introspectable.
 */
actionGroup.add_action_entries([
    {
        name: 'basicAction',
        activate: (action, _parameter) => {
            console.log(`${action.name} activated!`);
        },
    },
    {
        name: 'paramAction',
        parameter_type: new GLib.VariantType('s'),
        activate: (action, parameter) => {
            console.log(`${action.name} activated: ${parameter.unpack()}`);
        },
    },
    {
        name: 'stateAction',
        state: GLib.Variant.new_boolean(true),
        change_state: (action, value) => {
            console.log(`${action.name} change requested: ${value.print(true)}`);
        },
    },
]);

actionGroup.add_action(new Gio.SimpleAction({
    name: 'removeAction',
    activate: (action, _parameter) => {
        console.log(`${action.name} activated!`);
    },
}));

const removeAction = actionGroup.lookup_action('removeAction');

if (removeAction !== null)
    removeAction.enabled = !removeAction.enabled;

actionGroup.remove_action('removeAction');

/*
 * Using GActionGroup, the readable interface for groups of actions.
 *
 * Actions can be queried, activated and state changes requested, but can not be
 * added, removed, enabled or disabled with this interface.
 */
actionGroup.connect('action-added', (action, name) => {
    console.log(`${name} added`);
});
actionGroup.connect('action-enabled-changed', (action, name, enabled) => {
    console.log(`${name} is now ${enabled ? 'enabled' : 'disabled'}`);
});
actionGroup.connect('action-removed', (action, name) => {
    console.log(`${name} removed`);
});
actionGroup.connect('action-state-changed', (action, name, value) => {
    console.log(`${name} state is now ${value.print(true)}`);
});

if (actionGroup.has_action('basicAction'))
    actionGroup.activate_action('basicAction', null);

if (actionGroup.get_action_enabled('paramAction')) {
    actionGroup.activate_action('paramAction', new GLib.Variant('s', 'string'));
    actionGroup.activate_action('paramAction::string', null);
}

const [
    exists,
    enabled,
    parameterType,
    stateType,
    stateHint,
    state,
] = actionGroup.query_action('stateAction');

if (enabled && state.unpack() === true)
    actionGroup.change_action_state('stateAction', GLib.Variant.new_boolean(false));

```

--------------------------------

### GJS Module Exporting Rules

Source: https://gjs.guide/extensions/upgrading/legacy-documentation

Explains how to export variables, functions, and classes from JavaScript modules in GJS for older GNOME Shell versions (44 and earlier). It details that only variables declared with `var` are exported, while `const` and `let` declarations are not.

```js
/* exported: exportedFunction, exportedFunctionWrapper, ExportedClass */

// Any imports this module needs itself must also be imported here
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Variables declared with `let` or `const` are NOT exported
const LOCAL_CONSTANT = 42;
const _PrivateClass = class {};

let localVariable = 'a value';
let _privateFunction = function () {};

// Class declarations are NOT exported
class _PrivateSubClass extends _PrivateClass {}

// Function declarations WILL be exported
function exportedFunction(a, b) {
    return a + b;
}

// Variables declared with `var` WILL be exported
var EXPORTED_VARIABLE = 42;

var exportedFunctionWrapper = function (...args) {
    return exportedFunction(...args);
};

var ExportedClass = class ExportedClass extends _PrivateClass {
    constructor(params) {
        super();

        Object.assign(this, params);
    }
};
```

--------------------------------

### Custom Slider Implementation (GJS)

Source: https://gjs.guide/extensions/topics/quick-settings

Demonstrates creating a custom slider component using QuickSettings.QuickSlider. It includes watching for value changes, making the icon clickable, and binding the slider's value to a GSettings key. This snippet showcases event handling and GSettings integration for a slider.

```javascript
const ExampleSlider = GObject.registerClass(
    class ExampleSlider extends QuickSettings.QuickSlider {
        _init(extensionObject) {
            super._init({
                iconName: 'selection-mode-symbolic',
                iconLabel: _('Icon Accessible Name'),
            });

            // Watch for changes and set an accessible name for the slider
            this._sliderChangedId = this.slider.connect('notify::value',
                this._onSliderChanged.bind(this));
            this.slider.accessible_name = _('Example Slider');

            // Make the icon clickable (e.g. volume mute/unmute)
            this.iconReactive = true;
            this._iconClickedId = this.connect('icon-clicked',
                () => console.debug('Slider icon clicked!'));

            // Binding the slider to a GSettings key
            this._settings = extensionObject.getSettings();
            this._settings.connect('changed::slider-value',
                this._onSettingsChanged.bind(this));
            this._onSettingsChanged();
        }

        _onSettingsChanged() {
            // Prevent the slider from emitting a change signal while being updated
            this.slider.block_signal_handler(this._sliderChangedId);
            this.slider.value = this._settings.get_uint('slider-value') / 100.0;
            this.slider.unblock_signal_handler(this._sliderChangedId);
        }

        _onSliderChanged() {
            // Assuming our GSettings holds values between 0..100, adjust for the
            // slider taking values between 0..1
            const percent = Math.floor(this.slider.value * 100);
            this._settings.set_uint('slider-value', percent);
        }
    });

```

--------------------------------

### Dialog.Dialog Class for GNOME Shell Dialog Layouts

Source: https://gjs.guide/extensions/topics/dialogs

The base class for dialog layouts in GNOME Shell, inheriting from St.Widget. It provides a content and action area for buttons and handles key events to invoke button callbacks. Used as a layout widget for most dialogs.

```APIDOC
Dialog.Dialog:
  Parent Class: St.Widget

  The base class for dialog layouts. This is a fairly simple widget, with a content area and an action area for buttons, used as the layout widget for most dialogs.

  The dialog handles key events, invoking the callback for buttons added with Dialog.addButton() if they include a matching key.
```

--------------------------------

### Create and Run GLib MainLoop with Timeout

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Demonstrates creating a GLib.MainLoop and adding a timeout source that executes a callback after one second. The loop is then run asynchronously, processing events until explicitly stopped or the script ends.

```javascript
import GLib from 'gi://GLib';

// Here we're creating an event loop, to iterate the main context
const loop = new GLib.MainLoop(null, false);

// Here we're adding a timeout source to the main context that executes a
// callback after one second. The returned ID can be used to remove the source.
const sourceId = GLib.timeout_add_seconds(
    GLib.PRIORITY_DEFAULT,           // priority of the source
    1,                               // seconds to wait
    () => {                          // the callback to invoke
        return GLib.SOURCE_CONTINUE; // the return value; to recurse or not?
    }
);

// Here we're starting the loop, instructing it to process sources (events)
await loop.runAsync();
```

--------------------------------

### GJS Switch Component Implementation

Source: https://gjs.guide/extensions/development/accessibility

Implements a reusable `Switch` component in GJS, managing its boolean `state`. It interacts with accessibility roles (`Atk.Role.CHECK_BOX`) and updates CSS pseudo-classes (`checked`) for visual feedback. The component provides a `toggle()` method for state changes.

```JavaScript
const Switch = GObject.registerClass({
    Properties: {
        'state': GObject.ParamSpec.boolean(
            'state', 'state', 'state',
            GObject.ParamFlags.READWRITE,
            false),
    },
}, class Switch extends St.Bin {
    _init(state) {
        this._state = false;

        super._init({
            style_class: 'toggle-switch',
            accessible_role: Atk.Role.CHECK_BOX,
            state,
        });
    }

    get state() {
        return this._state;
    }

    set state(state) {
        if (this._state === state)
            return;

        if (state)
            this.add_style_pseudo_class('checked');
        else
            this.remove_style_pseudo_class('checked');

        this._state = state;
        this.notify('state');
    }

    toggle() {
        this.state = !this.state;
    }
});
```

--------------------------------

### GNOME Shell Extension: Overwriting Reference Leak

Source: https://gjs.guide/guides/gjs/memory-management

Demonstrates a reference leak caused by incorrectly assigning references to GObjects within an object property. The example shows how overwriting an entry in `this._indicators` leads to the loss of a reference to one `PanelMenu.Button`, preventing its destruction in `disable()`.

```js
import GLib from 'gi://GLib';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        this._indicators = {};

        const indicator1 = new PanelMenu.Button(0.0, 'MyIndicator1', false);
        const indicator2 = new PanelMenu.Button(0.0, 'MyIndicator2', false);

        Main.panel.addToStatusArea(GLib.uuid_string_random(), indicator1);
        Main.panel.addToStatusArea(GLib.uuid_string_random(), indicator2);

        this._indicators['MyIndicator1'] = indicator1;
        this._indicators['MyIndicator1'] = indicator2; // Overwrites indicator1 reference
    }

    disable() {
        for (const [name, indicator] of Object.entries(this._indicators))
            indicator.destroy();

        this._indicators = {};
    }
}
```

--------------------------------

### Create and Use Gio.PropertyAction with GObject Property

Source: https://gjs.guide/guides/gio/actions-and-menus

Demonstrates creating a Gio.PropertyAction bound to a GObject property. It shows how to initialize the action with an object and property name, connect to state changes, and update the property and action state. Supports read-write properties with basic types.

```javascript
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

const SomeObject = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.string(
            'example-property',
            'Example Property',
            'A read-write string property',
            GObject.ParamFlags.READWRITE,
            null
        ),
    },
}, class SomeObject extends GObject.Object {
});

const someInstance = new SomeObject({
    example_property: 'initial value',
});

someInstance.connect('notify::example-property', (object, _pspec) => {
    console.log(`GObject Property: ${object.example_property}`);
});

const propertyAction = new Gio.PropertyAction({
    name: 'example',
    object: someInstance,
    property_name: 'example-property',
});

propertyAction.connect('notify::state', (action, _pspec) => {
    console.log(`Action State: ${action.state.unpack()}`);
});

someInstance.example_property = 'new value';
propertyAction.change_state(GLib.Variant.new_string('newer value'));
```

--------------------------------

### Define GJS Signal Parameters with param_types

Source: https://gjs.guide/guides/gobject/subclassing

This snippet demonstrates how to define custom parameters for a GJS signal using the `param_types` key. Callbacks connected to this signal will receive these parameters as additional arguments, enabling richer data transfer from the emitter to the handler.

```javascript
const ParameterExample = GObject.registerClass({
    Signals: {
        'example-signal': {
            param_types: [GObject.TYPE_BOOLEAN, GObject.TYPE_STRING],
        },
    },
}, class ParameterExample extends GObject.Object {
});

const parameterExample = new ParameterExample();

parameterExample.connect('example-signal', (emittingObject, arg1, arg2) => {
    console.log(`user handler invoked: ${arg1}, ${arg2}`);
});

// Expected output: "user handler invoked: true, foobar"
parameterExample.emit('example-signal', true, 'foobar');
```

--------------------------------

### Iterate Directory Contents with Gio.FileEnumerator (Async Iterator)

Source: https://gjs.guide/guides/gio/file-operations

Lists files within a directory using the asynchronous iterator protocol introduced in GJS 1.74. It employs `Gio.File.enumerate_children_async` to get a `Gio.FileEnumerator` and then iterates through it using `for await...of` to retrieve `Gio.FileInfo` for each item.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const directory = Gio.File.new_for_path('.');

const iter = await directory.enumerate_children_async('standard::*', 
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);

for await (const fileInfo of iter)
    console.debug(fileInfo.get_name());
```

--------------------------------

### Cancel GIO Asynchronous Operations with Gio.Cancellable (JavaScript)

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Demonstrates how to cancel an ongoing asynchronous GIO operation using a Gio.Cancellable object. This example shows cancelling a file content loading operation and handling the cancellation within the callback. It highlights that a single Gio.Cancellable can manage multiple operations.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/**
 * This callback will be invoked once the operation has completed, even if
 * it was cancelled.
 *
 * @param {Gio.File} file - the file object
 * @param {Gio.AsyncResult} result - the result of the operation
 */
function loadContentsCb(file, result) {
    try {
        const [length, contents] = file.load_contents_finish(result);

        console.log(`Read ${length} bytes from ${file.get_basename()}`);
    } catch (e) {
        // If the operation was cancelled we probably did it on purpose, in
        // which case we may just want to mute the error
        if (!e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
            logError(e, `Reading ${file.get_basename()}`);
    }
}

const file = Gio.File.new_for_path('test-file.txt');

// This is the cancellable we will pass to the asynchronous method. We need to
// hold a reference to this somewhere if we want to cancel it.
const cancellable = new Gio.Cancellable();

// This method passes the file object to a task thread, reads the contents in
// that thread, then invokes loadContentsCb() in the main thread.
file.load_contents_async(GLib.PRIORITY_DEFAULT, cancellable, loadContentsCb);

// Cancel the operation by triggering the cancellable
cancellable.cancel();

// Note: Once a Gio.Cancellable has been cancelled, you should drop the reference to it and create a new instance for future operations.
```

--------------------------------

### Import using Legacy GJS `imports` Object

Source: https://gjs.guide/guides/gjs/intro

Shows how to import modules using GJS's older, custom `imports` object. This method accesses built-in modules as top-level properties and platform libraries via the `imports.gi` object.

```javascript
/* GJS's Built-in modules are top-level properties */
const Cairo = imports.cairo;
const Gettext = imports.gettext;
const System = imports.system;

/* Platform libraries are properties of `gi` the object */
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

/* Platform libraries with multiple versions must be defined before import */
imports.gi.versions.Gtk = '4.0';
const Gtk = imports.gi.Gtk;

/* User modules may be imported using a relative path
 * 
 * `utils.js` is in the subdirectory `lib`, relative to the current path. The
 * file extension is omitted from the import specifier.
 */
const Utils = imports.lib.utils;
```

--------------------------------

### Using Gtk.Application for GTK Apps

Source: https://gjs.guide/guides/gtk/3/10-building-app

Gtk.Application provides essential system integration and naming for GTK applications, overcoming limitations of basic widget display methods. It simplifies linking advanced widgets and ensures better user discoverability.

```APIDOC
Gtk.Application:
  __init__(application_id: str, flags: Gtk.ApplicationFlags = Gtk.ApplicationFlags.DEFAULT_FLAGS)
    application_id: A unique identifier for the application, following the reverse domain name notation (e.g., "org.example.MyApp").
    flags: Flags that control the application's behavior.

  Purpose:
    Manages application-wide resources, integration with the desktop environment, and command-line argument parsing.

  Benefits over simple widget display:
    - Ability to name your application.
    - System integration for applications (e.g., desktop entries, notifications).
    - Handles application lifecycle and event management.

  Related Concepts:
    - Gtk.Window: The main window for the application.
    - Gtk.Widget: Base class for all user interface elements.
    - Gtk.Builder: For loading UI definitions from XML files.
```

--------------------------------

### GtkBox can-focus Property Behavior

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Illustrates the change in GTK4 where setting 'can-focus' to False on a parent widget prevents child widgets from being focused. The example shows how to correctly enable focus for child widgets by setting 'can-focus' to True on the parent GtkBox.

```XML
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <property name="hexpand">1</property>
    <child>
        <object class="GtkToggleButton">
            <property name="visible">True</property>
            <property name="can-focus">True</property>
        </object>
    </child>
</object>
```

```XML
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="hexpand">1</property>
    <child>
        <object class="GtkToggleButton">
            <property name="visible">True</property>
            <property name="can-focus">True</property>
        </object>
    </child>
</object>
```

--------------------------------

### GJS: Match Signal Handler using `signal_handler_find`

Source: https://gjs.guide/guides/gobject/advanced

Demonstrates how to find a specific signal handler using `GObject.signal_handler_find`. This function allows matching handlers based on criteria like `detail` and `func`. Note that `Function.prototype.bind` creates new function instances, affecting handler matching.

```javascript
function notifyCallback(obj, pspec) {
    console.log(pspec.name);
}

const objectInstance = new GObject.Object();
const handlerId = objectInstance.connect('notify::property-name',
    notifyCallback);

const result = GObject.signal_handler_find(objectInstance, {
    detail: 'property-name',
    func: notifyCallback,
});

console.assert(result === handlerId);
```

--------------------------------

### Connecting GTK Menu Actions in JavaScript

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Connects signals to menu actions defined in the XML interface. It demonstrates creating Gio.SimpleActionGroup and adding actions with associated callbacks.

```javascript
prefsWidget.connect('realize', () => {

    let window = prefsWidget.get_root();
    let actionGroup = new Gio.SimpleActionGroup();

    let action = new Gio.SimpleAction({ name: 'other' });
    action.connect('activate', () => {
        log('Other Clicked');
    });
    actionGroup.add_action(action);

    let action2 = new Gio.SimpleAction({ name: 'test' });
    action2.connect('activate', () => {
        log('Test Clicked');
    });
    actionGroup.add_action(action2);

    window.insert_action_group('mygroup', actionGroup);
});
```

--------------------------------

### Run Nested GNOME Shell (Basic)

Source: https://gjs.guide/extensions/development/debugging

Starts a nested instance of GNOME Shell within a new D-Bus session. This allows GNOME Shell to export D-Bus services without conflicting with the host system. It's useful for testing GNOME Shell features in an isolated environment.

```sh
dbus-run-session -- gnome-shell --nested --wayland
```

--------------------------------

### Shell Utilities and Global Object

Source: https://gjs.guide/extensions/overview/architecture

Explains the 'Shell' module, which offers utilities and classes for GNOME Shell development, including the central 'global' object.

```APIDOC
Shell:
  Description: Effectively the library API for GNOME Shell itself.
  Components: Provides utilities and classes.
  Key Object: Includes the 'global' object.
  Reference: https://gjs-docs.gnome.org/#q=shell
```

--------------------------------

### GtkHeaderBar GTK4 Subtitle Implementation with XML

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

This XML example illustrates how to achieve the subtitle functionality in GTK4's `GtkHeaderBar` after the removal of the `set_subtitle()` function. It uses the `title-widget` property with a `GtkBox` containing two `GtkLabel` widgets, one for the title and one for the subtitle, styled with 'title' and 'subtitle' classes respectively.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
    <object class="GtkHeaderBar">
        <property name="title-widget">
            <object class="GtkBox">
                <property name="visible">True</property>
                <property name="can-focus">True</property>
                <property name="vexpand">1</property>
                <property name="valign">center</property>
                <property name="orientation">
                    vertical
                </property>
                <child>
                    <object class="GtkLabel">
                        <property name="label" translatable="yes">Title</property>
                        <property name="single-line-mode">True</property>
                        <property name="ellipsize">end</property>
                        <property name="width-chars">10</property>
                        <style>
                          <class name="title"/>
                        </style>
                    </object>
                </child>
                <child>
                    <object class="GtkLabel" id="subtitle">
                        <property name="label" translatable="yes">Sub Title</property>
                        <property name="single-line-mode">True</property>
                        <property name="ellipsize">end</property>
                        <property name="width-chars">10</property>
                        <style>
                          <class name="subtitle"/>
                        </style>
                    </object>
                </child>
            </object>
        </property>
    </object>
</interface>
```

--------------------------------

### Recommended JavaScript Practices for Extensions

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Developers are encouraged to write clean, modern JavaScript code. This includes using ES6 classes and asynchronous programming patterns like async/await, and employing linters for error checking.

```javascript
// Use modern features like ES6 classes and async/await
class MyExtension {
    constructor(uuid) {
        this.uuid = uuid;
    }

    enable() {
        // Initialize extension logic here
        log("MyExtension enabled");
    }

    disable() {
        // Clean up extension logic here
        log("MyExtension disabled");
    }
}

// Example of async/await usage (conceptual)
async function fetchData() {
    try {
        const response = await fetch('some-api-endpoint');
        const data = await response.json();
        log(data);
    } catch (error) {
        logError(error);
    }
}
```

--------------------------------

### GJS: Block and Unblock Signal Handlers with `signal_handlers_block_matched`

Source: https://gjs.guide/guides/gobject/advanced

Explains how to temporarily block signals from being emitted using `GObject.signal_handlers_block_matched` and resume normal behavior with `GObject.signal_handlers_unblock_matched`. This is useful for preventing reentrancy issues when a signal handler might trigger the same signal again. Matching is done via `signalId`, `detail`, and `func`.

```javascript
function notifyLabelCallback(object, _pspec) {
    console.log('notify::label emitted');

    const blocked = GObject.signal_handlers_block_matched(object, {
        func: notifyLabelCallback,
        signalId: 'notify',
        detail: 'label',
    });
    console.log(`Blocked ${blocked} handlers`);

    // The handler will not be run recursively, since it is currently blocked
    object.label = object.label.toUpperCase();

    GObject.signal_handlers_unblock_matched(object, {
        func: notifyLabelCallback,
        signalId: 'notify',
        detail: 'label',
    });
    console.log(`Unblocked ${blocked} handlers`);
}

const upperCaseLabel = new Gtk.Label();
const notifyLabelId = upperCaseLabel.connect('notify::label',
    notifyLabelCallback);
upperCaseLabel.label = 'example';
```

--------------------------------

### Use GJS Signal Accumulators (e.g., TRUE_HANDLED)

Source: https://gjs.guide/guides/gobject/subclassing

This snippet illustrates the use of signal accumulators in GJS, specifically `GObject.AccumulatorType.TRUE_HANDLED`. This accumulator type allows a signal to stop emitting further callbacks once any handler returns `true`, provided the signal's `return_type` is `GObject.TYPE_BOOLEAN`.

```javascript
const AccumulatorExample = GObject.registerClass({
    Signals: {
        'example-signal': {
            flags: GObject.SignalFlags.RUN_LAST,
            accumulator: GObject.AccumulatorType.TRUE_HANDLED,
            return_type: GObject.TYPE_BOOLEAN,
        },
    },
}, class AccumulatorExample extends GObject.Object {
    on_example_signal() {
        console.log('default handler invoked');
        return true;
    }
});

const accumulatorExample = new AccumulatorExample();

accumulatorExample.connect('example-signal', () => {
    console.log('first user handler');
    return false;
});

accumulatorExample.connect('example-signal', () => {
    console.log('second user handler');
    return true;
});

accumulatorExample.connect('example-signal', () => {
    console.log('third user handler');
    return true;
});

/* Expected output:
 *   1. "first user handler"
 *   2. "second user handler"
 */
accumulatorExample.emit('example-signal');
```

--------------------------------

### APIDOC: Extension Class Methods and Properties

Source: https://gjs.guide/extensions/topics/extension

Documentation for the Extension class, detailing its constructor, lifecycle methods (enable, disable), preference opening, and inherited properties. This class serves as the base for extensions to inherit from.

```APIDOC
Extension:
  __init__(metadata)
    metadata: The instance metadata object

  enable()
    Called to enable an extension

  disable()
    Called to disable an extension

  openPreferences()
    Open the extension's preferences window

  Properties (inherited from ExtensionBase):
    dir: Gets the extension's directory (Gio.File)
    metadata: The instance metadata object
    path: Gets the path to the extension's directory
    uuid: Gets the extension's UUID value
```

--------------------------------

### Add St.ScrollView to PopupMenu in GNOME Shell Extension

Source: https://gjs.guide/extensions/topics/st-widgets

Demonstrates how to create and add an St.ScrollView widget to a PopupMenuSection within a GNOME Shell extension. This example shows the integration of St widgets into the GNOME Shell UI, including creating menu items and adding them to the scrollable area.

```javascript
// #region imports
import St from 'gi://St';
// #endregion imports

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        const scrollView = new St.ScrollView();

        const section1 = new PopupMenu.PopupMenuSection();

        //  Use add_actor() to add scrollview to  PopupMenuSection
        scrollView.add_actor(section1.actor);

        for (let i = 0; i < 30; i++) {
            const pmItem = new PopupMenu.PopupMenuItem(`This is item ${i}`, {});

            section1.addMenuItem(pmItem);
        }

        this._indicator.menu.box.add_child(scrollView);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
```

--------------------------------

### GSettings Schema Compilation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-44

Instructions for handling GSettings Schema files when porting extensions to GNOME Shell 44. It specifies which files to include and which to avoid shipping.

```APIDOC
GSettings Schema Compilation:

GNOME Shell 44 can compile GSettings Schemas during extension installation.

For extensions supporting GNOME Shell 44 and later, only include the `schemas/org.gnome.shell.extensions.<schema-id>.gschema.xml` file(s).
Avoid shipping the `gschemas.compiled` file in the package.
```

--------------------------------

### Custom Action Button Implementation (GJS)

Source: https://gjs.guide/extensions/topics/quick-settings

Defines a custom action button component using `QuickSettings.QuickSettingsItem`. This snippet sets up the button's appearance with an icon and accessible name, and connects a click signal to log a message. It's designed for use in the quick settings action area.

```javascript
const ExampleButton = GObject.registerClass(
    class ExampleButton extends QuickSettings.QuickSettingsItem {
        _init() {
            super._init({
                style_class: 'icon-button',
                can_focus: true,
                icon_name: 'selection-mode-symbolic',
                accessible_name: _('Example Action'),
            });

            this.connect('clicked', () => console.log('activated'));
        }
    });

```

--------------------------------

### GNOME Shell Extension Lifecycle Management

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Extensions must manage their resources correctly using the enable() and disable() functions. The enable() function is used for initialization like creating objects and connecting signals, while disable() is for cleanup.

```javascript
// 1. Don't create or modify anything before enable() is called
// 2. Use enable() to create objects, connect signals and add main loop sources
// 3. Use disable() to cleanup anything done in enable()
```

--------------------------------

### Recursively Delete Directories with Gio.File in JavaScript

Source: https://gjs.guide/guides/gio/file-operations

This example provides functions to recursively operate on files and directories asynchronously, preventing blocking of the main thread. The `recursiveFileOperation` function walks a directory tree, and the `recursiveDeleteCallback` handles operations like deleting regular files or recursing into subdirectories. It utilizes Gio.File, GLib, and Gio.Cancellable for robust file system management.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/**
 * Callback signature for recursiveFileOperation().
 *
 * The example callback `recursiveDeleteCallback()` demonstrates how to
 * recursively delete a directory of files, while skipping unsupported file types.
 *
 * @param {Gio.File} file - the file to operate on
 * @param {Gio.FileType} fileType - the file type
 * @param {Gio.Cancellable} [cancellable] - optional cancellable
 * @returns {Promise|null} a Promise for the operation, or %null to ignore
 */
function recursiveDeleteCallback(file, fileType, cancellable = null) {
    switch (fileType) {
    case Gio.FileType.REGULAR:
    case Gio.FileType.SYMBOLIC_LINK:
        // Delete regular files and symbolic links
        return file.delete(cancellable);

    case Gio.FileType.DIRECTORY:
        // Recursively call for directories
        return recursiveFileOperation(file, recursiveDeleteCallback,
            cancellable);

    default:
        // Ignore other file types
        return null;
    }
}

/**
 * Recursively operate on @file and any children it may have.
 *
 * @param {Gio.File} file - the file or directory to delete
 * @param {Function} callback - a function that will be passed the file,
 *     file type (e.g. regular, directory), and @cancellable
 * @param {Gio.Cancellable} [cancellable] - optional cancellable
 * @returns {Promise} a Promise for the operation
 */
async function recursiveFileOperation(file, callback, cancellable = null) {
    // Query file type without following symlinks
    const fileInfo = await file.query_info_async('standard::type',
        Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT,
        cancellable);
    const fileType = fileInfo.get_file_type();

    // If @file is a directory, collect all the operations as Promise branches
    // and resolve them in parallel
    if (fileType === Gio.FileType.DIRECTORY) {
        // Enumerate children of the directory
        const iter = await file.enumerate_children_async('standard::type',
            Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT,
            cancellable);

        const branches = [];

        while (true) {
            // Fetch up to 10 files at a time asynchronously
            const fileInfos = await iter.next_files_async(10, 
                GLib.PRIORITY_DEFAULT, cancellable);

            if (fileInfos.length === 0)
                break;

            for (const info of fileInfos) {
                const child = iter.get_child(info);
                const childType = info.get_file_type();

                // The callback decides whether to process a file, including
                // whether to recurse into a directory
                const branch = callback(child, childType, cancellable);

                if (branch)
                    branches.push(branch);
            }
        }

        // Wait for all child operations to complete
        await Promise.all(branches);
    }

    // Return the Promise for the top-level file operation
    return callback(file, cancellable);
}
```

--------------------------------

### Define GObject Subclass in GJS

Source: https://gjs.guide/guides/gjs/intro

Demonstrates subclassing GObject using GJS's `GObject.registerClass` helper. This method allows defining GObject properties, signals, and integrating with the GObject type system.

```javascript
import GObject from 'gi://GObject';

const SubclassExample = GObject.registerClass({
    GTypeName: 'SubclassExample',
    Properties: {
        'example-property': GObject.ParamSpec.boolean(
            'example-property',
            'Example Property',
            'A read-write boolean property',
            GObject.ParamFlags.READWRITE,
            true
        ),
    },
    Signals: {
        'example-signal': {},
    },
}, class SubclassExample extends GObject.Object {
    constructor(constructProperties = {}) {
        super(constructProperties);
    }

    get example_property() {
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        if (this.example_property === value)
            return;

        this._example_property = value;
        this.notify('example-property');
    }
});
```

--------------------------------

### GJS ES Modules and Platform Imports

Source: https://gjs.guide/guides/gjs/intro

GJS supports standard ES Modules for JavaScript code organization. It also provides special specifiers for importing GNOME Platform libraries, such as Gio and Gtk, enabling seamless integration with the GNOME development environment.

```JavaScript
import Gio from 'gi://Gio?version=2.0';
import Gtk from 'gi://Gtk?version=4.0';

// Using imported modules
const file = Gio.File.new_for_path('my_file.txt');
const button = new Gtk.Button({ label: 'Click Me' });
```

--------------------------------

### Import GI Libraries (Old vs New)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Demonstrates the syntax change for importing GObject-Introspection (GI) libraries from the old `imports.gi` system to the new ESM `import` syntax using `gi://` URIs.

```javascript
// Before GNOME 45
const GLib = imports.gi.GLib;

// GNOME 45
import GLib from 'gi://GLib';
```

--------------------------------

### Async/Await Promise Usage in GJS

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Demonstrates the use of `async`/`await` syntax with JavaScript Promises in GJS for more synchronous-looking asynchronous code. It shows how to handle sequential asynchronous operations and errors using `try...catch` blocks within an `async` function, integrating with the GLib main loop.

```javascript
/* eslint-disable no-await-in-loop */

import GLib from 'gi://GLib';

const loop = new GLib.MainLoop(null, false);

// Returns a Promise that randomly fails or succeeds after one second
function unreliablePromise() {
    return new Promise((resolve, reject) => {
        GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            if (Math.random() >= 0.5)
                resolve('success');
            else
                reject(Error('failure'));

            return GLib.SOURCE_REMOVE;
        });
    });
}

// An example async function, demonstrating how Promises can be resolved
// sequentially while catching errors in a try..catch block.
async function exampleAsyncFunction() {
    try {
        let count = 0;

        while (true) {
            await unreliablePromise();
            console.log(`Promises resolved: ${++count}`);
        }
    } catch (e) {
        logError(e);
        loop.quit();
    }
}

// Run the async function
exampleAsyncFunction();

await loop.runAsync();
```

--------------------------------

### GSettings Schema Definition

Source: https://gjs.guide/guides/gtk/3/16-settings

Defines the structure for application settings using an XML schema file. It specifies the schema ID, path, and gettext domain.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<schemalist gettext-domain="[App Name]">
	<schema id="[your.app.id]" path="[your/app/path]">
	</schema>
</schemalist>
```

--------------------------------

### Opening Extension Preferences

Source: https://gjs.guide/extensions/development/preferences

Demonstrates how to open the preferences window for a GNOME Shell extension using the `gnome-extensions` command-line tool.

```sh
gnome-extensions prefs
```

--------------------------------

### Create Gio.SimpleAction (Basic, Parameter, Stateful) in GJS

Source: https://gjs.guide/guides/gio/dbus

Demonstrates creating different types of Gio.SimpleAction: basic, parameter-accepting, and stateful. It shows how to connect to the 'activate' signal and handle state changes, requiring Gio and GLib.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// This is the most basic an action can be. It has a name and can be activated
// with no parameters, which results in the callback being invoked.
const basicAction = new Gio.SimpleAction({
    name: 'basicAction',
});

basicAction.connect('activate', (action, _parameter) => {
    console.log(`${action.name} activated!`);
});

// An action with a parameter
const paramAction = new Gio.SimpleAction({
    name: 'paramAction',
    parameter_type: new GLib.VariantType('s'),
});

paramAction.connect('activate', (action, parameter) => {
    console.log(`${action.name} activated: ${parameter.unpack()}`);
});

// And a stateful action. The state type is set at construction from the initial
// value, and can't be changed afterwards.
const stateAction = new Gio.SimpleAction({
    name: 'stateAction',
    state: GLib.Variant.new_boolean(true),
});

stateAction.connect('notify::state', (action, _pspec) => {
    console.log(`${action.name} changed: ${action.state.print(true)}`);
});
```

--------------------------------

### GJS: Create Sections and Submenus with Gio.MenuModel

Source: https://gjs.guide/guides/gio/actions-and-menus

Illustrates how to structure menus using sections and submenus with Gio.MenuModel in GJS. Shows how to create nested menus for related actions and how to group items visually using sections, optionally with labels.

```javascript
import Gio from 'gi://Gio';

const menuModel = new Gio.Menu();

/*
 * Submenus should group related items, that follow logically from the parent.
 */
const menuSubmenu = new Gio.Menu();
menuSubmenu.append('Open', 'win.open');
menuSubmenu.append('Open In New Tab', 'win.open-tab');
menuSubmenu.append('Open In New Window', 'win.open-window');
menuModel.append_submenu('Open', menuSubmenu);

/*
 * Menu sections are a way to logically and visually group items, while keeping them in the same menu level.
 * If a label is given when adding the section, it will usually be presented in
 * a way that associates it with the separator.
 */
const menuSection = new Gio.Menu();
menuSection.append('Preferences', 'app.preferences');
menuSection.append('Help', 'app.help');
menuSection.append('About GJS', 'app.about');
menuModel.append_section(null, menuSection);

const quitSection = new Gio.Menu();
quitSection.append('Quit', 'app.quit');
menuModel.append_section(null, quitSection);
```

--------------------------------

### Create and Export Gio.MenuModel in GJS

Source: https://gjs.guide/guides/gio/dbus

Demonstrates creating a Gio.MenuModel instance in GJS, appending basic items, parameter items with icons, and state items. It also covers exporting the menu model to D-Bus for remote access using Gio.DBus.session.

```js
import Gio from 'gi://Gio';

// Here we're creating the top-level menu. Submenus and sections can be created
// the same way and can be added to a parent menu with `append_submenu()` and
// `append_section()`.
const menuModel = new Gio.Menu();

// For the most common use case you can simply use Gio.Menu.prototype.append()
menuModel.append('Basic Item Label', 'test.basicAction');

// In cases you need the `Gio.MenuItem` instance to add more attributes, you
// can build an item manually. Notice that the second argument is a "detailed"
// action string, which can handle some simple types inline. Consult the
// documentation for how these can be used.
const paramItem = Gio.MenuItem.new('Parameter Item', 'test.paramAction::string');

// Icons are `Gio.Icon` instances, an abtsraction of icons that is serialized as
// a `a{sv}` variant when sent over D-Bus. Note that it's up to the client-side
// to actually do something useful with this.
const paramIcon = new Gio.ThemedIcon({
    name: 'dialog-information-symbolic',
});

paramItem.set_icon(paramIcon);

// Once we add the item to the menu, making changes to the `paramItem` instance
// or the GIcon won't affect the menu in any way.
menuModel.append_item(paramItem);

// A number of the Gtk Widgets that are built from GMenuModels can automatically
// handle simple action types like stateful actions with booleans. This item
// will be turned into a Gtk.CheckButton for us.
const stateItem = Gio.MenuItem.new('State Item', 'test.stateAction');
menuModel.append_item(stateItem);

// Export and unexport a menu just like GActionGroup
const connection = Gio.DBus.session;

const menuId = connection.export_menu_model(
    '/guide/gjs/Test',
    menuModel
);

connection.unexport_menu_model(menuId);
```

--------------------------------

### GJS: Create a Basic Gtk.Button

Source: https://gjs.guide/guides/gtk/3/07-buttons

Demonstrates how to create a standard Gtk.Button in GJS. This button displays text and triggers a callback function when clicked. It requires the Gtk module and initializes the GTK environment.

```javascript
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.Button({ label: 'Click Me!' });
button.connect('clicked', () => {
    log('The button was clicked!');
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();

```

--------------------------------

### Basic GNOME Extension JavaScript Code (JS)

Source: https://gjs.guide/extensions/development/creating

A minimal JavaScript file (`extension.js`) for a GNOME Shell extension, demonstrating how to import necessary modules, define an `Extension` class, and implement `enable`/`disable` methods to add a panel indicator.

```js
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
```

--------------------------------

### Consuming Gio.ListModel with GJS

Source: https://gjs.guide/guides/gio/list-models

Demonstrates how to use `Gio.ListStore` to manage a list of `Gio.File` objects and handle item changes. It connects to the `items-changed` signal to update a conceptual list widget, showing how to splice and sort items.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/* This array will take the place of a list view, or other widget.
 * 
 * Internally, many widgets like GtkListBox will operate in a very similar way,
 * connecting the `items-changed` signal to create and destroy widgets at the
 * correct position.
 */
const listWidget = [];

const listStore = Gio.ListStore.new(Gio.File);

listStore.connect('items-changed', (list, position, removed, added) => {
    console.log(`position: ${position}, removed: ${removed}, added: ${added}`);

    /* Items are added and removed from the same position, so the removals
     * must be handled first.
     * 
     * NOTE: remember that the items have already changed in the model when this
     *       signal is emitted, so you can not query removed objects.
     */
    while (removed--)
        listWidget.splice(position, 1);

    /* Once the removals have been processed, the additions must be inserted
     * at the same position.
     */
    for (let i = 0; i < added; i++)
        listWidget.splice(position + i, 0, list.get_item(position + i));
});

/* Splicing the items will result in a single emission of `items-changed`, with
 * a callback signature of `position = 0, removed = 0, added = 3`.
 * 
 * Sorting the items will result in a single emission of `items-changed`, with
 * a callback signature of `position = 0, removed = 3, added = 3`.
 */
listStore.splice(0, 0, [
    Gio.File.new_for_path('/'),
    Gio.File.new_for_path('/home'),
    Gio.File.new_for_path('/home/user'),
]);

listStore.sort((object1, object2) => {
    return object1.get_path().localeCompare(object2.get_path());
});

/* Inserting one at a time results in a three emissions of `items-changed`, with
 * a callback signature of `position = ?, removed = 0, added = 1`.
 * 
 * WARNING: when using a sorted list model all items must be sorted, with the
 *          same sorting function, or the list behavior becomes undefined.
 */
const moreItems = [
    Gio.File.new_for_path('/home/user/Downloads'),
    Gio.File.new_for_path('/home/user/Downloads/TV'),
    Gio.File.new_for_path('/home/user/Downloads/TV/Teddy Ruxpin'),
];

for (const item of moreItems) {
    listStore.insert_sorted(item, (object1, object2) => {
        return object1.get_path().localeCompare(object2.get_path());
    });
}

/* We should now be in state where the number and order of items is the same,
 * both in the list model and the list consumer.
 */
if (listStore.n_items !== listWidget.length)
    throw Error('Should never be thrown');

for (let i = 0; i < listStore.n_items; i++) {
    if (listWidget[i] !== listStore.get_item(i))
        throw Error('Should never be thrown');
}
```

--------------------------------

### Define Legacy GObject Class in GJS

Source: https://gjs.guide/guides/gjs/intro

Shows the older, custom syntax used in GJS for defining GObject subclasses prior to ES6 classes. This involves using `imports.lang.Class` and specifying GObject integration details.

```javascript
const Lang = imports.lang;

const GObject = imports.gi.GObject;

var ExampleSubclass = new Lang.Class({
    Name: 'ExampleSubclass',
    GTypeName: 'ExampleSubclass',
    Signals: {},
    InternalChildren: [],
    Children: [],
    Extends: GObject.Object,
    _init(constructArguments) {
        this.parent(constructArguments);
    },
});
```

--------------------------------

### Use Low-Level D-Bus Proxies in GJS

Source: https://gjs.guide/guides/gio/dbus

Illustrates the usage of low-level D-Bus proxies with Gio.DBusProxy for interacting with D-Bus services. It covers asynchronous proxy creation, connecting to property changes and signals, and making method calls. Dependencies include Gio and GLib modules.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// Constructing a proxy
try {
    const proxy = await Gio.DBusProxy.new_for_bus(
        Gio.BusType.SESSION,
        Gio.DBusProxyFlags.NONE,
        null,
        'org.gnome.Shell',
        '/org/gnome/Shell',
        'org.gnome.Shell',
        null);

    /* Properties
     *
     * Similar to `GObject.Object::notify`, this signal is emitted when one or
     * more properties have changed on the proxy.
     */
    proxy.connect('g-properties-changed', (_proxy, changed, invalidated) => {
        const properties = changed.deepUnpack();

        /* These properties are already cached when the signal is emitted.
         */
        for (const [name, value] of Object.entries(properties))
            console.log(`Property ${name} set to ${value.unpack()}`);

        /* These properties have been marked as changed, but not cached.
         * 
         * This is usually done for performance reasons, but you can set the
         * `Gio.DBusProxyFlags.GET_INVALIDATED_PROPERTIES` flag at construction
         * to override this, in which case this will always be empty.
         */
        for (const name of invalidated)
            console.log(`Property ${name} changed`);
    });

    /* Signals
     *
     * This GObject signal is emitted when the service emits an D-Bus signal on
     * the interface the proxy is watching.
     */
    proxy.connect('g-signal', (_proxy, senderName, signalName, parameters) => {
        if (signalName === 'AcceleratorActivated')
            console.log(`Accelerator Activated: ${parameters.print(true)}`);
    });

    /* Service Status
     *
     * The `g-name-owner` property changes between a unique name and `null`
     * when the service appears or vanishes from the bus, respectively. The
     * proxy remains valid, allowing you to track the service state.
     */
    proxy.connect('notify::g-name-owner', (_proxy, _pspec) => {
        if (proxy.g_name_owner === null)
            console.log(`${proxy.g_name} has vanished`);
        else
            console.log(`${proxy.g_name} has appeared`);
    });

    /* Method calls only require the method name as the well-known name,
     * object path and interface name are bound to the proxy.
     */
    const reply = await proxy.call('FocusSearch', null,
        Gio.DBusCallFlags.NONE, -1, null);
} catch (e) {
    if (e instanceof Gio.DBusError)
        Gio.DBusError.strip_remote_error(e);

    logError(e);
}
```

--------------------------------

### metadata.json Structure and Key Requirements

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Defines the structure and validation rules for the `metadata.json` file, detailing required keys like `uuid`, `name`, `description`, `shell-version`, `url`, `session-modes`, and `donations`.

```APIDOC
metadata.json Schema:
  - name: Extension name. Must be unique, or clearly indicate a fork.
  - uuid: Unique identifier in the format `extension-id@namespace`. Namespace restrictions apply (e.g., no 'gnome.org').
  - description: Extension description, can include paragraphs and lists.
  - version: Deprecated field for internal use.
  - shell-version: List of supported GNOME Shell versions (e.g., `["3.38", "40", "41.alpha"]`).
  - url: Link to repository (e.g., GitHub, GitLab) for issues and information.
  - session-modes: Specifies modes like `user` or `unlock-dialog`. Drop if only `user` mode is used.
  - donations: Optional field for donation links, using predefined keys.
```

```json
{
    "uuid": "color-button@my-account.github.io",
    "name": "ColorButton",
    "description": "ColorButton adds a colored button to the panel.\n\nIt is a fork of MonochromeButton.",
    "shell-version": [ "3.38", "40", "41.alpha" ],
    "url": "https://github.com/my-account/color-button",
    "session-modes":  [ "unlock-dialog", "user" ]
}
```

--------------------------------

### Gtk.Application Creation

Source: https://gjs.guide/guides/gtk/3/10-building-app

Creates a new Gtk.Application instance with a unique application ID. This ID is crucial for the application's lifecycle and integration within the GNOME environment.

```js
const application = new Gtk.Application({
    application_id: 'org.gnome.Sandbox.ImageViewerExample',
    flags: Gio.ApplicationFlags.FLAGS_NONE
});

...
```

--------------------------------

### Define Standard ES Class in GJS

Source: https://gjs.guide/guides/gjs/intro

Illustrates defining a standard JavaScript class using ES6 syntax within GJS. This includes a constructor and getter/setter for a class property.

```javascript
class ClassExample {
    constructor() {
        this._initialized = true;
    }

    get example_property() {
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        if (this.example_property === value)
            return;

        this._example_property = value;
    }
}
```

--------------------------------

### GJS: Create Menu Items with Gio.MenuModel

Source: https://gjs.guide/guides/gio/actions-and-menus

Demonstrates creating menu items using Gio.MenuModel in GJS. Covers adding simple items linked to actions, items with specific parameters, and items with custom attributes like icons and disclaimer URLs. It also shows how to use actions with string or boolean states for radio buttons and checkboxes.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const menuModel = new Gio.Menu();

/*
 * Items with parameterless GActions can be added very easily, while those with
 * simple parameters can be set using a detailed action.
 */
menuModel.append('See full menu', 'pizza.full-menu');
menuModel.append('House Pizza', 'pizza.deal::today');

/*
 * In other cases, you may want to build items manually and add an icon or
 * custom attributes. Note that the consumer of the menu will decide if an icon
 * is displayed.
 */
const allergyItem = new Gio.MenuItem();

allergyItem.set_label('Allergy Warning');
allergyItem.set_action_and_target_value('pizza.allergyWarning');
allergyItem.set_icon(Gio.Icon.new_for_string('dialog-warning-symbolic'));
allergyItem.set_attribute('disclaimer-url',
    GLib.Variant.new_string('https://www.pizza.com/allergy-warning'));

menuModel.append_item(allergyItem);

/*
 * Actions with a string state type (`s`) can be used for a group of radio
 * buttons, by specifying the same action name with different target values.
 *
 * This works well with a GPropertyAction bound to a GObject property holding
 * an enumeration, since they are stored as strings.
 */
menuModel.append('Cheese', 'pizza.style::cheese');
menuModel.append('Hawaiian', 'pizza.style::hawaiian');
menuModel.append('Pepperoni', 'pizza.style::pepperoni');
menuModel.append('Vegetarian', 'pizza.style::vegetarian');

/*
 * Actions with a boolean state type (`b`) will have a checkbox.
 */
menuModel.append('Extra Cheese', 'pizza.extra-cheese');
```

--------------------------------

### Create and Configure PopupMenuItem in GJS

Source: https://gjs.guide/extensions/topics/popup-menu

Demonstrates how to create a basic PopupMenuItem with a label, set its ornament, disable it, and connect to its 'activate' signal. It shows how to handle pointer button presses within the signal handler.

```javascript
import Clutter from 'gi://Clutter';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// PopupMenuItem is a subclass of PopupBaseMenuItem
const menuItem = new PopupMenu.PopupMenuItem('Item Label', {
    active: false,
    can_focus: true,
    hover: true,
    reactive: true,
    style_class: 'my-menu-item',
});

// Adding an ornament
menuItem.setOrnament(PopupMenu.Ornament.CHECK);

// Disabling the item (active property will no longer change)
menuItem.sensitive = false;

// Watching the `activate` signal
menuItem.connect('activate', (item, event) => {
    // Do something special for pointer buttons
    if (event.get_type() === Clutter.EventType.BUTTON_PRESS)
        console.log('Pointer was pressed!');

    return Clutter.EVENT_PROPAGATE;
});
```

--------------------------------

### GtkPicture Creation in GJS

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Shows how to create a GtkPicture widget in JavaScript (GJS) for displaying images in GTK4. It uses `Gtk.Picture.new_for_filename` and demonstrates setting its size request.

```js
const {Gtk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let picture = Gtk.Picture.new_for_filename(Me.dir.get_path() + "/image.png");
picture.set_size_request(800, 600);
```

--------------------------------

### Gio.UnixInputStream Relocation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Explains the relocation of Gio.UnixInputStream to a new module and the recommended way to use it.

```javascript
// Old usage (deprecated)
// Gio.UnixInputStream

// New usage
// GioUnix.InputStream
```

```APIDOC
Gio.UnixInputStream has been moved to the GioUnix module.

To use it, import and reference it as GioUnix.InputStream.

Example:
import GioUnix from 'gi://GioUnix?version=2.0';

// ... later in code ...
let inputStream = new GioUnix.InputStream(...);
```

--------------------------------

### QuickSettings: Adding items above Background Apps menu

Source: https://gjs.guide/extensions/upgrading/gnome-shell-44

Provides a JavaScript function to add items to the GNOME Shell quick settings menu. It ensures custom tiles are positioned correctly above the 'Background Apps' menu by manipulating the menu's grid layout.

```javascript
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;

function addQuickSettingsItems(items) {
    // Add the items with the built-in function
    QuickSettingsMenu._addItems(items);

    // Ensure the tile(s) are above the background apps menu
    for (const item of items) {
        QuickSettingsMenu.menu._grid.set_child_below_sibling(item,
            QuickSettingsMenu._backgroundApps.quickSettingsItems[0]);
    }
}
```

--------------------------------

### Background Apps UI and Access

Source: https://gjs.guide/extensions/upgrading/gnome-shell-44

Details on the new Background Apps section in GNOME Shell 44's quick settings, including its programmatic access, creation context, and CSS style classes for UI elements.

```APIDOC
Background Apps UI and Access:

`ui.status.backgroundApps` is a new quick settings section displaying background applications.

`BackgroundAppMenuItem` is used for each item, featuring a close button to quit the app via D-Bus or SIGKILL.

Key access points and styling:
- Direct Access: `ui.main.panel.statusArea.quickSettings._backgroundApps`
- Created In: `ui.panel.QuickSettings._init()`
- Style class (container): `.background-apps-quick-toggle`
- Style class (item): `.background-app-item`
- Style class (item close button): `.background-app-item .close-button`
```

--------------------------------

### Connect to Property Notification Signal

Source: https://gjs.guide/guides/gobject/basics

Demonstrates how to connect to the `GObject.Object::notify` signal for a specific property ('label' in this case) to execute a callback when the property's value changes. The callback receives the emitting object and property specification.

```js
const changingLabel = Gtk.Label.new('Original Label');

const labelId = changingLabel.connect('notify::label', (object, _pspec) => {
    console.log(`New label is "${object.label}"`);
});
```

--------------------------------

### GNOME Shell 43 Quick Settings API

Source: https://gjs.guide/extensions/upgrading/gnome-shell-43

GNOME Shell 43 replaces the aggregateMenu with Quick Settings. This snippet outlines the direct access points and key UI components for implementing custom quick settings.

```APIDOC
GNOME Shell 43 Quick Settings API:

Direct access to the Quick Settings panel:
  Main.panel.statusArea.quickSettings

Column count for Quick Settings:
  ui.panel.N_QUICK_SETTINGS_COLUMNS

Panel menu button reference:
  ui.panel.QuickSettings

Key UI components for Quick Settings:
  QuickToggle: Primary entry point for creating toggle buttons.
  QuickMenuToggle: Similar to QuickToggle but includes a menu.
  QuickSlider: Used for creating slider controls like brightness or volume.
  QuickSettingsMenu: Allows adding a new quick settings menu instead of items to the existing panel.

Example usage for implementing quick settings can be found in the 'Quick Settings' topic guide.
```

--------------------------------

### Create GNOME Notification

Source: https://gjs.guide/extensions/topics/notifications

Demonstrates how to instantiate a new notification with custom properties like source, title, body, icon, and urgency level.

```javascript
const notification = new MessageTray.Notification({
    // The source of the notification
    source: customSource,
    // A title for the notification
    title: _('Custom Notification'),
    // The content of the notification
    body: _('This notification uses a custom source and policy'),
    // An icon for the notification (defaults to the source's icon)
    gicon: new Gio.ThemedIcon({name: 'dialog-warning'},
    // Same as `gicon`, but takes a themed icon name
    iconName: 'dialog-warning',
    // The urgency of the notification
    urgency: MessageTray.Urgency.NORMAL,
});
```

--------------------------------

### GNOME Shell: Create Preferences Window Pages Programmatically

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

Shows how to create multiple `Adw.PreferencesPage` and `Adw.PreferencesGroup` widgets directly in GJS code and add them to the preferences window.

```javascript
const {Adw} = imports.gi;

function fillPreferencesWindow(window) {
    let page1 = Adw.PreferencesPage.new();
    page1.set_title('First Page');
    page1.set_name('first-page');
    page1.set_icon_name('folder-symbolic');

    let group1 = Adw.PreferencesGroup.new();
    group1.set_title('Group in first page');
    page1.add(group1);

    let page2 = Adw.PreferencesPage.new();
    page2.set_title('Second Page');
    page2.set_name('second-page');
    page2.set_icon_name('folder-pictures-symbolic');

    let group2 = Adw.PreferencesGroup.new();
    group2.set_title('Group in second page');
    page2.add(group2);

    window.add(page1);
    window.add(page2);
}
```

--------------------------------

### PopupMenu Class API

Source: https://gjs.guide/extensions/topics/popup-menu

Provides the constructor and methods for the PopupMenu class, which represents a basic popup menu. It details how to create, configure, and manage menu items and their appearance.

```APIDOC
PopupMenu Class:

Parent Class: PopupMenu.PopupMenuBase

A basic popup menu.

Methods:

new PopupMenu(sourceActor, arrowAlignment, arrowSide)
  - Constructor for the PopupMenu.
  - Parameters:
    - sourceActor (Clutter.Actor): The Clutter.Actor the menu points to.
    - arrowAlignment (Number): A number between 0..1 for the alignment of the box pointer arrow.
    - arrowSide (St.Side): The St.Side the box pointer arrow is on.

setArrowOrigin(origin)
  - Sets the origin for drawing the box pointer.
  - Parameters:
    - origin (Number): A coordinate on the x-axis or y-axis, depending on the construct-time arrowSide parameter.

setSourceAlignment(alignment)
  - Sets the arrow alignment for the box pointer.
  - Parameters:
    - alignment (Number): A number between 0..1.
```

--------------------------------

### GJS: Async File Load with Callbacks (JavaScript)

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Demonstrates loading file contents asynchronously using a callback function. It utilizes Gio.File and GLib for asynchronous operations, invoking a provided callback upon completion. This method is functional but less readable than modern async patterns.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/**
 * This callback will be invoked once the operation has completed.
 *
 * @param {Gio.File} file - the file object
 * @param {Gio.AsyncResult} result - the result of the operation
 */
function loadContentsCb(file, result) {
    try {
        const [length, contents] = file.load_contents_finish(result);

        console.log(`Read ${length} bytes from ${file.get_basename()}`);
    } catch (e) {
        logError(e, `Reading ${file.get_basename()}`);
    }
}

const file = Gio.File.new_for_path('test-file.txt');

// This method passes the file object to a task thread, reads the contents in
// that thread, then invokes loadContentsCb() in the main thread.
file.load_contents_async(GLib.PRIORITY_DEFAULT, null, loadContentsCb);
```

--------------------------------

### Instantiate and Check GObject Interface Implementation in GJS

Source: https://gjs.guide/guides/gobject/interfaces

Illustrates how to create an instance of a GObject class that implements an interface and how to verify the implementation using the `instanceof` operator. This confirms the object's inheritance and interface adherence.

```javascript
const simpleInstance = new SimpleImplementation();

if (simpleInstance instanceof GObject.Object)
    console.log('An instance of a GObject');

if (simpleInstance instanceof SimpleInterface)
    console.log('An instance implementing SimpleInterface');

if (!(simpleInstance instanceof Gio.ListModel))
    console.log('Not an implementation of a list model');
```

--------------------------------

### GNOME Shell: Fill Preferences Window using XML Template

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

Demonstrates how to use the `fillPreferencesWindow` function in GJS to load a preferences page defined in an XML file and add it to the main preferences window.

```javascript
const {Gtk} = imports.gi;

function fillPreferencesWindow(window) {
    let builder = Gtk.Builder.new();
    builder.add_from_file('PATH_TO_THE_TEMPLATE_FILE');
    let page = builder.get_object('my_page');
    window.add(page);
}
```

--------------------------------

### QuickToggle: Deprecating label, using title and subtitle

Source: https://gjs.guide/extensions/upgrading/gnome-shell-44

Demonstrates the transition from the deprecated `label` property to `title` for QuickToggle and QuickMenuToggle components in GNOME Shell 44. It also shows how to use the new `subtitle` property for additional text.

```javascript
// GNOME 43
const toggle43 = new QuickToggle({ label: 'Feature' });

// GNOME 44
const toggle44 = new QuickToggle({ title: 'Feature' });

// GNOME 43 & 44
const toggle = new QuickToggle();
toggle.label = 'Feature';
```

--------------------------------

### GSettings Schema Naming Conventions

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Defines the required base ID and path for GSettings schemas used in GNOME Shell extensions. The Schema XML file must be included and named according to the schema ID.

```APIDOC
GSettings Schema Requirements:

Schema ID:
  - Base ID: org.gnome.shell.extensions
  - Example: org.gnome.shell.extensions.my-extension-name

Schema Path:
  - Base Path: /org/gnome/shell/extensions
  - Example: /org/gnome/shell/extensions/my-extension-name/

Schema XML File:
  - Must be included in the extension ZIP file.
  - Filename must follow the pattern: <schema-id>.gschema.xml
  - Example: org.gnome.shell.extensions.my-extension-name.gschema.xml
```

--------------------------------

### Traditional Promise Usage in GJS

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Illustrates the traditional way of using JavaScript Promises in GJS, integrating with the GLib main loop. It shows how to create a Promise that resolves or rejects asynchronously and how to handle its outcome using `.then()` for success and `.catch()` for errors.

```javascript
import GLib from 'gi://GLib';

const loop = new GLib.MainLoop(null, false);

// Returns a Promise that randomly fails or succeeds after one second
function unreliablePromise() {
    return new Promise((resolve, reject) => {
        GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            if (Math.random() >= 0.5)
                resolve('success');
            else
                reject(Error('failure'));

            return GLib.SOURCE_REMOVE;
        });
    });
}

// When using a Promise in the traditional manner, you must chain to it with
// `then()` to get the result and `catch()` to trap errors.
unreliablePromise().then(result => {
    // Logs "success"
    console.log(result);
}).catch(e => {
    // Logs "Error: failure"
    logError(e);
});

// A convenient short-hand in GJS is just passing `logError` to `catch()`
unreliablePromise().catch(logError);

await loop.runAsync();
```

--------------------------------

### Create and Connect GtkEventControllerKey (JS)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Shows an alternative way to create and connect a GtkEventControllerKey in GJS when not using an XML template. It manually creates the controller, adds it to the window, and connects its 'key-pressed' signal.

```js
const {Gtk, Gdk} = imports.gi;

prefsWidget.connect('realize', () => {

    let window = prefsWidget.get_root();

    let evck = Gtk.EventControllerKey.new();
    window.add_controller(evck);

    evck.connect('key-pressed', (widget, keyval, keycode, state) => {

        let mask = state & Gtk.accelerator_get_default_mod_mask();

        let binding = Gtk.accelerator_name_with_keycode(
            null, keyval, keycode, mask);

        log('Binding is: ' + binding);

        return Gdk.EVENT_STOP;
    });
});
```

--------------------------------

### Import Parts of a Module (Old vs New)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Shows how to import specific exports (like `panel`, `wm`) from a module, demonstrating the change from destructuring `imports.*` to ESM named imports.

```javascript
// Before GNOME 45
const {panel, wm} = imports.ui.main;

// GNOME 45
import {panel, wm} from 'resource:///org/gnome/shell/ui/main.js';
```

--------------------------------

### Describe donations Configuration Object

Source: https://gjs.guide/extensions/overview/anatomy

An object containing links to support the extension developer. It supports predefined keys like 'buymeacoffee', 'github', 'paypal', etc., and a 'custom' key for direct URLs. Values can be a string (user handle for predefined keys, URL for custom) or an array of strings (max length 3).

```APIDOC
`donations`

This field is an object including donation links with these possible keys:

* `buymeacoffee`
* `custom`
* `github`
* `kofi`
* `liberapay`
* `opencollective`
* `patreon`
* `paypal`

Value of each element can be string or array of strings (maximum array length is 3).

While `custom` pointing to the exact value (URL), other keys only including the user handle (for example, `"paypal": "john_doe"` points to the `https://paypal.me/john_doe`).
```

--------------------------------

### GJS: Parallel Async File Loads with Promise.all (JavaScript)

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Illustrates how to execute multiple asynchronous file read operations concurrently using the Promise.all pattern. A helper Promise wrapper function is defined to simplify the async/await usage for each file operation, enabling efficient parallel processing.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

/**
 * A simple Promise wrapper that elides the number of bytes read.
 *
 * @param {Gio.File} file - a file object
 * @returns {Promise<Uint8Array>} - the file contents
 */
function loadContents(file) {
    return new Promise((resolve, reject) => {
        file.load_contents_async(GLib.PRIORITY_DEFAULT, null, (_file, res) => {
            try {
                resolve(file.load_contents_finish(res)[1]);
            } catch (e) {
                reject(e);
            }
        });
    });
}

try {
    // A list of files to read
    const files = [
        Gio.File.new_for_path('test-file1.txt'),
        Gio.File.new_for_path('test-file2.txt'),
        Gio.File.new_for_path('test-file3.txt'),
    ];

    // Creating a Promise for each operation
    const operations = files.map(file => loadContents(file));

    // Run them all in parallel
    const results = await Promise.all(operations);

    results.forEach((result, i) => {
        console.log(`Read ${result.length} bytes from "${files[i].get_basename()}"`);
    });
} catch (e) {
    logError(e);
}
```

--------------------------------

### Create GNOME Shell Extension Panel Button (JavaScript)

Source: https://gjs.guide/extensions/topics/extension

Demonstrates creating a panel button for a GNOME Shell extension. It imports necessary modules, instantiates a panel button, adds an icon, and attaches it to the main panel. The `enable` method handles creation and `disable` handles cleanup.

```js
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
```

--------------------------------

### GJS: Async/Await File Load and Sync (JavaScript)

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Shows both the synchronous, blocking form of file loading and an asynchronous, non-blocking wrapper using Promises with async/await. This allows for a more readable, synchronous-like programming style while benefiting from asynchronous execution.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-file.txt');

// Here is the synchronous, blocking form of this operation
try {
    const [, contents] = file.load_contents(null);

    console.log(`Read ${contents.length} bytes from ${file.get_basename()}`);
} catch (e) {
    logError(e, `Reading ${file.get_basename()}`);
}

// Here is an asynchronous, non-blocking wrapper in use
try {
    const [, contents] = await new Promise((resolve, reject) => {
        file.load_contents_async(GLib.PRIORITY_DEFAULT, null, (_file, res) => {
            try {
                // If the task succeeds, we can return the result with resolve()
                resolve(file.load_contents_finish(res));
            } catch (e) {
                // If an error occurred, we can report it using reject()
                reject(e);
            }
        });
    });

    console.log(`Read ${contents.length} bytes from ${file.get_basename()}`);
} catch (e) {
    logError(e, `Reading ${file.get_basename()}`);
}
```

--------------------------------

### Create GSettings Schema Directory

Source: https://gjs.guide/extensions/development/preferences

Creates the necessary directory structure for GSettings schema files for a GNOME Shell extension. This follows the standard naming conventions for extension schemas.

```sh
mkdir -p ~/.local/share/gnome-shell/extensions/example@gjs.guide/schemas
cd ~/.local/share/gnome-shell/extensions/example@gjs.guide
touch schemas/org.gnome.shell.extensions.example.gschema.xml
```

--------------------------------

### PopupSubMenuMenuItem API

Source: https://gjs.guide/extensions/topics/popup-menu

API documentation for PopupSubMenuMenuItem, detailing its constructor, methods for controlling submenu visibility, and properties for accessing its icon, label, and submenu.

```APIDOC
PopupSubMenuMenuItem:
  Parent Class: PopupMenu.PopupBaseMenuItem
  Description: This menu item represents a submenu containing other items. It has a label, icon, and an expander to reveal the items it contains.

  Constructor:
    new PopupSubMenuMenuItem(text, wantsIcon)
      text (String): The item label.
      wantsIcon (Boolean): Whether space should be allocated for an icon.

  Methods:
    setSubmenuShown(open)
      Opens or closes the submenu.
      open (Boolean): true to open, or false to close.

  Properties:
    icon (St.Icon): An St.Icon if wantIcon was true (JavaScript: read-only).
    label (St.Label): An St.Label (JavaScript: read-only).
    menu (PopupMenu.PopupSubMenu): The submenu (JavaScript: read-only).
```

--------------------------------

### Create Custom Notification Source

Source: https://gjs.guide/extensions/topics/notifications

Demonstrates how to create a custom notification source for an extension, including setting its title, icon, and notification policy, and adding it to the message tray.

```javascript
let notificationSource = null;

function getNotificationSource() {
    if (!notificationSource) {
        const notificationPolicy = new NotificationPolicy();

        notificationSource = new MessageTray.Source({
            // The source name (e.g. application name)
            title: _('Notifications Example'),
            // An icon for the source, used a fallback by notifications
            icon: new Gio.ThemedIcon({name: 'dialog-information'}),
            // Same as `icon`, but takes a themed icon name
            iconName: 'dialog-information',
            // The notification policy
            policy: notificationPolicy,
        });

        // Reset the notification source if it's destroyed
        notificationSource.connect('destroy', _source => {
            notificationSource = null;
        });
        Main.messageTray.add(notificationSource);
    }

    return notificationSource;
}
```

--------------------------------

### Manually Create GNOME Extension Directory (Shell)

Source: https://gjs.guide/extensions/development/creating

Provides shell commands to manually create the necessary directory structure and initial files (`extension.js`, `metadata.json`) for a GNOME Shell extension. The directory name must match the extension's UUID.

```sh
$ mkdir -p ~/.local/share/gnome-shell/extensions/example@gjs.guide
$ cd ~/.local/share/gnome-shell/extensions/example@gjs.guide
$ touch extension.js metadata.json
```

--------------------------------

### APIDOC: ExtensionPreferences Class Methods and Properties

Source: https://gjs.guide/extensions/topics/extension

Documentation for the ExtensionPreferences class, focusing on its static methods for looking up extensions by UUID or URL, and retrieving settings. It also details methods for translation management.

```APIDOC
ExtensionPreferences:
  lookupByUUID(uuid)
    uuid (String): An extension's UUID value
    Returns (ExtensionBase|null): The extension object instance

  lookupByURL(url)
    url (String): A file:// URL
    Returns (ExtensionBase|null): The extension object instance

  getSettings(schema)
    schema (String): A schema ID, or metadata['settings-schema'] if omitted
    Returns (Gio.Settings): A new settings object

  initTranslations(domain)
    domain (String): A gettext domain, or metadata['gettext-domain'] if omitted

  gettext(str)
    str (String): The string to translate
    Returns (String): The translated string

  ngettext(str, strPlural, n)
    str (String): The string to translate
    strPlural (String): The plural form of the string
    n (Number): The quantity for which translation is needed
    Returns (String): The translated string

  pgettext(context, str)
    context (String): The context to disambiguate str
    str (String): The string to translate
    Returns (String): The translated string

  Properties (inherited from ExtensionBase):
    dir: Gets the extension's directory (Gio.File)
    metadata: The instance metadata object
    path: Gets the path to the extension's directory
    uuid: Gets the extension's UUID value
```

--------------------------------

### PopupMenu Module Overview

Source: https://gjs.guide/extensions/topics/popup-menu

Provides classes for creating popup menus in GNOME Shell, often used with panel buttons and Quick Settings. Some classes are pure JavaScript and do not support GObject features.

```APIDOC
PopupMenu:
  Description: Module for creating popup menus in GNOME Shell.
  Usage: Extension authors often use these with panel buttons and Quick Settings.
  Note: Some classes in this module are pure JavaScript and do not support GObject features like property bindings.
```

--------------------------------

### Use Gio.SubprocessLauncher for Reusable Process Spawning in GJS

Source: https://gjs.guide/guides/gio/subprocesses

Introduces `Gio.SubprocessLauncher` as a reusable object for spawning processes. It allows pre-configuration of flags, environment variables, working directory, and I/O streams. Once configured, multiple processes can be spawned using the same launcher instance, simplifying repetitive process creation tasks.

```javascript
import Gio from 'gi://Gio';

const launcher = new Gio.SubprocessLauncher({
    flags: Gio.SubprocessFlags.STDIN_PIPE |
           Gio.SubprocessFlags.STDOUT_PIPE |
           Gio.SubprocessFlags.STDERR_PIPE,
});

// Set a custom ENV variable, which could be used in shell scripts
launcher.setenv('MY_VAR', '1', false);

// Log any errors to a file
launcher.set_stderr_file_path('error.log');

// Spawn as many processes with this launcher as you want
const proc1 = launcher.spawnv(['ls', '/']);
const proc2 = launcher.spawnv(['/home/me/script.sh']);
```

--------------------------------

### GLib Input Stream Source

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Illustrates creating a `GLib.Source` from a `Gio.UnixInputStream` (stdin). The source triggers when data is available, allowing for interactive input processing. It uses `GLib.SOURCE_CONTINUE` to keep the source active.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const loop = new GLib.MainLoop(null, false);

const stdinDecoder = new TextDecoder('utf-8');
const stdinStream = new Gio.UnixInputStream({fd: 0});

// Here we create a GLib.Source using Gio.PollableInputStream.create_source(),
// set the priority and callback, then add it to main context
const stdinSource = stdinStream.create_source(null);
stdinSource.set_priority(GLib.PRIORITY_DEFAULT);
stdinSource.set_callback(() => {
    try {
        const data = stdinStream.read_bytes(4096, null).toArray();
        const text = stdinDecoder.decode(data).trim();

        print(`You typed: ${text}`);

        return GLib.SOURCE_CONTINUE;
    } catch (e) {
        logError(e);

        return GLib.SOURCE_REMOVE;
    }
});
const sourceId = stdinSource.attach(null);

// Start processing input
await loop.runAsync();
```

--------------------------------

### GSettings Key Definition

Source: https://gjs.guide/guides/gtk/3/16-settings

Adds a specific setting (key) to a GSettings schema. It includes the key's name, data type, default value, and descriptive summaries.

```xml
<key name="is-running" type="b">
    <default>false</default>
    <summary>Running state</summary>
    <description>Describes if it is running</description>
</key>
```

--------------------------------

### Import GNOME Shell UI Modules (Old vs New)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Illustrates the migration for importing native GNOME Shell UI modules, changing from `imports.ui.*` to ESM `import` statements with `resource://` URIs.

```javascript
// Before GNOME 45
const Main = imports.ui.main;

// GNOME 45
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
```

--------------------------------

### Manage Gio.ActionGroup: Add and Export Actions in GJS

Source: https://gjs.guide/guides/gio/dbus

Illustrates adding created Gio.SimpleAction instances to a Gio.SimpleActionGroup and exporting this group over the D-Bus session bus. It covers the process of adding actions and the export/unexport mechanism, relying on Gio and GLib.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// Assuming basicAction, paramAction, and stateAction are already created as shown previously

// Adding actions to an action group
const actionGroup = new Gio.SimpleActionGroup();
actionGroup.add_action(basicAction);
actionGroup.add_action(paramAction);
actionGroup.add_action(stateAction);

// Exporting action groups on the session bus
const connection = Gio.DBus.session;
const groupId = connection.export_action_group('/guide/gjs/Test',
    actionGroup);

// Once exported, action groups can be unexported using the returned ID
// connection.unexport_action_group(groupId);

```

--------------------------------

### Widget Visibility and Lifecycle (JavaScript)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Explains that in GTK4, widgets are visible by default, removing the need for `show_all()` and the `destroy` signal for typical widget usage in `prefs.js`.

```js
function buildPrefsWidget ()
{
    let widget = new MyPrefsWidget();
    // widget.show_all();
    // widget.connect('destroy', Gtk.main_quit);
    return widget;
}
```

--------------------------------

### Meta.Barrier.display Deprecation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Notes the deprecation of Meta.Barrier.display and provides the correct way to access the backend barrier.

```APIDOC
Meta.Barrier.display is deprecated.

To obtain the backend barrier, use `global.backend`.

Example:
let backendBarrier = global.backend;
```

--------------------------------

### GtkBox Child Addition (GJS)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates the GTK4 approach to adding children to a GtkBox using 'prepend' and 'append' methods, replacing the older 'pack_start' and 'pack_end' from GTK3. It also shows how to remove a child widget.

```GJS
let hBox = new Gtk.Box();
hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

hBox.pack_start(myLabel, false, false, 0); // GTK3 style
hBox.pack_end(myLabel2, false, false, 0); // GTK3 style

```

```GJS
let hBox = new Gtk.Box();
hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

hBox.prepend(myLabel); // GTK4 style
hBox.append(myLabel2); // GTK4 style

```

```GJS
let hBox = new Gtk.Box();
hBox.set_orientation(Gtk.Orientation.HORIZONTAL);

hBox.prepend(myLabel);
hBox.remove(myLabel1);

```

--------------------------------

### GObject Disposal Best Practices

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Extensions should avoid calling `GObject.Object.run_dispose()` unless absolutely necessary. If required, a comment explaining the specific situation must be included.

```gjs
/*
 * Extensions SHOULD NOT call GObject.Object.run_dispose() unless absolutely necessary.
 * If absolutely necessary, any call to this method MUST have a comment explaining
 * the real-world situation that makes it a requirement.
 */
// Example of a discouraged call:
// myObject.run_dispose();
```

--------------------------------

### Create and Configure PopupImageMenuItem in GJS

Source: https://gjs.guide/extensions/topics/popup-menu

Illustrates creating a PopupImageMenuItem with text and an icon, and how to set or change the icon and label after creation. It supports both string icon names and Gio.Icon objects.

```javascript
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const menuItem = new PopupMenu.PopupImageMenuItem('Item Label',
    'info-symbolic', {});

// Setting the icon, by method or property
menuItem.setIcon('info-symbolic');
menuItem.icon.icon_name = 'info-symbolic';

// Setting the label
menuItem.label.text = 'New Label';
```

--------------------------------

### ESLint for GNOME Shell Extensions

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Recommends using ESLint for checking JavaScript code quality, catching syntax errors, and enforcing code style. It points to GNOME Shell's ESLint rules for consistency.

```JavaScript
// Example of using ESLint (command line)
eslint --config <path_to_gnome_shell_rules> your_extension_file.js
```

```APIDOC
Tool: ESLint

Purpose:
  - Check JavaScript code for syntax errors and mistakes.
  - Enforce consistent code style.

Recommendation:
  - Use ESLint to check your code before submission.
  - GNOME Shell extension ESLint rules are available on GitLab:
    https://gitlab.com/GNOME/gnome-shell-extensions/tree/main/lint

Note:
  - Following a specific code style is not a requirement for approval, but messy code may lead to rejection.
  - Obfuscators and transpilers (like TypeScript) used in a messy way may also lead to rejection.
```

--------------------------------

### GJS ExtensionUtils Settings and Preferences

Source: https://gjs.guide/extensions/topics/extension-utils

Utilities for managing application settings and opening the extension's preference dialog. Integrates with GSettings for schema management.

```APIDOC
ExtensionUtils.getSettings(schema)
  - Builds and returns a GSettings schema object for the specified schema.
  - Parameters:
    - schema (String): The gettext domain to use for the schema. If omitted, it's taken from the `settings-schema` field in `metadata.json`.
  - Returns:
    - (Gio.Settings): A new `Gio.Settings` object for the schema.

ExtensionUtils.openPrefs()
  - Opens the preference dialog of the current extension.
  - No parameters.
  - No return value.
```

--------------------------------

### Load UI with Gtk.Builder and Custom Scope in GJS

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Loads an XML interface using Gtk.Builder and a custom Gtk.BuilderScope to manually connect signals. This approach allows for more control over signal handling and object creation.

```javascript
const {Gtk, GObject} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const MyBuilderScope = GObject.registerClass({
    Implements: [Gtk.BuilderScope],
}, class MyBuilderScope extends GObject.Object {

    vfunc_create_closure(builder, handlerName, flags, connectObject) {
        if (flags & Gtk.BuilderClosureFlags.SWAPPED)
            throw new Error('Unsupported template signal flag "swapped"');

        if (typeof this[handlerName] === 'undefined')
            throw new Error(`${handlerName} is undefined`);

        return this[handlerName].bind(connectObject || this);
    }

    on_btn_click(connectObject) {
        connectObject.set_label("Clicked");
    }
});

function init () {}

function buildPrefsWidget () {

    let builder = new Gtk.Builder();

    builder.set_scope(new MyBuilderScope());
    builder.set_translation_domain('gettext-domain');
    builder.add_from_file(Me.dir.get_path() + '/prefs.ui');

    return builder.get_object('main_widget');
}
```

--------------------------------

### Feature Detection using Method Existence (JavaScript)

Source: https://gjs.guide/extensions/development/targeting-older-gnome

Demonstrates how to safely use a method by checking if it exists before calling it. This is a common pattern for adapting to API changes across different GNOME Shell versions.

```javascript
if (method)
    method();
else
    // Use another method, write a replacement, or do nothing
```

--------------------------------

### Create Proxy with Error Handling (GJS)

Source: https://gjs.guide/guides/gio/dbus

Illustrates creating a client proxy synchronously while incorporating error handling using a try-catch block. This ensures that any exceptions during proxy creation are caught and logged.

```js
// Create a proxy synchronously, making sure to catch errors
let proxy = null;

try {
    proxy = TestProxy(Gio.DBus.session, 'guide.gjs.Test', '/guide/gjs/Test');
} catch (e) {
    console.warn(e);
}
```

--------------------------------

### Handle Notification Activation

Source: https://gjs.guide/extensions/topics/notifications

Illustrates how to connect to the 'activated' signal, which is emitted when the user interacts with the notification itself (e.g., clicks on it).

```javascript
notification.connect('activated', _notification => {
    console.debug(`${notification.title}: notification activated`);
});
```

--------------------------------

### Resource Paths for extension.js vs prefs.js

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Highlights the difference in resource path prefixes when importing modules from `extension.js` versus `prefs.js` in GNOME Shell extensions using ESM.

```javascript
// In extension.js:
import * as Config from 'resource:///org/gnome/shell/misc/config.js';

// In prefs.js (note the path difference):
import * as Config from 'resource:///org/gnome/Shell/Extensions/js/misc/config.js';
```

--------------------------------

### ImageViewerWindow Class Definition

Source: https://gjs.guide/guides/gtk/3/10-building-app

Defines a JavaScript class `ImageViewerWindow` to encapsulate the UI elements and logic for an image viewer. It manages the Gtk.ApplicationWindow, Gtk.Box, Gtk.Image, and Gtk.FileChooserButton.

```js
class ImageViewerWindow {
    constructor(app) {
        this._app = app;
        this._window = null;
        this._box = null;
        this._image = null;
        this._fileChooserButton = null;
    }

    _buildUI() {
        this._window = new Gtk.ApplicationWindow({
            application: this._app,
            defaultHeight: 600,
            defaultWidth: 800
        });
        this._box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL
        });

        this._image = new Gtk.Image({
            vexpand: true
        });
        this._box.add(this._image);

        this._fileChooserButton = Gtk.FileChooserButton.new('Pick An Image', Gtk.FileChooserAction.OPEN);

        this._fileChooserButton.connect('file-set', (button) => {
            const fileName = button.get_filename();
            this._image.set_from_file(fileName);
        });

        this._box.add(this._fileChooserButton);
        this._box.show_all();

        this._window.add(this._box);
    }

    getWidget() {
        this._buildUI();
        return this._window;
    }
}

...
```

--------------------------------

### GJS: Promisify Gio Subprocess Methods

Source: https://gjs.guide/guides/gio/subprocesses

Demonstrates how to wrap asynchronous Gio methods with `Gio._promisify()` for easier handling in GJS. This includes methods for `Gio.Subprocess` and `Gio.DataInputStream`/`Gio.OutputStream` to enable promise-based asynchronous operations.

```js
import Gio from 'gi://Gio';

/* Gio.Subprocess */
Gio._promisify(Gio.Subprocess.prototype, 'communicate_async');
Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');
Gio._promisify(Gio.Subprocess.prototype, 'wait_async');
Gio._promisify(Gio.Subprocess.prototype, 'wait_check_async');

/* Ancillary Methods */
Gio._promisify(Gio.DataInputStream.prototype, 'read_line_async',
    'read_line_finish_utf8');
Gio._promisify(Gio.OutputStream.prototype, 'write_bytes_async');
```

--------------------------------

### GNOME Shell: Enable Inspector Keybinding for Debugging

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

Provides the `gsettings` command to enable the inspector keybinding, which is necessary for interactive debugging of GNOME Shell preferences windows, including color scheme testing.

```bash
gsettings set org.gtk.Settings.Debug enable-inspector-keybinding true
```

--------------------------------

### SearchController Provider Management

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Introduces methods to manage search provider objects more easily within the SearchController.

```javascript
SearchController.addProvider(providerObject)
SearchController.removeProvider(providerObject)
```

--------------------------------

### Implement Multiple Interfaces in GJS

Source: https://gjs.guide/guides/gobject/interfaces

Shows how a single GJS class can implement multiple interfaces simultaneously, such as Gio.ListModel and Gtk.Orientable. This involves listing all interfaces and properties in the registerClass call.

```javascript
const OrientableWidget = GObject.registerClass({
    Implements: [Gio.ListModel, Gtk.Orientable],
    Properties: {
        'orientation': GObject.ParamSpec.override('orientation',
            Gtk.Orientable),
    },
}, class OrientableWidget extends Gtk.Widget {
    constructor(params = {}) {
        super(params);

        this._children = [];
    }

    get orientation() {
        if (this._orientation === undefined)
            this._orientation = Gtk.Orientation.HORIZONTAL;

        return this._orientation;
    }

    set orientation(value) {
        if (this.orientation === value)
            return;

        this._orientation = value;
        this.notify('orientation');
    }

    vfunc_get_item_type() {
        return Gtk.Widget;
    }

    vfunc_get_item(position) {
        return this._children[position] || null;
    }

    vfunc_get_n_items() {
        return this._children.length;
    }
});
```

--------------------------------

### Handle Cancellable Gio.Subprocess in GJS

Source: https://gjs.guide/guides/gio/subprocesses

Demonstrates how to create and manage a cancellable subprocess using Gio.Subprocess and Gio.Cancellable. It shows how to initialize a process, link it to a cancellable object, and trigger its termination via `force_exit()` when the cancellable is triggered. This pattern is useful for preventing process startup if already cancelled or for external cancellation.

```javascript
import Gio from 'gi://Gio';

try {
    // Create the process object with `new` and pass the arguments and flags as
    // constructor properties. The process will start when `init()` returns,
    // unless an error is thrown.
    const proc = new Gio.Subprocess({
        argv: ['sleep', '10'],
        flags: Gio.SubprocessFlags.NONE,
    });

    // If the cancellable has already been triggered, the call to `init()` will
    // throw an error and the process will not be started.
    const cancellable = new Gio.Cancellable();

    proc.init(cancellable);

    // Chaining to the cancellable allows you to easily kill the process. You
    // could use the same cancellabe for other related tasks allowing you to
    // cancel them all without tracking them separately.
    //
    // NOTE: this is NOT the standard GObject.connect() function, so you should
    //       consult the documentation if the usage seems odd here.
    let cancelId = 0;

    if (cancellable instanceof Gio.Cancellable)
        cancelId = cancellable.connect(() => proc.force_exit());
} catch (e) {
    logError(e);
}
```

--------------------------------

### GNOME Extension Preferences with GTK4/Adwaita

Source: https://gjs.guide/extensions/overview/anatomy

This JavaScript snippet demonstrates the structure and methods for creating a preferences UI for GNOME extensions using `prefs.js`. It utilizes GTK4 and Adwaita libraries for building widgets and managing preferences. The `getPreferencesWidget` method returns a GTK widget, while `fillPreferencesWindow` populates the preferences window with pages and rows.

```javascript
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    /**
     * This class is constructed once when your extension preferences are
     * about to be opened. This is a good time to setup translations or anything
     * else you only do once.
     *
     * @param {ExtensionMeta} metadata - An extension meta object
     */
    constructor(metadata) {
        super(metadata);

        console.debug(`constructing ${this.metadata.name}`);
    }

    /**
     * This function is called when the preferences window is first created to
     * build and return a GTK4 widget.
     *
     * The preferences window will be a `Adw.PreferencesWindow`, and the widget
     * returned by this function will be added to an `Adw.PreferencesPage` or
     * `Adw.PreferencesGroup` if necessary.
     *
     * @returns {Gtk.Widget} the preferences widget
     */
    getPreferencesWidget() {
        return new Gtk.Label({
            label: this.metadata.name,
        });
    }

    /**
     * Fill the preferences window with preferences.
     *
     * If this method is overridden, `getPreferencesWidget()` will NOT be called.
     *
     * @param {Adw.PreferencesWindow} window - the preferences window
     */
    fillPreferencesWindow(window) {
        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension'),
        });
        page.add(group);

        // Create a new preferences row
        const row = new Adw.SwitchRow({
            title: _('Show Indicator'),
            subtitle: _('Whether to show the panel indicator'),
        });
        group.add(row);
    }
}
```

--------------------------------

### Define Template Widget UI with XML

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Defines the user interface for a GJS widget using an XML file. It specifies the widget's class, parent, properties, and child elements, including signals for event handling.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">
    <template class="PrefsWidget" parent="GtkBox">
        <property name="orientation">vertical</property>
        <child>
            <object class="GtkButton" id="clickButton">
                <property name="label" translatable="yes">Click Me!</property>
                <signal name="clicked" handler="_onButtonClicked" swapped="no"/>
            </object>
        </child>
    </template>
</interface>
```

--------------------------------

### Define Gtk.Builder UI Element with XML

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Specifies a UI element, such as a GtkButton, using XML for loading with Gtk.Builder. This includes properties like label, visibility, and signal connections.

```xml
<object class="GtkButton">
    <property name="label" translatable="yes">button</property>
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <signal name="clicked" handler="on_btn_click" swapped="no"/>
</object>
```

--------------------------------

### Connect and Subscribe to D-Bus Signals in GJS

Source: https://gjs.guide/guides/gio/dbus

Demonstrates how to subscribe to D-Bus signals using Gio.DBusConnection.signal_subscribe. It includes a callback function to process incoming signals and shows how to unsubscribe using the handler ID. Dependencies include the Gio module.

```js
import Gio from 'gi://Gio';

/**
 * The callback for a signal connection.
 *
 * @param {Gio.DBusConnection} connection - the emitting connection
 * @param {string|null} sender - the unique bus name of the sender of the
 *     signal, or %null on a peer-to-peer D-Bus connection
 * @param {string} path - the object path that the signal was emitted on
 * @param {string} iface - the name of the interface
 * @param {string} signal - the name of the signal
 * @param {GLib.Variant} params - a variant tuple with parameters for the signal
 */
function onActiveChanged(connection, sender, path, iface, signal, params) {
    const [locked] = params.recusiveUnpack();

    console.log(`Screen Locked: ${locked}`);
}

// Connecting a signal handler returns a handler ID, just like GObject signals
const handlerId = Gio.DBus.session.signal_subscribe(
    'org.gnome.ScreenSaver',
    'org.gnome.ScreenSaver',
    'ActiveChanged',
    '/org/gnome/ScreenSaver',
    null,
    Gio.DBusSignalFlags.NONE,
    onActiveChanged);

// Disconnecting a signal handler
Gio.DBus.session.signal_unsubscribe(handlerId);
```

--------------------------------

### PopupMenuBase API

Source: https://gjs.guide/extensions/topics/popup-menu

API reference for PopupMenuBase, the abstract base class for GNOME Shell popup menus. It outlines common methods for managing menu items, controlling menu visibility, and accessing menu properties.

```APIDOC
PopupMenuBase:
  Parent Class: Signals.EventEmitter
  Description: Abstract base class for GNOME Shell popup menus. Contains methods, properties, and signals common to all menus.

  Constructor:
    new PopupMenuBase(sourceActor, styleClass)
      sourceActor (Clutter.Actor): The Clutter.Actor the menu points to.
      styleClass (String): The CSS class of the menu.

  Methods:
    addAction(title, callback, icon)
      Adds a text item with a callback and optional icon.
      title (String): The item label.
      callback (Function): A function to call when the item is activated. Passed the Clutter.Event as the only argument.
      icon (String|Gio.Icon): An optional themed icon name or Gio.Icon.
      Returns (PopupMenu.PopupBaseMenuItem): The newly added item.

    addSettingsAction(title, desktopFile)
      Adds an item that opens a GNOME Settings page.
      title (String): The item label.
      desktopFile (String): A freedesktop.org desktop file.
      Returns (PopupMenu.PopupBaseMenuItem): The newly added item.

    addMenuItem(menuItem, position)
      Adds an item to the menu.
      menuItem (PopupMenu.PopupBaseMenuItem|PopupMenu.PopupMenuSection): The item to add to the menu.
      position (Number): Optional position to place the item at.

    moveMenuItem(menuItem, position)
      Moves an item to a position in the menu.
      menuItem (PopupMenu.PopupBaseMenuItem|PopupMenu.PopupMenuSection): The item to reposition.
      position (Number): The position to place the item at.

    isEmpty()
      Checks if the menu has any items.
      Returns (Boolean): true if the menu is empty of items.

    open(animate)
      Opens the menu.
      animate (BoxPointer.PopupAnimation|Boolean): The animation to use. true or false may be passed, as BoxPointer.PopupAnimation.SLIDE and BoxPointer.PopupAnimation.NONE respectively.

    close(animate)
      Closes the menu.
      animate (BoxPointer.PopupAnimation|Boolean): The animation to use. true or false may be passed, as BoxPointer.PopupAnimation.SLIDE and BoxPointer.PopupAnimation.NONE respectively.

    removeAll()
      Remove and destroy all items in the menu.

    toggle()
      Toggles the open state of the menu.

    destroy()
      Destroys the menu and all its items.

  Properties:
    firstMenuItem (PopupMenu.PopupBaseMenuItem|PopupMenu.PopupMenuSection): Gets the first item in the menu (JavaScript: read-only).
    numMenuItems (Number): Gets the number of items in the menu (JavaScript: read-only).
    sensitive (Boolean): Whether the menu is sensitive (JavaScript: read-write).
```

--------------------------------

### Import GNOME Shell Misc Modules (Old vs New)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Details the syntax update for importing GNOME Shell miscellaneous modules, transitioning from `imports.misc.*` to ESM `import` statements using `resource://` URIs.

```javascript
// Before GNOME 45
const Util = imports.misc.util;

// GNOME 45
import * as Util from 'resource:///org/gnome/shell/misc/util.js';
```

--------------------------------

### GJS: Load Gtk.Image from File

Source: https://gjs.guide/guides/gtk/3/09-images

Demonstrates how to load an image from a file using Gtk.Image and Gtk.FileChooserButton. This snippet initializes Gtk, creates a vertical box, an image widget, and a file chooser button. The image is updated when a file is selected.

```javascript
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

const image = new Gtk.Image({
    vexpand: true
});

box.add(image);

const button = Gtk.FileChooserButton.new('Pick An Image', Gtk.FileChooserAction.OPEN);

button.connect('file-set', () => {
    const fileName = button.get_filename();
    image.set_from_file(fileName);
});

box.add(button);

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(box);
win.show_all();

Gtk.main();

```

--------------------------------

### Populate Gtk Window with Remote Gio.MenuModel

Source: https://gjs.guide/guides/gio/dbus

Shows how to connect to a remote Gio.MenuModel exported via D-Bus in GJS. It illustrates creating a Gtk.Window, inserting a remote action group, and displaying the menu model using a Gtk.MenuButton within a Gtk.HeaderBar.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk?version=4.0';

// Initialize the GTK environment and prepare an event loop
Gtk.init();
const loop = GLib.MainLoop.new(null, false);

// Create a top-level window
const window = new Gtk.Window({
    title: 'GJS GMenu Example',
    default_width: 320,
    default_height: 240,
});
window.connect('close-request', () => loop.quit());

const headerBar = new Gtk.HeaderBar({
    show_title_buttons: true,
});
window.set_titlebar(headerBar);

// As before, we'll insert the action group
const remoteGroup = Gio.DBusActionGroup.get(Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test');
window.insert_action_group('test', remoteGroup);

// Get the remote menu model
const remoteMenu = Gio.DBusMenuModel.get(Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test');

// And now we'll add a menu button to a header bar with our menu model
const menuButton = new Gtk.MenuButton({
    icon_name: 'open-menu-symbolic',
    menu_model: remoteMenu,
});
headerBar.pack_end(menuButton);

// Show the window and start the event loop
window.present();
await loop.runAsync();
```

--------------------------------

### Extension Metadata Configuration

Source: https://gjs.guide/extensions/topics/session-modes

Defines the essential properties for a GNOME Shell extension, including its UUID, name, description, supported shell versions, and importantly, the session modes it can operate within.

```json
{
    "uuid": "session-modes@gjs.guide",
    "name": "Session Modes Example",
    "description": "This is an example of using session modes in an extension.",
    "shell-version": [ "45" ],
    "session-modes": ["user", "unlock-dialog"],
    "url": "https://gjs.guide/extensions/topics/session-modes"
}
```

--------------------------------

### Create Directory with Parents GJS

Source: https://gjs.guide/guides/gio/file-operations

Demonstrates creating directories, including any necessary parent directories, using the synchronous Gio.File.make_directory_with_parents method. Note that this is a blocking operation.

```javascript
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-directory');
const child = file.get_child('test-subdirectory');

// NOTE: This is a synchronous, blocking method
child.make_directory_with_parents(null);
```

--------------------------------

### Clutter.Container Deprecation and Alternatives

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Demonstrates how to check for the absence of the deprecated Clutter.Container and shows the recommended method for adding/removing actors as children.

```javascript
if (Clutter.Container === undefined) {
    console.log('No Clutter Container');
}
```

```APIDOC
Clutter.Container.add_actor() is deprecated.
Use Clutter.Actor.add_child() instead.

Clutter.Container.remove_actor() is deprecated.
Use Clutter.Actor.remove_child() instead.

Signals 'actor-added' and 'actor-removed' are deprecated.
Use 'child-added' and 'child-removed' instead.
```

--------------------------------

### GNOME Shell: Resize Preferences Window

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

Demonstrates how to set a default size for the GNOME Shell preferences window using the `set_default_size()` method within the `fillPreferencesWindow` function.

```javascript
function fillPreferencesWindow(window) {
    window.set_default_size(800, 600);
    // ...
}
```

--------------------------------

### Privileged Subprocess Security

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Avoid spawning privileged subprocesses. If unavoidable, use `pkexec` and ensure the subprocess is not user-writable.

```bash
# Spawning privileged subprocesses should be avoided at all costs.
# If absolutely necessary, the subprocess MUST be run with pkexec
# and MUST NOT be an executable or script that can be modified by a user process.
```

--------------------------------

### GObject Property Naming Conventions

Source: https://gjs.guide/guides/gobject/basics

Explains how GObject property names (canonical `kebab-case`) are accessed differently depending on the context: `underscore_case` or `camelCase` for native access, `kebab-case` for string keys, and case-sensitive for getter/setter functions.

```javascript
const markupLabel = new Gtk.Label({
    label: '<i>Italics</i>',
    use_markup: true,
});
let useMarkup;

// If using native accessors, you can use `underscore_case` or `camelCase`
useMarkup = markupLabel.use_markup;
useMarkup = markupLabel.useMarkup;

// Anywhere the property name is a string, you must use `kebab-case`
markupLabel['use-markup'] = true;
markupLabel.connect('notify::use-markup', () => {});

// Getter and setter functions are always case sensitive
useMarkup = markupLabel.get_use_markup();
markupLabel.set_use_markup(true);
```

--------------------------------

### GLib Implicit Sources from GIO Async

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Shows how asynchronous operations from GIO, like `file.delete_async`, implicitly create `GLib.Source` objects. These sources are added to the main context to invoke a callback upon task completion.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const loop = new GLib.MainLoop(null, false);
const file = Gio.File.new_for_path('test-file.txt');

// GTask-based operations invoke a callback when the task completes
file.delete_async(GLib.PRIORITY_DEFAULT, null, (_file, result) => {
    console.log('This callback was invoked because the task completed');

    try {
        file.delete_finish(result);
    } catch (e) {
        logError(e);
    }
});

await loop.runAsync();
```

--------------------------------

### XML Structure for GTK Menu

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Defines the XML structure for creating menus and submenus using GtkMenuButton. It includes sections, items, and actions, along with attributes for translatable labels.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">

    <menu id="mymenu">
        <section>
            <attribute name='label' translatable='yes'>Section Header</attribute>
            <submenu>
                <attribute name='label' translatable='yes'>Others</attribute>
                    <section>
                        <item>
                            <attribute name='label' translatable='yes'>Test</attribute>
                            <attribute name='action'>mygroup.test</attribute>
                        </item>
                    </section>
            </submenu>
            <item>
                <attribute name='label' translatable='yes'>Menu Item</attribute>
                <attribute name='action'>mygroup.other</attribute>
            </item>
        </section>
    </menu>

    <template class="PrefsWidget" parent="GtkBox">
        <property name="visible">True</property>
        <property name="can-focus">True</property>
        <property name="vexpand">1</property>
        <child>
            <object class="GtkBox">
                <property name="visible">True</property>
                <property name="can-focus">True</property>
                <property name="orientation">vertical</property>
                <child>
                    <object class="GtkMenuButton">
                        <property name="receives-default">True</property>
                        <property name="menu-model">mymenu</property>
                        <property name="icon-name">open-menu-symbolic</property>
                    </object>
                </child>
            </object>
        </child>
    </template>

</interface>
```

--------------------------------

### St.Bin Expand Properties Behavior

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Explains the change in how St.Bin and its subclasses handle expansion, now relying solely on expand properties.

```APIDOC
St.Bin and its subclasses (e.g., Button, QuickSettingsItem):

Behavior Change:
- Actors now only expand according to their `x-expand` and `y-expand` properties.
- Expansion will no longer occur when the alignment is set to `Clutter.ActorAlign.FILL`.
```

--------------------------------

### Implement Complex GJS Interface using GObject.ListStore

Source: https://gjs.guide/guides/gobject/interfaces

This snippet demonstrates an implementation of `ComplexInterface`, `Gio.ListModel`, and `SimpleInterface` by inheriting from `Gio.ListStore`. It overrides properties from the interfaces and implements the required methods, fulfilling the contract of all specified interfaces.

```javascript
const ComplexImplementation = GObject.registerClass({
    Implements: [Gio.ListModel, SimpleInterface, ComplexInterface],
    Properties: {
        'complex-property': GObject.ParamSpec.override('complex-property',
            ComplexInterface),
        'simple-property': GObject.ParamSpec.override('simple-property',
            SimpleInterface),
    },
}, class ComplexImplementation extends Gio.ListStore {
    get complex_property() {
        return false;
    }

    get simple_property() {
        return true;
    }

    complexMethod() {
        console.log('complexMethod() implemented');
    }

    requiredMethod() {
        console.log('requiredMethod() implemented');
    }
});
```

--------------------------------

### GJS Shebang Line

Source: https://gjs.guide/guides/gtk/3/04-running-gtk

Illustrates the shebang line used at the beginning of a script to specify the interpreter. For GJS scripts, this line indicates that the script should be executed using the 'gjs' interpreter.

```sh
#!/usr/bin/env gjs
```

--------------------------------

### GSettings Schema Definition

Source: https://gjs.guide/extensions/development/preferences

Defines a GSettings schema for a GNOME Shell extension, specifying keys, their types, and default values. This XML file describes how settings are structured and their initial states.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<schemalist>
  <schema id="org.gnome.shell.extensions.example" path="/org/gnome/shell/extensions/example/">
    <key name="show-indicator" type="b">
      <default>true</default>
    </key>
  </schema>
</schemalist>
```

--------------------------------

### GTK4 Container Add Methods

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Provides a reference for GTK4 widget container methods, replacing the general GtkContainer.add() from GTK3. This table lists common GTK widgets and their specific methods for adding child widgets, such as append(), prepend(), attach(), and set_child().

```APIDOC
GTK4 Container Child Management:

- GtkActionBar: .pack_start(), .pack_end()
- GtkAspectFrame: .set_child()
- GtkBox: .prepend(), .append()
- GtkButton: .set_child()
- GtkComboBox: .set_child()
- GtkExpander: .set_child()
- GtkFixed: .put(widget, x, y)
- GtkFlowBox: .insert(widget, position)
- GtkFlowBoxChild: .set_child()
- GtkFrame: .set_child()
- GtkGrid: .attach(widget, left, top, width, height)
- GtkHeaderBar: .pack_start(), .pack_end()
- GtkInfoBar: .add_child()
- GtkListBox: .insert(widget, position)
- GtkListBoxRow: .set_child()
- GtkNotebook: .append_page(page_widget, tab_label)
- GtkOverlay: .set_child()
- GtkPaned: .set_start_child(), .set_end_child()
- GtkPopover: .set_child()
- GtkRevealer: .set_child()
- GtkSearchBar: .set_child()
- GtkStack: .add_child()
- GtkScrolledWindow: .set_child()
- GtkTextView: .add_child_at_anchor(), .add_overlay()
- GtkViewport: .set_child()
- GtkWindow: .set_child()
```

--------------------------------

### Replace Clutter.Image with St.ImageContent

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

The `Clutter.Image` class has been removed. Use `St.ImageContent` instead, which is available in GNOME Shell 45 and higher. The `set_bytes()` and `set_data()` methods have updated signatures.

```APIDOC
St.ImageContent Usage:

Description:
  `Clutter.Image` is removed. Use `St.ImageContent` for image handling. `St.ImageContent` is available in GNOME Shell 45+.

Method Signature Updates:
  - `set_bytes()` and `set_data()` in `St.ImageContent` now require a `Cogl.Context` as the first parameter.
  - Obtain `Cogl.Context` via `global.stage.context.get_backend().get_cogl_context()`.

Example:
  // Get Cogl Context:
  const coglContext = global.stage.context.get_backend().get_cogl_context();

  // Use St.ImageContent:
  const imageContent = new St.ImageContent();
  imageContent.set_bytes(coglContext, bytesData, length);
```

--------------------------------

### Watch GSettings Path

Source: https://gjs.guide/extensions/development/preferences

Use the `dconf watch` command to monitor changes to GSettings values in a specified path, useful for debugging extension preferences. This command will output any modifications made to the settings within the given path.

```sh
$ dconf watch /org/gnome/shell/extensions/example

```

--------------------------------

### Implement Gio.ListModel with ArrayStore in GJS

Source: https://gjs.guide/guides/gio/list-models

Demonstrates how to create a custom `ArrayStore` class that implements the `Gio.ListModel` interface in GJS. It covers the required methods (`vfunc_get_item`, `vfunc_get_item_type`, `vfunc_get_n_items`) and includes custom methods for adding and removing items, along with error handling for type checking.

```javascript
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

var ArrayStore = GObject.registerClass({
    Implements: [Gio.ListModel],
}, class ArrayStore extends GObject.Object {
    /* A native Array as internal storage for the list model */
    #items = [];

    /*
     * Wrapping the internal iterable is an easy way to support `for..of` loops
     */
    *[Symbol.iterator]() {
        for (const item of this.#items)
            yield item;
    }

    /**
     * Gets the item at @position.
     *
     * If @position is greater than the number of items in the list, %null is
     * returned. %null is never returned for a position that is smaller than
     * the length of the list.
     *
     * @param {number} position - the position of the item to fetch
     * @returns {GObject.Object|null} - the object at @position
     */
    vfunc_get_item(position) {
        return this.#items[position] || null;
    }

    /**
     * Gets the item type of the list.
     *
     * All items in the model must of this type, or derived from it. If the
     * type itself is an interface, the items must implement that interface.
     *
     * @returns {GObject.GType} the type of object in the list
     */
    vfunc_get_item_type() {
        return GObject.Object;
    }

    /**
     * Gets the number of items in the list.
     *
     * Depending on the model implementation, calling this function may be
     * less efficient than iterating the list with increasing values for
     * position until `null` is returned.
     *
     * @returns {number} - a positive integer
     */
    vfunc_get_n_items() {
        return this.#items.length;
    }

    /*
     * NOTE: The methods below are not part of the GListModel interface.
     */

    /**
     * Insert an item in the list. If @position is greater than the number of
     * items in the list or less than `0` it will be appended to the end of the
     * list.
     *
     * @param {GObject.Object} item - the item to add
     * @param {number} [position] - the position to add the item
     */
    insertItem(item, position = -1) {
        // Type check the item
        if (!(item instanceof GObject.Object))
            throw TypeError(`Not a GObject: ${item.constructor.name}`);

        if (!GObject.type_is_a(item.constructor.$gtype, this.get_item_type()))
            throw TypeError(`Invalid type: ${item.constructor.$gtype.name}`);

        // Normalize the position
        if (position < 0 || position > this.#items.length)
            position = this.#items.length;

        // Insert the item, then emit Gio.ListModel::items-changed
        this.#items.splice(position, 0, item);
        this.items_changed(position, 0, 1);
    }

    /**
     * Remove the item at @position. If @position is outside the length of the
     * list, this function does nothing.
     *
     * @param {number} position - the position of the item to remove
     */
    removeItem(position) {
        // NOTE: The Gio.ListModel interface will ensure @position is an
        //       unsigned integer, but other methods must check explicitly.
        if (position < 0 || position >= this.#items.length)
            return;

        // Remove the item and emit Gio.ListModel::items-changed
        this.#items.splice(position, 1);
        this.items_changed(position, 1, 0);
    }
});

```

--------------------------------

### Replace Existing File with GJS

Source: https://gjs.guide/guides/gio/file-operations

Shows how to replace an existing file or create a new one using Gio.File.replace_async with the REPLACE_DESTINATION flag. This method opens the file in write mode and returns a FileOutputStream for writing.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-file.txt');

const outputStream = await file.create_async(Gio.FileCreateFlags.REPLACE_DESTINATION,
    GLib.PRIORITY_DEFAULT, null);

const bytes = new GLib.Bytes('some file content');
const bytesWritten = await outputStream.write_bytes_async(bytes,
    GLib.PRIORITY_DEFAULT, null);
```

--------------------------------

### Panel Quick Settings Toggle

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

GNOME Shell 45 adds a new method to the Panel class to programmatically toggle the quick settings menu.

```javascript
ui.main.panel.toggleQuickSettings()
```

--------------------------------

### Display Markup Text with Gtk.Label in GJS

Source: https://gjs.guide/guides/gtk/3/06-text

Illustrates how to display styled text using Pango Markup with Gtk.Label. This requires setting the `useMarkup` property to `true` and formatting the label string with Pango tags.

```gjs
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

let label = new Gtk.Label({
    useMarkup: true,
    label: '<b>Hello!</b>'
});
let win = new Gtk.Window();
win.add(label);
win.show_all();

Gtk.main();

```

--------------------------------

### Create Synchronous Client Proxy (GJS)

Source: https://gjs.guide/guides/gio/dbus

Demonstrates how to create a synchronous client proxy for a D-Bus interface. This method blocks until the proxy is ready and is suitable for environments where blocking is acceptable.

```js
// Synchronous, blocking method
const proxySync = TestProxy(Gio.DBus.session, 'guide.gjs.Test',
    '/guide/gjs/Test');
```

--------------------------------

### Standalone GJS Console REPL

Source: https://gjs.guide/extensions/development/debugging

Shows how to use the standalone `gjs-console` for executing JavaScript code in a REPL environment, including logging and error handling.

```shell
$ gjs-console
gjs> log('a message');
Gjs-Message: 06:46:03.487: JS LOG: a message

gjs> try {
....     throw new Error('example');
.... } catch (e) {
....     logError(e, 'Prefix');
.... }
(gjs-console:9133): Gjs-WARNING **: 06:47:06.311: JS ERROR: Prefix: Error: example
@typein:2:16
@<stdin>:1:34
gjs> ^C
(To exit, press Ctrl+C again or Ctrl+D)
$
```

--------------------------------

### GNOME Extension Metadata Structure (JSON)

Source: https://gjs.guide/extensions/development/creating

Defines the essential `metadata.json` file for a GNOME Shell extension, including UUID, name, description, and shell version compatibility. This file provides metadata for the GNOME Shell to load and manage the extension.

```json
{
    "uuid": "example@gjs.guide",
    "name": "Example Extension",
    "description": "An example extension",
    "shell-version": [ "45" ],
    "url": "https://gjs.guide/extensions"
}
```

--------------------------------

### Compile GSettings Schemas

Source: https://gjs.guide/extensions/development/preferences

Compiles GSettings schemas using the `glib-compile-schemas` command. This step is required before schemas can be used by GNOME Shell extensions, unless using automated compilation tools.

```sh
$ cd ~/.local/share/gnome-shell/extensions/example@gjs.guide
$ glib-compile-schemas schemas/
```

--------------------------------

### XML Structure for GtkPopoverMenu

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

An alternative XML structure for defining a simple menu that can be used with GtkPopoverMenu. It shows a basic menu item within a menu definition.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">

    <menu id="mymenu">
        <item>
            <attribute name='label' translatable='yes'>Menu Item</attribute>
        </item>
    </menu>

    <template class="PrefsWidget" parent="GtkBox">
        <property name="visible">True</property>
        <property name="can-focus">True</property>
        <property name="vexpand">1</property>
        <child>
            <object class="GtkBox">
                <property name="visible">True</property>
                <property name="can-focus">True</property>
                <property name="orientation">vertical</property>
                <child>
                    <object class="GtkMenuButton" id="menubtn">
                        <property name="receives-default">True</property>
                        <property name="icon-name">open-menu-symbolic</property>
                    </object>
                </child>
            </object>
        </child>
    </template>

</interface>
```

--------------------------------

### Create Directory with GJS

Source: https://gjs.guide/guides/gio/file-operations

Illustrates creating a single directory asynchronously using Gio.File.make_directory_async. This method does not create parent directories recursively.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-directory');

const success = await file.make_directory_async(GLib.PRIORITY_DEFAULT,
    null);
```

--------------------------------

### Creating and Assigning GtkPopoverMenu in JavaScript

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates how to create a GtkPopoverMenu from a menu model and assign it to a GtkMenuButton. This allows for custom popover menus within GTK widgets.

```javascript
const {GObject, Gtk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'mymenu',
        'menubtn',
    ],
}, class PrefsWidget extends Gtk.Box {

    _init(params = {}) {

        super._init(params);

        this._popoverMenu = Gtk.PopoverMenu.new_from_model(this._mymenu);
		this._menubtn.set_popover(this._popoverMenu);
    }
});

function init() {}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

--------------------------------

### Clutter.Stage.get_key_focus() Behavior Change

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

The `Clutter.Stage.get_key_focus()` method now consistently returns the actual key focus actor. If no focus is explicitly set, it returns `null` instead of the stage itself.

```APIDOC
Clutter.Stage.get_key_focus() Behavior:

Description:
  The `Clutter.Stage.get_key_focus()` method's behavior has been updated to always match the `key_focus` property. If no explicit focus is set on the stage, it will now return `null`.

Previous Behavior:
  - Could return the stage itself if no explicit focus was set.

New Behavior:
  - Returns the actor with key focus.
  - Returns `null` if no actor has explicit key focus.
```

--------------------------------

### GNOME Shell: Define Preferences Window UI with XML

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

Defines the structure of a GNOME Shell preferences window page using an XML interface definition. This XML describes pages, groups, and rows with widgets like switches.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
  <object class="AdwPreferencesPage" id="my_page">
    <property name="name">my-page</property>
    <property name="title" translatable="yes">My Page</property>
    <property name="icon-name">folder-symbolic</property>
    <child>
      <object class="AdwPreferencesGroup" id="my_group">
        <property name="title" translatable="yes">My Group</property>
        <child>
          <object class="AdwActionRow" id="my_row">
            <property name="title" translatable="yes">My Switch</property>
            <property name="activatable-widget">my_switch</property>
            <child>
              <object class="GtkSwitch" id="my_switch">
                <property name="valign">center</property>
              </object>
            </child>
          </object>
        </child>
      </object>
    </child>
  </object>
</interface>
```

--------------------------------

### WindowManager Keybindings

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Mentions new keybindings introduced in ui/windowManager/WindowManager for GNOME Shell 46.

```APIDOC
ui/windowManager/WindowManager:

New Keybindings (GNOME Shell 46):
- Added new key bindings for opening new instances of pinned applications.
- Example: `Super + Ctrl + Number`.
```

--------------------------------

### Load Template Widget in GJS

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Loads a UI template defined in an XML file into a GJS widget subclass. It registers the widget class and specifies the path to the UI template file, enabling signal handling.

```javascript
const {GObject, Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
}, class PrefsWidget extends Gtk.Box {

    _init(params = {}) {
        super._init(params);
    }

    _onButtonClicked(button) {
        button.set_label('Clicked!');
    }
});

function init() {
    ExtensionUtils.initTranslations('my-gettext-domain');
}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

--------------------------------

### WindowManager Methods Signature Changes

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

Documents changes to several methods within WindowManager, which now include an 'event' parameter as their third argument. This affects methods related to window switching and application management.

```APIDOC
WindowManager Method Signature Updates:

The following methods now include an 'event' parameter as their third argument:

- `_startSwitcher()`
- `_startA11ySwitcher()`
- `_switchToApplication()`
- `_openNewApplicationWindow()`
- `_showWorkspaceSwitcher()`

Location: /ui/windowManager.js/WindowManager
```

--------------------------------

### Meta.Laters: Managing delayed function calls

Source: https://gjs.guide/extensions/upgrading/gnome-shell-44

Explains the API change from `Meta.later_add()` and `Meta.later_remove()` to `Meta.Laters.add()` and `Meta.Laters.remove()`. It shows how to obtain the `Meta.Laters` instance from the compositor to schedule and cancel delayed operations.

```javascript
const laters = global.compositor.get_laters();

// Example usage (assuming 'myFunction' and 'myArgs' are defined):
// const timeoutId = laters.add(myFunction, myArgs);
// laters.remove(timeoutId);
```

--------------------------------

### Create Regular File with GJS

Source: https://gjs.guide/guides/gio/file-operations

Demonstrates how to create a new regular file and write content to it asynchronously using Gio.File.create_async and Gio.FileOutputStream.write_bytes_async. If the file exists, this method will throw an error.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-file.txt');

const outputStream = await file.create_async(Gio.FileCreateFlags.NONE,
    GLib.PRIORITY_DEFAULT, null);

const bytes = new GLib.Bytes('some file content');
const bytesWritten = await outputStream.write_bytes_async(bytes,
    GLib.PRIORITY_DEFAULT, null);
```

--------------------------------

### InputSourceManager _switchInputSource Signature Change

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

Documents a change in the _switchInputSource method signature within InputSourceManager. The method now accepts an additional 'event' parameter.

```APIDOC
InputSourceManager._switchInputSource:
  Old signature: _switchInputSource(display, window, binding)
  New signature: _switchInputSource(display, window, event, binding)
  Description: Switches the input source. The 'event' parameter is now included.
  Location: /ui/status/keyboard.js
```

--------------------------------

### Implement a GObject Interface in GJS

Source: https://gjs.guide/guides/gobject/interfaces

Shows a minimal implementation of a GObject Interface in GJS. It details how to declare the interface implementation, override properties using `GObject.ParamSpec.override`, and provide required method implementations.

```javascript
const SimpleImplementation = GObject.registerClass({
    Implements: [SimpleInterface],
    Properties: {
        'simple-property': GObject.ParamSpec.override('simple-property',
            SimpleInterface),
    },
}, class SimpleImplementation extends GObject.Object {
    get simple_property() {
        return true;
    }

    requiredMethod() {
        console.log('requiredMethod() implemented');
    }
});
```

--------------------------------

### Keyboard Model Configuration

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Describes new support for keyboard model configuration in GNOME Shell 46, including API changes.

```APIDOC
ui/status/keyboard.js/InputSourceSystemSettings:

Keyboard Model Configuration Support (xkb-model):
- Added new getter and setter for the `keyboardModel` property.
- Emits the `keyboard-model-changed` signal when the keyboard mode is modified.
```

--------------------------------

### GTK4 Margin Properties (XML)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Details the replacement of `margin-left` and `margin-right` with `margin-start` and `margin-end` in GTK4 to better support Right-to-Left (RTL) layouts.

```xml
<property name="margin-left">5</property>
<property name="margin-right">5</property>
<property name="margin-top">5</property>
<property name="margin-bottom">5</property>
```

```xml
<property name="margin-start">5</property>
<property name="margin-end">5</property>
<property name="margin-top">5</property>
<property name="margin-bottom">5</property>
```

--------------------------------

### Accessing Extension Object by UUID or URL

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Shows how to retrieve the extension object and its settings using static methods `Extension.lookupByUUID` and `Extension.lookupByURL`. This is useful for accessing extension properties from different modules.

```js
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

let extensionObject, extensionSettings;

// Getting the extension object by UUID
extensionObject = Extension.lookupByUUID('example@gjs.guide');
extensionSettings = extensionObject.getSettings();
console.log(extensionObject.metadata);

// Getting the extension object by URL
extensionObject = Extension.lookupByURL(import.meta.url);
extensionSettings = extensionObject.getSettings();
console.log(extensionObject.metadata);
```

--------------------------------

### GNOME Extension Metadata (Minimal JSON)

Source: https://gjs.guide/extensions/overview/anatomy

A minimal JSON structure for metadata.json, containing essential fields like uuid, name, description, shell-version, and url. This file is required for every GNOME Shell extension.

```json
{
    "uuid": "example@gjs.guide",
    "name": "Example Extension",
    "description": "An example extension",
    "shell-version": [ "45" ],
    "url": "https://gjs.guide/extensions"
}
```

--------------------------------

### Create Proxy Wrapper from XML Interface (GJS)

Source: https://gjs.guide/guides/gio/dbus

Defines an XML string representing a D-Bus interface, including methods, signals, and properties. The `Gio.DBusProxy.makeProxyWrapper` function is then used to generate a JavaScript class for this interface, simplifying client proxy creation.

```js
const interfaceXml = `
<node>
  <interface name="guide.gjs.Test">
    <method name="SimpleMethod"/>
    <method name="ComplexMethod">
      <arg type="s" direction="in" name="input"/>
      <arg type="u" direction="out" name="length"/>
    </method>
    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
    <property name="ReadOnlyProperty" type="s" access="read"/>
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
  </interface>
</node>`;

// Pass the XML string to create a proxy class for that interface
const TestProxy = Gio.DBusProxy.makeProxyWrapper(interfaceXml);
```

--------------------------------

### Feature Detection using try...catch (JavaScript)

Source: https://gjs.guide/extensions/development/targeting-older-gnome

Provides an alternative method for feature detection by wrapping the potentially unavailable code in a try...catch block. This allows for graceful fallback mechanisms when an API is not present.

```javascript
try {
    method();
} catch (e) {
    // Use another method, write a replacement, or do nothing
}
```

--------------------------------

### CreateIcon Callback for Search Result Icons

Source: https://gjs.guide/extensions/topics/search-provider

Defines the `CreateIcon` callback function signature used by GNOME Shell search providers. This callback is responsible for generating a visual representation (Clutter.Actor) for a search result, considering the requested icon size and scaling.

```APIDOC
/**
 * Create an icon for a search result.
 *
 * Implementations may want to take scaling into consideration.
 *
 * @callback CreateIcon
 * @param {number} size - The requested size of the icon
 * @returns {Clutter.Actor} An icon
 */

// Example implementation detail:
// Implementations can call `St.ThemeContext.get_for_stage()` on `global.stage`
// to get the current scale and use it as a multiplier for the `size` argument.

```

--------------------------------

### Cogl.SnippetHook Usage Update

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

Advises on the correct constant to use for Cogl snippet hooks. Cogl.SnippetHook.FRAGMENT should be used instead of the older Shell.SnippetHook.FRAGMENT.

```APIDOC
Cogl.SnippetHook Usage:

- Use `Cogl.SnippetHook.FRAGMENT` for snippet hooks.
- This constant is exposed in version 45 and later.
- Previously, `Shell.SnippetHook.FRAGMENT` was used.

Location: Cogl API
```

--------------------------------

### Convert and Validate GTK XML with gtk4-builder-tool

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Utilizes the gtk4-builder-tool to convert GTK3 XML interface files to GTK4 format and validate their compatibility. This command-line tool aids in migrating UI definitions.

```sh
# Install gtk4-builder-tool
sudo dnf install gtk4-devel

# Validate an XML interface file
gtk4-builder-tool validate ~/Projects/example@gjs.guide/prefs.ui

# Convert XML to GTK4 and print to stdout
gtk4-builder-tool simplify --3to4 ~/Projects/example@gjs.guide/prefs.ui

# Convert XML to GTK4 and overwrite the input file
gtk4-builder-tool simplify --3to4 --replace ~/Projects/example@gjs.guide/prefs.ui
```

--------------------------------

### PopupBaseMenuItem Class

Source: https://gjs.guide/extensions/topics/popup-menu

An abstract base class for all menu items in the PopupMenu module. It cannot be instantiated directly but provides common methods, properties, and signals.

```APIDOC
PopupBaseMenuItem:
  Parent Class: St.BoxLayout
  Description: Abstract base class for menu items.

  Constructor:
    new PopupBaseMenuItem(params)
    - params (Object): Additional item properties.
      - activate (Boolean): Whether the item can be activated (default: true).
      - can_focus (Boolean): Whether the item can be focused (default: true).
      - hover (Boolean): Whether the item responds to pointer hover (default: true).
      - reactive (Boolean): Whether the item is sensitive (default: true).
      - style_class (String): Additional CSS classes (all items have 'popup-menu-item').

  Methods:
    activate(event)
      - Description: Emits the 'activate' signal on the item.
      - Parameters:
        - event (Clutter.Event): The Clutter.Event to emit.

    setOrnament(ornament)
      - Description: Sets the ornament for the item.
      - Parameters:
        - ornament (PopupMenu.Ornament): A PopupMenu.Ornament value.

  Properties:
    active (Boolean): Whether the item is selected or hovered (read-write).
    sensitive (Boolean): Whether the item can be selected and activated (read-write).

  Signals:
    activate(item, event)
      - Description: Emitted when the item is activated.
      - Parameters:
        - item (PopupMenu.PopupBaseMenuItem): The emitting object.
        - event (Clutter.Event): The current Clutter.Event.
```

--------------------------------

### Compile GJS Extension Translations

Source: https://gjs.guide/extensions/development/translations

This snippet shows the command-line usage of the `gnome-extensions` tool to pack a GJS extension, including its translation files. It specifies the directory containing the translation files using the `--podir` option.

```sh
$ gnome-extensions pack --podir=po example@gjs.guide
```

--------------------------------

### Session Mode Requirements

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Specifies conditions and requirements for using the 'unlock-dialog' session mode, which allows extensions to continue running while the screen is locked. It mandates disconnecting keyboard event signals and documenting the reason for using this mode.

```APIDOC
Session Mode: unlock-dialog

Conditions for Use:
  - MUST be necessary for the extension to operate correctly.

Requirements:
  - All signals related to keyboard events MUST be disconnected in 'unlock-dialog' session mode.
  - The disable() function MUST have a comment explaining why 'unlock-dialog' is being used.

Restrictions:
  - Extensions MUST NOT disable selectively.
```

--------------------------------

### JavaScript: Owning a Bus Name

Source: https://gjs.guide/guides/gio/dbus

Demonstrates how to acquire a well-known name on a D-Bus connection using GJS. It includes setting up callback functions for when the bus connection is acquired, the name is successfully owned, and when the name is lost. The snippet also shows how to unown the name when it's no longer needed.

```javascript
import Gio from 'gi://Gio';

/**
 * Invoked when a connection to a message bus has been obtained.
 *
 * If there is a client waiting for the well-known name to appear on the bus,
 * you probably want to export your interfaces here. This way the interfaces
 * are ready to be used when the client is notified the name has been owned.
 *
 * @param {Gio.DBusConnection} connection - the connection to a message bus
 * @param {string} name - the name that is requested to be owned
 */
function onBusAcquired(connection, name) {
    console.log(`${name}: connection acquired`);
}

/**
 * Invoked when the name is acquired.
 *
 * On the other hand, if you were using something like GDBusObjectManager to
 * watch for interfaces, you could export your interfaces here.
 *
 * @param {Gio.DBusConnection} connection - the connection that acquired the name
 * @param {string} name - the name being owned
 */
function onNameAcquired(connection, name) {
    console.log(`${name}: name acquired`);
}

/**
 * Invoked when the name is lost or @connection has been closed.
 *
 * Typically you won't see this callback invoked, but it might happen if you
 * try to own a name that was already owned by someone else.
 *
 * @param {Gio.DBusConnection|null} connection - the connection on which to
 *     acquire the name, or %null if the connection was disconnected
 * @param {string} name - the name being owned
 */
function onNameLost(connection, name) {
    console.log(`${name}: name lost`);
}

// Just like a signal handler ID, the `Gio.bus_own_name()` function returns a
// unique ID we can use to unown the name when we're done with it.
const ownerId = Gio.bus_own_name(
    Gio.BusType.SESSION,
    'guide.gjs.Test',
    Gio.BusNameOwnerFlags.NONE,
    onBusAcquired,
    onNameAcquired,
    onNameLost);

// Note that `onNameLost()` is NOT invoked when manually unowning a name.
Gio.bus_unown_name(ownerId);

```

--------------------------------

### buildPrefsWidget() Return Types

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

The buildPrefsWidget() function in GNOME Shell extensions is used to create the preferences window. Since GNOME Shell 42, it utilizes Adw.PreferencesWindow, allowing it to return three types of widgets: Adw.PreferencesPage, Adw.PreferencesGroup, or a generic Gtk.Widget. This provides flexibility for developers to use Libadwaita or existing GTK4 UI components.

```APIDOC
buildPrefsWidget(): Adw.PreferencesPage | Adw.PreferencesGroup | Gtk.Widget
  - Description: Defines the preferences window for GNOME Shell extensions.
  - Return Types:
    - Adw.PreferencesPage: Returns a Libadwaita Page.
      Structure: Adw.PreferencesWindow -> Adw.PreferencesPage
    - Adw.PreferencesGroup: Returns a Libadwaita Preferences Group.
      Structure: Adw.PreferencesWindow -> Adw.PreferencesPage -> Adw.PreferencesGroup
    - Gtk.Widget: Returns a GTK4 Widget.
      Structure: Adw.PreferencesWindow -> Adw.PreferencesPage -> Gtk.Widget
  - Notes:
    - Developers can use old GTK4 UI without changes.
    - The function's return type dictates the structure of the preferences window.
```

--------------------------------

### Meta Namespace and Function Renames

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

Several `Meta` functions have been renamed and moved to the `Meta.Compositor` namespace. Other `Meta` functions related to Clutter debug flags are now available directly in the `Clutter` namespace.

```APIDOC
Meta Namespace and Function Renames:

Description:
  This section details renames and moves for `Meta` functions in GNOME Shell 48.

Renamed and Moved Functions (Meta -> Meta.Compositor):
  - `Meta.disable_unredirect_for_display` -> `Meta.Compositor.disable_unredirect`
  - `Meta.enable_unredirect_for_display` -> `Meta.Compositor.enable_unredirect`
  - `Meta.get_top_window_group_for_display` -> `Meta.Compositor.get_top_window_group`
  - `Meta.get_window_actors` -> `Meta.Compositor.get_window_actors`
  - `Meta.get_window_group_for_display` -> `Meta.Compositor.get_window_group`
  - `Meta.CursorTracker.get_for_display()` -> `global.backend.get_cursor_tracker()`

Accessing Meta.Compositor:
  - Use `global.compositor` to get the `Meta.Compositor` instance.

Clutter Debug Flag Functions (Meta -> Clutter):
  - `Meta.get_clutter_debug_flags()` -> `Clutter.get_debug_flags()`
  - `Meta.add_clutter_debug_flags()` -> `Clutter.add_debug_flags()`
  - `Meta.remove_clutter_debug_flags()` -> `Clutter.remove_clutter_debug_flags()`
```

--------------------------------

### BackgroundAppMenuItem Spinner Animation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

BackgroundAppMenuItem now supports a spinner animation, which can be initiated when the associated application is quitting.

```javascript
BackgroundAppMenuItem._init()
// Style Class: .spinner
```

--------------------------------

### gjs: Analyzing Stack Traces with GDB and gjs_dumpstack()

Source: https://gjs.guide/extensions/development/debugging

When a breakpoint is hit or an error occurs, use GDB commands to inspect the call stack. The 'backtrace' command shows the C-level stack, while 'call (void)gjs_dumpstack()' provides a more readable JavaScript stack trace, essential for debugging gjs extensions.

```gdb
(gdb) backtrace
#0  _g_log_abort (breakpoint=<optimized out>) at ../glib/gmessages.c:555
#1  g_log_writer_default (log_level=10, log_level@entry=G_LOG_LEVEL_CRITICAL, fields=fields@entry=0x555556f68d30, n_fields=n_fields@entry=6, user_data=0x0) at ../glib/gmessages.c:2812
...

(gdb) call (void)gjs_dumpstack()
== Stack trace for context 0x5555558f1180 ==
#0   7fffffffaf60 b   resource:///org/gnome/gjs/modules/core/overrides/GLib.js:363 (22a14b380c90 @ 352)
#1   5555569a03c8 i   resource:///org/gnome/gjs/modules/esm/console.js:592 (22a14b373380 @ 1948)
#2   5555569a02c0 i   resource:///org/gnome/gjs/modules/esm/console.js:389 (22a14b3732e0 @ 357)
#3   5555569a0228 i   resource:///org/gnome/gjs/modules/esm/console.js:132 (22a14b36cbf0 @ 39)
#4   7fffffffba30 b   self-hosted:1121 (22a14b373f60 @ 432)
#5   5555569a0190 i   /home/user/.local/share/gnome-shell/extensions/example@gjs.guide/extension.js:61 (33fcaf52a790 @ 85)
#6   7fffffffc4f0 b   resource:///org/gnome/shell/ui/extensionSystem.js:196 (d4e5c9139c0 @ 813)
#7   5555569a0018 i   resource:///org/gnome/shell/ui/extensionSystem.js:398 (d4e5c913e20 @ 450)
#8   55555699ff78 i   self-hosted:1429 (113a3aabf6a0 @ 30)
#9   7fffffffce00 b   self-hosted:632 (1e5cbbbf2420 @ 15)
```

--------------------------------

### GLib Timeout and Idle Sources

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Demonstrates creating and using `GLib.timeout_add_seconds` for timed events and `GLib.idle_add` for events that run when the system is idle. Both return `GLib.SOURCE_REMOVE` to stop them after one execution.

```js
import GLib from 'gi://GLib';

const loop = new GLib.MainLoop(null, false);

// Timeout sources execute a callback when the interval is reached
const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    console.log('This callback was invoked because the timeout was reached');

    return GLib.SOURCE_REMOVE;
});

// Idle sources execute a callback when no other sources with a higher priority
// are ready.
const idleId = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
    console.log('This callback was invoked because no other sources were ready');

    return GLib.SOURCE_REMOVE;
});

await loop.runAsync();
```

--------------------------------

### Describe version-name Configuration Field

Source: https://gjs.guide/extensions/overview/anatomy

Defines the user-visible version name for a GNOME Shell extension. It must be a string between 1 and 16 characters, containing only letters, numbers, spaces, and periods, and must include at least one letter or number. A specific regex validates the format.

```APIDOC
`version-name`

This field sets the version visible to users. If not given the `version` field will be displayed instead.

The value **MUST** be a string that only contains letters, numbers, space and period with a length between 1 and 16 characters. It **MUST** contain at least one letter or number.

A valid `version-name` will match the regex `/^(?!^[. ]+$)[a-zA-Z0-9 .]{1,16}$/`.
```

--------------------------------

### Packing GLib.Variant with Constructor and new Keyword

Source: https://gjs.guide/guides/glib/gvariant

Illustrates two ways to construct GLib.Variant objects: using specific constructor methods like `new_strv` and using the `new` keyword with a type string. Verifies equality between variants created by both methods.

```javascript
import GLib from 'gi://GLib';

// Both of these function create identical GVariant instances
const stringList = ['one', 'two'];
const variantStrv1 = GLib.Variant.new_strv('as', stringList);
const variantStrv2 = new GLib.Variant('as', stringList);

if (variantStrv1.get_type_string() === 'as')
    print('Variant is an array of strings!');

if (variantStrv1.equal(variantStrv2))
    print('Success!');

if (variantStrv1.get_strv().every(value => stringList.includes(value)))
    print('Success!');
```

--------------------------------

### Clutter Event Handling

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Developers should use Clutter.Event getters instead of accessing event fields directly in vfuncs and signals.

```APIDOC
Clutter.Event:
  Use getters instead of direct field access.
  Example:
    Instead of event.button, use event.get_button()
  References:
    - mutter!3163
    - gnome-shell!2872
```

--------------------------------

### Meta Rectangle Replacement

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Meta.Rectangle is deprecated and should be replaced with Mtk.Rectangle. Meta.Rectangle is temporarily aliased for compatibility.

```APIDOC
Meta.Rectangle:
  Deprecated. Replace with Mtk.Rectangle.
  Compatibility Alias:
    Meta.Rectangle is aliased to a function returning Mtk.Rectangle.
    (See commit gnome-shell@f1317f07)
  References:
    - mutter!3128
```

--------------------------------

### Gio.ListModel Interface Requirements

Source: https://gjs.guide/guides/gio/list-models

Details the essential methods required for implementing the `Gio.ListModel` interface in GJS. These methods are crucial for managing and accessing list items, defining the list's item type, and reporting the number of items.

```APIDOC
Gio.ListModel Interface Methods:

1. Gio.ListModel.get_item(position)
   - Description: Returns the GObject.Object at the specified position. Returns null if an invalid position is passed.
   - Parameters:
     - position (number): The index of the item to retrieve.
   - Returns:
     - GObject.Object | null: The item at the given position, or null if the position is out of bounds.

2. Gio.ListModel.get_item_type()
   - Description: Returns the GType shared by all objects in the list. This can be GObject.Object or any common ancestor or interface.
   - Returns:
     - GObject.GType: The GType of items in the list.

3. Gio.ListModel.get_n_items()
   - Description: Returns the current number of items in the list. This value must be accurate when the Gio.ListModel::items-changed signal is emitted.
   - Returns:
     - number: The total count of items in the list.

Note: Gio.ListModel is intended for single-threaded use and requires items to inherit from GObject.Object, not boxed types like GObject.TYPE_JSOBJECT.
```

--------------------------------

### Import GJS Built-in and GObject Introspection Libraries

Source: https://gjs.guide/extensions/overview/imports-and-modules

Shows how to import various libraries available in GJS. This includes built-in modules like `Cairo` and `System`, and libraries exposed via GObject Introspection such as `Clutter`, `Meta`, `St`, `Shell`, `Gdk`, `Gtk`, and `Adw`. Versioned imports for GDK and GTK are also demonstrated.

```javascript
/* GJS's Built-in modules have custom specifiers */
import Cairo from 'cairo';
import System from 'system';

/* Common imports found in `extension.js` */
import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';
import St from 'gi://St';
import Shell from 'gi://Shell';

/* Common imports found in `prefs.js` */
import Gdk from 'gi://Gdk?version=4.0';
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw';
```

--------------------------------

### GNOME Shell Extension Imports for Search Providers

Source: https://gjs.guide/extensions/topics/search-provider

Essential JavaScript imports required for developing GNOME Shell extensions that implement search providers. These include modules for UI elements, extension core functionality, and main shell components.

```js
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

```

--------------------------------

### Connect to GTK Widget Signals in GJS

Source: https://gjs.guide/guides/gtk/3/02-widgets

Demonstrates how to listen for events emitted by GTK widgets using the `connect()` method. It takes a signal name and a callback function to execute when the signal is triggered.

```javascript
button.connect('clicked', () => {
    log('The button was clicked');
});
```

--------------------------------

### PopupMenu Animations

Source: https://gjs.guide/extensions/topics/popup-menu

Lists the available animation types for opening and closing menus, defined within the BoxPointer module. These options control the visual transition effects of the popup menus.

```APIDOC
BoxPointer.PopupAnimation:

  - BoxPointer.PopupAnimation.NONE: No animation.
  - BoxPointer.PopupAnimation.SLIDE: Slide in or out.
  - BoxPointer.PopupAnimation.FADE: Fade in or out.
  - BoxPointer.PopupAnimation.FULL: Slide and fade, in or out.
```

--------------------------------

### Promisify Gio.InputStream read_bytes_async

Source: https://gjs.guide/guides/gjs/asynchronous-programming

Demonstrates using the `Gio._promisify` helper to wrap the `read_bytes_async` method of `Gio.InputStream`. This allows the asynchronous operation to be called using `await`, simplifying error handling and control flow. The helper replaces the original function on the class prototype.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// Promisify the read_bytes_async method on the InputStream prototype
Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async',
    'read_bytes_finish');

const inputStream = new Gio.UnixInputStream({fd: 0});

// Use the promisified method with await
try {
    const bytes = await inputStream.read_bytes_async(4096,
        GLib.PRIORITY_DEFAULT, null);
    // Process the bytes here
    log(`Read ${bytes.length} bytes`);
} catch (e) {
    logError(e, 'Failed to read bytes');
}
```

--------------------------------

### GJS Extension Translation Functions

Source: https://gjs.guide/extensions/development/translations

Demonstrates the usage of gettext functions (_(), ngettext(), pgettext()) for marking strings for translation in GJS extensions. It also shows how to use String.prototype.format() for interpolated values and imports necessary modules like St, Extension, Main, and PanelMenu.

```javascript
import St from 'gi://St';

import {Extension, gettext as _, ngettext, pgettext} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);

        // A string needing more context is marked with `pgettext()`
        this._indicator.menu.addAction(pgettext('menu item', 'Notify'), () => {
            this._count += 1;

            // A regular translatable string is marked with the `_()` function
            const title = _('Notification');

            // A "countable" string is marked with the `ngettext()` function
            const body = ngettext('You have been notified %d time',
                'You have been notified %d times',
                this._count).format(this._count);

            Main.notify(title, body);
        });

        this._count = 0;
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}
```

--------------------------------

### GNOME Extension GSchema XML

Source: https://gjs.guide/extensions/development/typescript

Defines preference schemas for a GNOME Shell extension using GSettings. It specifies keys, their types, default values, and descriptions, enabling structured configuration management for extensions.

```xml
<?xml version="1.0" encoding="utf-8"?>
<schemalist>
  <schema id="org.gnome.shell.extensions.my-extension" path="/org/gnome/shell/extensions/my-extension/">
    <key name="padding-inner" type="i">
      <default>8</default>
      <summary>Inner padding</summary>
      <description>Padding between windows</description>
    </key>
    <key name="animate" type="b">
      <default>true</default>
      <summary>Animation</summary>
      <description>Whether to animate window movement/resizing</description>
    </key>
  </schema>
</schemalist>
```

--------------------------------

### GNOME Shell 45+ Object Destruction

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Shows the correct way to destroy objects and clean up resources in the `disable` method for GNOME Shell extensions in version 45 and later. It demonstrates safely destroying a `St.Widget` instance.

```js
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ExampleExtension extends Extension {
    enable() {
        this._widget = new St.Widget();
    }

    disable() {
        this._widget?.destroy();
        this._widget = null;
    }
}
```

--------------------------------

### Create Asynchronous Client Proxy with Promise (GJS)

Source: https://gjs.guide/guides/gio/dbus

Shows how to create an asynchronous client proxy using a Promise-based approach. This is a non-blocking method that resolves with the proxy object upon successful connection or rejects with an error.

```js
// Asynchronous, non-blocking method (Promise-wrapped)
const proxyAsync = await new Promise((resolve, reject) => {
    TestProxy(
        Gio.DBus.session,
        'guide.gjs.Test',
        '/guide/gjs/Test',
        (proxy, error) => {
            if (error === null)
                resolve(proxy);
            else
                reject(error);
        },
        null, /* cancellable */
        Gio.DBusProxyFlags.NONE);
});
```

--------------------------------

### Clipboard Access Declaration and Restrictions

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Extensions accessing the clipboard must declare it. Sharing clipboard data with third parties or using default keyboard shortcuts for clipboard interaction is prohibited without explicit user consent.

```APIDOC
Clipboard Access:
  - Extensions that access the clipboard, with or without user interaction, MUST declare it in the description.
  - An extension MUST NOT share clipboard data with a third-party without explicit user interaction (e.g. button click, a user-defined keyboard shortcut).
  - An extension MUST NOT ship with default keyboard shortcuts for interacting with clipboard data.
```

--------------------------------

### Monitor GNOME Shell Output (X11)

Source: https://gjs.guide/extensions/development/creating

Monitors the output of the GNOME Shell process in real-time using journalctl. This is useful for debugging and observing extension behavior in an X11 session.

```sh
$ journalctl -f -o cat /usr/bin/gnome-shell
```

--------------------------------

### GJS buildPrefsWidget Function

Source: https://gjs.guide/extensions/development/targeting-older-gnome

Demonstrates the `buildPrefsWidget()` function, which was required in `prefs.js` prior to GNOME version 42 to return a `GtkWidget` for the preferences dialog. This function can still be used in current versions, with `fillPreferencesWindow` taking priority, allowing for version-specific widget implementations.

```javascript
function buildPrefsWidget() {
    return new Gtk.Label({ title: 'My extension preferences' });
}
```

--------------------------------

### Create and Trace GtkLabel in GJS

Source: https://gjs.guide/guides/gjs/memory-management

Demonstrates the basic creation of a GtkLabel in GJS and how assigning it to a JavaScript variable ('tracing') prevents the GObject from being garbage collected. This ensures the object remains valid as long as the variable holds a reference.

```js
import Gtk from 'gi://Gtk?version=4.0';

Gtk.init();

const myLabel = new Gtk.Label({
    label: 'Some Text',
});
```

--------------------------------

### Import Own Extension Modules (Old vs New)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Explains how to import local JavaScript files within an extension, moving from `imports.misc.extensionUtils.getCurrentExtension().imports.*` to relative ESM `import` paths.

```javascript
// Before GNOME 45
const Me = imports.misc.extensionUtils.getCurrentExtension();
const MyModule = Me.imports.MyModule;

// GNOME 45
import * as MyModule from './MyModule.js';
```

--------------------------------

### Version Number Detection and Comparison (JavaScript)

Source: https://gjs.guide/extensions/development/targeting-older-gnome

Shows how to detect and compare GNOME Shell versions programmatically. This allows extensions to execute different code paths based on specific version numbers or ranges, enabling fine-grained compatibility adjustments.

```javascript
const Config = imports.misc.config;
const [major, minor] = Config.PACKAGE_VERSION.split('.').map(s => Number(s));

if (major === 3 && minor <= 36)
    console.log('Shell 3.36 or lower');
else if (major === 3 && minor === 38)
    console.log('Shell 3.38');
else if (major >= 40)
    console.log('Shell 40 or higher');
```

--------------------------------

### Build File Path

Source: https://gjs.guide/guides/gtk/3/15-saving-data

Constructs a full file path by combining directory components using GLib's `build_filenamev`. This method correctly handles path separators for different operating systems.

```javascript
let dataDir = GLib.get_user_config_dir();
let destination = GLib.build_filenamev([dataDir, 'example-application', 'lastFile.json']);
```

--------------------------------

### Gio.Action and Gio.MenuModel API

Source: https://gjs.guide/guides/gio/actions-and-menus

Gio.Action is a GObject Interface used throughout the GNOME platform, providing a simpler interface to functionality like methods or properties. It can be used by widgets, desktop notifications, menus, or remotely via D-Bus. Gio.MenuModel describes menu structures with sections, submenus, and items, mapping to Gio.Action. Actions can be activatable or stateful, requiring Gio.Action.get_enabled() to return true. They are intended to be grouped by scope or context and serve as alternatives to signal handlers or D-Bus exports.

```APIDOC
Gio.Action
  Description: A high-level interface used throughout the GNOME platform, especially in GTK. Actions can provide a similar, but simpler interface to functionality such as methods or properties. They can be used by widgets, desktop notifications, menus or even remotely via D-Bus.
  Related API: Gio.MenuModel
  Types: Activatable, Stateful
  Enabled Check: Gio.Action.get_enabled()
  Purpose: Grouped by scope (e.g. app.quit, window.close) or by context (e.g. clipboard.copy, clipboard.paste).
  Alternatives: Signal handlers for widgets and menus, export over D-Bus.

GIO.SimpleAction
  Description: The common implementation of the Gio.Action interface.

Gio.MenuModel
  Description: A related API, used to describe a menu structure with sections, submenus and items. In the case of GTK, menu models can provide the structure and presentation for Gio.Action. While actions are purely functional, menu items can have labels, icons and map stateful actions to elements like checkboxes and radio buttons.
```

--------------------------------

### Displaying a Simple Notification

Source: https://gjs.guide/extensions/topics/notifications

Uses the `Main.notify()` method to display a basic notification to the user. This method takes a title and a body message as arguments.

```js
Main.notify('Simple Notification', 'A notification with a title and body');
```

--------------------------------

### Clutter.cairo Helpers Deprecation

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Informs about the deprecation of Clutter.cairo helpers in GNOME Shell 46 and suggests the alternative using cairo.Context.

```javascript
// Deprecated:
// Clutter.cairo_set_source_color(cr, color);
```

```APIDOC
Clutter.cairo helpers are deprecated in GNOME Shell 46.

If using `St.DrawingArea` and `cairo.Context` (aliased as `cr`):
- Instead of `Clutter.cairo_set_source_color(cr, color)`, use `cr.setSourceColor(color)`.
```

--------------------------------

### GJS ExtensionUtils Translation Functions

Source: https://gjs.guide/extensions/topics/extension-utils

Provides functions for internationalizing GJS applications using the gettext system. Supports basic string translation, pluralization, and context-aware translation.

```APIDOC
ExtensionUtils.initTranslations(domain)
  - Initializes Gettext to load translations from the `locale` subdirectory of the extension directory.
  - Parameters:
    - domain (String): The gettext domain to use. If not provided, it's taken from the `gettext-domain` field in `metadata.json`.

ExtensionUtils.gettext(str)
  - Translates a string using the extension's gettext domain.
  - Parameters:
    - str (String): The string to translate.
  - Returns:
    - (String): The translated string.

ExtensionUtils.ngettext(str, strPlural, n)
  - Translates a string and chooses the plural form based on a quantity.
  - Parameters:
    - str (String): The string to translate (singular form).
    - strPlural (String): The plural form of the string.
    - n (Number): The quantity for which translation is needed.
  - Returns:
    - (String): The translated string.

ExtensionUtils.pgettext(context, str)
  - Translates a string within a specific context to disambiguate.
  - Parameters:
    - context (String): The context to disambiguate `str`.
    - str (String): The string to translate.
  - Returns:
    - (String): The translated string.
```

--------------------------------

### GJS API Change: Clutter.Color vs Cogl.Color

Source: https://gjs.guide/extensions/upgrading/gnome-shell-47

Informs developers about the removal of `Clutter.Color` from the GJS API in favor of `Cogl.Color()`. This change requires updating code that previously used `Clutter.Color` to use the new `Cogl.Color`.

```APIDOC
API Change:
  `Clutter.Color` has been removed.

Replacement:
  Use `Cogl.Color()` instead.

Details:
  The functionality of `Clutter.Color` has been merged into `Cogl.Color()`. Developers should update their code to use the `Cogl.Color` constructor for color manipulation.
```

--------------------------------

### GNOME Shell 43 App Display Classes

Source: https://gjs.guide/extensions/upgrading/gnome-shell-43

GNOME Shell 43 updates the App display with new classes like `AppGrid` and `BaseAppViewGridLayout`. These classes manage the layout and navigation of application grids.

```APIDOC
GNOME Shell 43 App Display:

New classes for managing app grids:
  AppGrid: Manages the overall application grid.
  BaseAppViewGridLayout: Handles the layout of items within the grid, including page navigation and indicator visibility.
```

--------------------------------

### Call D-Bus Method with Arguments and Callback (GJS)

Source: https://gjs.guide/guides/gio/dbus

Demonstrates calling a D-Bus method that accepts arguments and uses a callback for asynchronous results. The callback receives the return value and any potential error object.

```js
proxy.ComplexMethodRemote('input string', (returnValue, errorObj, fdList) => {
    // If @errorObj is `null`, then the method call succeeded and the variant
    // will already be unpacked with `GLib.Variant.prototype.deepUnpack()`
    if (errorObj === null) {
        console.debug(`ComplexMethod('input string'): ${returnValue}`);

        if (fdList !== null) {
            // Methods that return file descriptors are fairly rare, so you
            // will know if you should expect one or not. Consult the API
            // documentation for `Gio.UnixFDList` for more information.
        }

    // If there was an error, then @returnValue will be an empty list and
    // @errorObj will be an Error object
    } else {
        console.warn(errorObj);
    }
});
```

--------------------------------

### Remove Main Loop Sources (GNOME 44 and earlier)

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Shows the correct way to remove main loop sources in the `disable()` method for GNOME 44 and earlier. Proper removal of sources is critical for extension lifecycle management and system stability. It employs `GLib.timeout_add_seconds` and `GLib.Source.remove`.

```js
const GLib = imports.gi.GLib;

class Extension {
    enable() {
        this._sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
            console.log('Source triggered');

            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        if (this._sourceId) {
            GLib.Source.remove(this._sourceId);
            this._sourceId = null;
        }
    }
}

function init() {
    return new Extension();
}
```

--------------------------------

### PopupMenu Signals

Source: https://gjs.guide/extensions/topics/popup-menu

Documents the signals emitted by the PopupMenu class, including their purpose, parameters, and types. These signals allow for reacting to menu events like activation, state changes, and destruction.

```APIDOC
PopupMenu Signals:

activate(menu, menuItem)
  - Emitted when an item is activated.
  - Parameters:
    - menu (PopupMenu.PopupBaseMenu): The emitting object.
    - menuItem (PopupMenu.PopupBaseMenuItem | null): The active item, or null if no item is active.

active-changed(menu, menuItem)
  - Emitted when the active menu item changes.
  - Parameters:
    - menu (PopupMenu.PopupBaseMenu): The emitting object.
    - menuItem (PopupMenu.PopupBaseMenuItem | null): The active item, or null if no item is active.

notify::sensitive(menu)
  - Emitted when the menu sensitivity changes (note this is not a GObject emission).
  - Parameters:
    - menu (PopupMenu.PopupBaseMenu): The emitting object.

open-state-changed(menu, open)
  - Emitted when the menu is opened or closed.
  - Parameters:
    - menu (PopupMenu.PopupBaseMenu): The emitting object.
    - open (Boolean): true if opened, false if closed.

destroy(menu)
  - Emitted when the menu is destroyed.
  - Parameters:
    - menu (PopupMenu.PopupBaseMenu): The emitting object.
```

--------------------------------

### ui/messageTray.js API and UI Updates

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Highlights new methods and property setters in ui/messageTray.js, along with style class updates for GNOME Shell 46.

```APIDOC
ui/messageTray.js:
  NotificationPolicy:
    - New static method 'newForApp()' to create a new policy for an application.
  Notification:
    - New 'iconName' getter and setter.
  System Notification Source:
    - 'ui/messageTray.js/getSystemSource()' allows retrieval of the system notification source used by Main.notify().
```

--------------------------------

### Conditional Import using Try-Catch

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates how to safely import a module only if it exists, preventing errors if the module is not available in the current GNOME Shell version. This is useful for handling API changes between versions.

```js
try {
    const SearchController = imports.ui.searchController;
} catch(err) {
    log("SearchController doesn't exist");
}
```

--------------------------------

### Initialize Translations in prefs.js

Source: https://gjs.guide/extensions/development/translations

Initializes translations for extension preferences using `initTranslations()` in the `ExtensionPreferences` subclass constructor. This is crucial for displaying translated preference UI elements.

```javascript
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    constructor(metadata) {
        super(metadata);

        this.initTranslations('example@gjs.guide');
    }

    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);
    }
}
```

--------------------------------

### GJS: Create a Gtk.Entry Widget

Source: https://gjs.guide/guides/gtk/3/08-editing-text

Demonstrates how to create a simple, single-line text input field using Gtk.Entry in GJS. It shows how to initialize the widget with a Gtk.EntryBuffer and retrieve the entered text when a button is clicked. This widget is suitable for short data entry.

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

const entry = new Gtk.Entry({
    buffer: new Gtk.EntryBuffer()
});

box.add(entry);

const button = new Gtk.Button({
    label: 'Enter'
});

button.connect('clicked', () => {
    log('Entered in the entry: ' + entry.get_buffer().text);
});

box.add(button);

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(box);
win.show_all();

Gtk.main();

```

--------------------------------

### GNOME Shell: Enable Search in Preferences Window

Source: https://gjs.guide/extensions/upgrading/gnome-shell-42

Explains how to enable the built-in search functionality for GNOME Shell preferences windows by setting the `search_enabled` property to `true`.

```javascript
function fillPreferencesWindow(window) {
    window.search_enabled = true;
    // ...
}
```

--------------------------------

### GTK4 Packing Properties (XML)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Illustrates the removal of the `<packing>` element in GTK4. Instead, properties like `hexpand` and `vexpand` are directly applied to the widget within its parent's `<child>` tag.

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <child>
        <placeholder/>
    </child>
</object>
<packing>
    <property name="expand">True</property>
    <property name="fill">True</property>
    <property name="position">0</property>
</packing>
```

```xml
<object class="GtkBox">
    <property name="visible">True</property>
    <property name="can-focus">False</property>
    <property name="hexpand">1</property>
    <child>
        <placeholder/>
    </child>
</object>
```

--------------------------------

### Add GtkEventControllerKey to Widget (JS)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Demonstrates how to add a GtkEventControllerKey to a widget in GJS. It connects the 'realize' signal to add the controller and defines a handler for the 'key-pressed' signal to update a label with the accelerator name.

```js
const {GObject, Gtk, Gdk} = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('prefs.ui').get_uri(),
    InternalChildren: [
        'log_label',
        'event_key_controller',
    ],
}, class PrefsWidget extends Gtk.Box {

    _init(params = {}) {

        super._init(params);

        this.connect('realize', () => {
            let window = this.get_root();
            window.add_controller(this._event_key_controller);
        });
    }

    _onKeyPressed(widget, keyval, keycode, state) {

        let mask = state & Gtk.accelerator_get_default_mod_mask();

        let binding = Gtk.accelerator_name_with_keycode(
            null, keyval, keycode, mask);

        this._log_label.set_label('Binding is: ' + binding);

        return Gdk.EVENT_STOP;
    }
});

function init() {}

function buildPrefsWidget() {
    return new PrefsWidget();
}
```

--------------------------------

### GDB Backtrace and JavaScript Stack Trace

Source: https://gjs.guide/extensions/development/debugging

Demonstrates how to obtain a GDB backtrace and how to call the `gjs_dumpstack()` function from within GDB to inspect the JavaScript call stack, which can be more informative for GJS-related issues.

```gdb
(gdb) run
Starting program: /usr/bin/gnome-shell --nested --wayland
...
Thread 1 "gnome-shell" received signal SIGTRAP, Trace/breakpoint trap.
JS::MutableHandle<JS::Value>::set (v=..., this=<optimized out>, this=<optimized out>, v=...) at /usr/include/mozjs-102/js/RootingAPI.h:708
(gdb) backtrace
#0  JS::MutableHandle<JS::Value>::set(JS::Value const&) (v=<optimized out>, this=<optimized out>, this=<optimized out>, v=<optimized out>) at /usr/include/mozjs-102/js/RootingAPI.h:708
#1  js::MutableWrappedPtrOperations<JS::Value, JS::MutableHandle<JS::Value> >::set(JS::Value const&) (v=<optimized out>, this=<optimized out>, this=<optimized out>, v=<optimized out>) at /usr/include/mozjs-102/js/Value.h:1285
#2  js::MutableWrappedPtrOperations<JS::Value, JS::MutableHandle<JS::Value> >::setUndefined() (this=<optimized out>, this=<optimized out>) at /usr/include/mozjs-102/js/Value.h:1290
#3  gjs_breakpoint(JSContext*, unsigned int, JS::Value*) (context=0x555555902940, argc=0, vp=0x55555699d998) at ../modules/system.cpp:115
#4  0x00007ffff5d4d0c0 in CallJSNative(JSContext*, bool (*)(JSContext*, unsigned int, JS::Value*), js::CallReason, JS::CallArgs const&)
    (args=..., reason=js::CallReason::Call, native=0x7ffff7824840 <gjs_breakpoint(JSContext*, unsigned int, JS::Value*)>, cx=0x555555902940) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:420
#5  js::InternalCallOrConstruct(JSContext*, JS::CallArgs const&, js::MaybeConstruct, js::CallReason) (cx=0x555555902940, args=..., construct=<optimized out>, reason=js::CallReason::Call)
    at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:507
#6  0x00007ffff5d412fc in InternalCall (reason=<optimized out>, args=<optimized out>, cx=<optimized out>) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:574
#7  js::CallFromStack(JSContext*, JS::CallArgs const&) (args=<optimized out>, cx=<optimized out>) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:578
#8  Interpret(JSContext*, js::RunState&) (cx=0x555555902940, state=...) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:3314
#9  0x00007ffff5d4cc19 in js::RunScript(JSContext*, js::RunState&) (cx=cx@entry=0x555555902940, state=...) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:389
#10 0x00007ffff5d4d188 in js::InternalCallOrConstruct(JSContext*, JS::CallArgs const&, js::MaybeConstruct, js::CallReason) (cx=0x555555902940, args=..., construct=js::NO_CONSTRUCT, reason=js::CallReason::Call)
    at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:539
#11 0x00007ffff61ce87c in InternalCall (reason=js::CallReason::Call, args=..., cx=0x555555902940) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:574
#12 js::CallFromStack(JSContext*, JS::CallArgs const&) (args=..., cx=0x555555902940) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:578
#13 js::jit::DoCallFallback(JSContext*, js::jit::BaselineFrame*, js::jit::ICFallbackStub*, unsigned int, JS::Value*, JS::MutableHandle<JS::Value>)
    (cx=0x555555902940, frame=0x7fffffffc4d0, stub=0x555556f55f00, argc=<optimized out>, vp=0x7fffffffc460, res=...) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/jit/BaselineIC.cpp:1582
#14 0x0000291c4f15de28 in  () 
#15 0x00007fffffffc518 in  () 
#16 0x00007fffffffc420 in  () 
#17 0xfff9800000000000 in  () 
#18 0x00007ffff66a6828 in _ZN2js3jitL11vmFunctionsE.lto_priv.0 () at /lib64/libmozjs-102.so.0
#19 0x0000291c4f1631a2 in  () 
#20 0x0000000000004022 in  () 
#21 0x00007fffffffc4d0 in  () 
#22 0x0000555556f55f00 in  () 
#23 0x0000000000000000 in  ()
```

```sh
(gdb) call (void)gjs_dumpstack()
== Stack trace for context 0x5555558f1820 ==
#0   55555699d920 i   /home/user/.local/share/gnome-shell/extensions/example@gjs.guide/extension.js:61 (32611242a790 @ 85)
#1   7fffffffc520 b   resource:///org/gnome/shell/ui/extensionSystem.js:196 (27cfeb5139c0 @ 813)
#2   55555699d7a8 i   resource:///org/gnome/shell/ui/extensionSystem.js:398 (27cfeb513e20 @ 450)
```

--------------------------------

### Logging API Changes

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

The `log()` function is now an alias for `console.log()`. Developers should use specific `console.*` methods for different log levels instead of `log()` for filtering.

```APIDOC
Logging Functions:
  - `log()` is now an alias for `console.log()`.
  - Use `console.debug()`, `console.error()`, `console.info()`, `console.log()`, `console.warn()` for specific log levels.
  - Filtering `journald` by `GNOME_SHELL_EXTENSION_UUID` and `GNOME_SHELL_EXTENSION_NAME` is no longer supported via `log()`.
```

--------------------------------

### GJS: Promisify Gio.File Async Methods

Source: https://gjs.guide/guides/gio/file-operations

This snippet demonstrates how to use Gio._promisify() to wrap asynchronous GJS methods for Gio.File, Gio.FileEnumerator, Gio.InputStream, and Gio.OutputStream. This helper function converts callback-based asynchronous operations into Promise-based ones, simplifying asynchronous programming in GJS.

```js
import Gio from 'gi://Gio';

/* Gio.File */
Gio._promisify(Gio.File.prototype, 'copy_async');
Gio._promisify(Gio.File.prototype, 'create_async');
Gio._promisify(Gio.File.prototype, 'delete_async');
Gio._promisify(Gio.File.prototype, 'enumerate_children_async');
Gio._promisify(Gio.File.prototype, 'load_contents_async');
Gio._promisify(Gio.File.prototype, 'make_directory_async');
Gio._promisify(Gio.File.prototype, 'move_async');
Gio._promisify(Gio.File.prototype, 'open_readwrite_async');
Gio._promisify(Gio.File.prototype, 'query_info_async');
Gio._promisify(Gio.File.prototype, 'replace_contents_async');
Gio._promisify(Gio.File.prototype, 'replace_contents_bytes_async',
    'replace_contents_finish');
Gio._promisify(Gio.File.prototype, 'trash_async');

/* Gio.FileEnumerator */
Gio._promisify(Gio.FileEnumerator.prototype, 'next_files_async');

/* Gio.InputStream */
Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async');

/* Gio.OutputStream */
Gio._promisify(Gio.OutputStream.prototype, 'write_bytes_async');
```

--------------------------------

### Bind Properties Between Objects

Source: https://gjs.guide/guides/gobject/basics

Illustrates binding the 'visible' property between a Gtk.Label and a Gtk.Box using `GObject.BindingFlags.SYNC_CREATE` and `GObject.BindingFlags.BIDIRECTIONAL`. This synchronizes the visibility state of both widgets, allowing changes in one to reflect in the other.

```js
const prefsTitle = new Gtk.Label({
    label: 'Preferences',
    css_classes: ['heading'],
});
const prefsBox = new Gtk.Box();

// Bind the visibility of the box and label
prefsTitle.bind_property('visible', prefsBox, 'visible',
    GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);

// Try to make the properties different
prefsTitle.visible = !prefsBox.visible;

if (prefsTitle.visible === prefsBox.visible)
    console.log('properties are equal!');
```

--------------------------------

### GNOME Shell Extension Core Logic

Source: https://gjs.guide/extensions/development/preferences

Implements the main logic for a GNOME Shell extension, including creating panel indicators, managing settings, and handling extension lifecycle events (enable/disable). It utilizes GJS modules like Gio, St, and Main.

```js
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

export default class ExampleExtension extends Extension {
    enable() {
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);

        // Add a menu item to open the preferences window
        this._indicator.menu.addAction(_('Preferences'),
            () => this.openPreferences());

        // Create a new GSettings object, and bind the "show-indicator"
        // setting to the "visible" property.
        this._settings = this.getSettings();
        this._settings.bind('show-indicator', this._indicator, 'visible',
            Gio.SettingsBindFlags.DEFAULT);

        // Watch for changes to a specific setting
        this._settings.connect('changed::show-indicator', (settings, key) => {
            console.debug(`${key} = ${settings.get_value(key).print(true)}`);
        });
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
        this._settings = null;
    }
}
```

--------------------------------

### GJS: Load GTK UI Template

Source: https://gjs.guide/guides/gtk/3/14-templates

This snippet demonstrates how to load a GTK user interface template into a GJS class. It uses `GObject.registerClass` with the `Template` property to associate a UI definition with a JavaScript class, enabling GTK to apply the template.

```javascript
/* imports */
var X = GObject.registerClass({
    Template: 'url://templateurl'
}, class X extends Gtk.ApplicationWindow {
    /* implementation */
});
```

--------------------------------

### GNOME Shell Extension Version Support

Source: https://gjs.guide/extensions/overview/updates-and-breakage

Extensions specify their compatibility with GNOME Shell versions using a metadata.json file. This file lists the versions the developer has tested and officially supports, allowing GNOME Shell to conditionally load extensions based on the user's shell version.

```APIDOC
metadata.json:
  - Description: Configuration file for GNOME Shell extensions.
  - Key Fields:
    - uuid: Unique identifier for the extension.
    - name: Display name of the extension.
    - description: A brief description of the extension.
    - version: The version number of the extension.
    - shell-version: A string or array of strings specifying the GNOME Shell versions the extension is compatible with. Example: "40.0" or ["3.38", "40.4"].
    - author: The author's name.
    - url: URL to the extension's homepage or repository.

  - Purpose of 'shell-version':
    - Enables GNOME Shell to check if an extension is compatible with the currently running version.
    - Helps prevent extensions from loading if they are known to be incompatible, thus improving desktop stability.
    - Historically, this check was disabled but was re-enabled starting with GNOME 40 due to significant shell changes.

  - Related Concepts:
    - Monkey-patching: The core mechanism extensions use to modify GNOME Shell's runtime behavior.
    - Extension Loading: GNOME Shell's process of enabling and running extensions.
```

--------------------------------

### GNOME Extension metadata.json

Source: https://gjs.guide/extensions/development/typescript

Defines essential metadata for a GNOME Shell extension, including name, description, UUID, and shell version compatibility. This file is crucial for the extension to be recognized and loaded by GNOME Shell.

```json
{
    "name": "My TypeScript Extension",
    "description": "An extension made with TypeScript",
    "uuid": "my-extension@example.com",
    "url": "https://github.com/example/my-extension",
    "settings-schema": "org.gnome.shell.extensions.my-extension",
    "shell-version": [
        "45"
    ]
}
```

--------------------------------

### Screenshot UI Updates

Source: https://gjs.guide/extensions/upgrading/gnome-shell-46

Details new enum values for screenshot mode and new signals for the ScreenshotUI class.

```APIDOC
ui/screenshot.js/UIMode enum:
- Added new value: SCREENSHOT_ONLY. This can be used when sessionMode.allowScreencast is false.

ui/screenshot.js/ScreenshotUI class:
- Added new signals: 'screenshot-taken' and 'closed'.
```

--------------------------------

### GNOME Shell 43 Signals with Signals.EventEmitter

Source: https://gjs.guide/extensions/upgrading/gnome-shell-43

In GNOME Shell 43, the pattern for handling signals has changed. Instead of `Signals.addSignalMethods()`, classes should now extend `Signals.EventEmitter` from the `misc.signals` module.

```javascript
const Signals = imports.misc.signals;

var MyClass = class extends Signals.EventEmitter {
    constructor() {
        super();
    }
}
```

--------------------------------

### metadata.json shell-version Configuration

Source: https://gjs.guide/extensions/upgrading/gnome-shell-45

Specifies the required update to the `shell-version` field in `metadata.json` for extensions using ESM, mandating `"45"` or higher due to compatibility with `import`/`export` syntax.

```json
{
  "shell-version": [
    "45"
  ],
  "uuid": "your-extension-uuid"
}
```

--------------------------------

### SearchProvider Class Definition

Source: https://gjs.guide/extensions/topics/search-provider

Defines the `SearchProvider` interface for GJS applications. It includes methods for managing search results, launching searches, and providing metadata. Implementations typically extend this class and override its methods to provide custom search behavior.

```javascript
class SearchProvider {
    constructor(extension) {
        this._extension = extension;
    }

    /**
     * The application of the provider.
     *
     * Applications will return a `Gio.AppInfo` representing themselves.
     * Extensions will usually return `null`.
     *
     * @type {Gio.AppInfo}
     */
    get appInfo() {
        return null;
    }

    /**
     * Whether the provider offers detailed results.
     *
     * Applications will return `true` if they have a way to display more
     * detailed or complete results. Extensions will usually return `false`.
     *
     * @type {boolean}
     */
    get canLaunchSearch() {
        return false;
    }

    /**
     * The unique ID of the provider.
     *
     * Applications will return their application ID. Extensions will usually
     * return their UUID.
     *
     * @type {string}
     */
    get id() {
        return this._extension.uuid;
    }

    /**
     * Launch the search result.
     *
     * This method is called when a search provider result is activated.
     *
     * @param {string} result - The result identifier
     * @param {string[]} terms - The search terms
     */
    activateResult(result, terms) {
        console.debug(`activateResult(${result}, [${terms}])`);
    }

    /**
     * Launch the search provider.
     *
     * This method is called when a search provider is activated. A provider can
     * only be activated if the `appInfo` property holds a valid `Gio.AppInfo`
     * and the `canLaunchSearch` property is `true`.
     *
     * Applications will typically open a window to display more detailed or
     * complete results.
     *
     * @param {string[]} terms - The search terms
     */
    launchSearch(terms) {
        console.debug(`launchSearch([${terms}])`);
    }

    /**
     * Create a result object.
     *
     * This method is called to create an actor to represent a search result.
     *
     * Implementations may return any `Clutter.Actor` to serve as the display
     * result, or `null` for the default implementation.
     *
     * @param {ResultMeta} meta - A result metadata object
     * @returns {Clutter.Actor|null} An actor for the result
     */
    createResultObject(meta) {
        console.debug(`createResultObject(${meta.id})`);

        return null;
    }

    /**
     * Get result metadata.
     *
     * This method is called to get a `ResultMeta` for each identifier.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} results - The result identifiers
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<ResultMeta[]>} A list of result metadata objects
     */
    getResultMetas(results, cancellable) {
        console.debug(`getResultMetas([${results}])`);

        const {scaleFactor} = St.ThemeContext.get_for_stage(global.stage);

        return new Promise((resolve, reject) => {
            const cancelledId = cancellable.connect(
                () => reject(Error('Operation Cancelled')));

            const resultMetas = [];

            for (const identifier of results) {
                const meta = {
                    id: identifier,
                    name: 'Result Name',
                    description: 'The result description',
                    clipboardText: 'Content for the clipboard',
                    createIcon: size => {
                        return new St.Icon({
                            icon_name: 'dialog-information',
                            width: size * scaleFactor,
                            height: size * scaleFactor,
                        });
                    },
                };

                resultMetas.push(meta);
            }

            cancellable.disconnect(cancelledId);
            if (!cancellable.is_cancelled())
                resolve(resultMetas);
        });
    }

    /**
     * Initiate a new search.
     *
     * This method is called to start a new search and should return a list of
     * unique identifiers for the results.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<string[]>} A list of result identifiers
     */
    getInitialResultSet(terms, cancellable) {
        console.debug(`getInitialResultSet([${terms}])`);

        return new Promise((resolve, reject) => {
            const cancelledId = cancellable.connect(
                () => reject(Error('Search Cancelled')));

            const identifiers = [
                'result-01',
                'result-02',
                'result-03'
            ];

            cancellable.disconnect(cancelledId);
            if (!cancellable.is_cancelled())
                resolve(identifiers);
        });
    }
}
```

--------------------------------

### GNOME Shell Extension Preferences UI

Source: https://gjs.guide/extensions/development/preferences

Defines the user interface for extension preferences using Adwaita widgets and GTK4. It implements the `fillPreferencesWindow` method to add pages, groups, and rows, binding them to GSettings keys.

```js
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ExamplePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension'),
        });
        page.add(group);

        // Create a new preferences row
        const row = new Adw.SwitchRow({
            title: _('Show Indicator'),
            subtitle: _('Whether to show the panel indicator'),
        });
        group.add(row);

        // Create a settings object and bind the row to the `show-indicator` key
        window._settings = this.getSettings();
        window._settings.bind('show-indicator', row, 'active',
            Gio.SettingsBindFlags.DEFAULT);
    }
}
```

--------------------------------

### Initialize Translations in extension.js

Source: https://gjs.guide/extensions/development/translations

Initializes translations for an extension using the `initTranslations()` method within the `Extension` subclass constructor. This ensures the extension can load translated strings correctly.

```javascript
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ExampleExtension extends Extension {
    constructor(metadata) {
        super(metadata);

        this.initTranslations('example@gjs.guide');
    }

    enable() {
        console.debug(_('Enabling %s').format(this.metadata.name));
    }

    disable() {
        console.debug(_('Disabling %s').format(this.metadata.name));
    }
}
```

--------------------------------

### Gtk.accelerator_parse() Signature Change (JS)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Illustrates the change in Gtk.accelerator_parse() in GTK4, which now returns three elements instead of two. The first element indicates whether the parsing was successful.

```js
let [ok, key, mods] = Gtk.accelerator_parse('<Control>a');
```

--------------------------------

### GJS D-Bus API: Owning and Unowning Names

Source: https://gjs.guide/guides/gio/dbus

Provides documentation for GJS D-Bus functions used to manage well-known names on a message bus. This includes acquiring a name, handling acquisition and loss events via callbacks, and releasing the owned name.

```APIDOC
Gio.bus_own_name(bus_type, name, flags, name_acquired_handler, name_lost_handler)
  - Acquires a well-known name on the specified D-Bus connection.
  - Parameters:
    - bus_type: Gio.BusType - The type of bus to connect to (e.g., Gio.BusType.SESSION, Gio.BusType.SYSTEM).
    - name: string - The well-known name to acquire (e.g., 'org.example.MyService').
    - flags: Gio.BusNameOwnerFlags - Flags controlling the name acquisition behavior.
    - name_acquired_handler: Function - Callback function invoked when the name is successfully acquired. Receives (connection, name).
    - name_lost_handler: Function - Callback function invoked when the name is lost or the connection is closed. Receives (connection, name).
  - Returns: number - A unique ID that can be used with Gio.bus_unown_name() to release the name.
  - Example:
    const ownerId = Gio.bus_own_name(Gio.BusType.SESSION, 'guide.gjs.Test', Gio.BusNameOwnerFlags.NONE, onNameAcquired, onNameLost);


GIO.bus_unown_name(owner_id)
  - Releases a previously acquired well-known name on the D-Bus.
  - Parameters:
    - owner_id: number - The unique ID returned by Gio.bus_own_name().
  - Note: The `name_lost_handler` is NOT invoked when manually unowning a name.
  - Example:
    Gio.bus_unown_name(ownerId);


Gio.BusType
  - Enum representing the type of D-Bus connection.
  - Members:
    - Gio.BusType.SESSION: Connect to the session bus.
    - Gio.BusType.SYSTEM: Connect to the system bus.


GIO.BusNameOwnerFlags
  - Enum for flags used with Gio.bus_own_name.
  - Members:
    - Gio.BusNameOwnerFlags.NONE: No special flags.
    - Gio.BusNameOwnerFlags.ALLOW_REPLACEMENT: Allow replacing an existing owner.
    - Gio.BusNameOwnerFlags.REPLACE_EXISTING: Replace an existing owner if the name is already taken.
    - Gio.BusNameOwnerFlags.DO_NOT_REPLACE_EXISTING: Do not replace an existing owner if the name is already taken.

```

--------------------------------

### Verify GJS Interface and Inheritance with instanceof

Source: https://gjs.guide/guides/gobject/interfaces

This snippet shows how to use the `instanceof` operator in GJS to verify that an object instance correctly implements specified interfaces and inherits from base classes. It checks for GObject.Object, Gio.ListStore, Gio.ListModel, SimpleInterface, and ComplexInterface.

```javascript
let complexInstance = new ComplexImplementation();

if (complexInstance instanceof GObject.Object &&
    complexInstance instanceof Gio.ListStore)
    console.log('An instance with chained inheritance');

if (complexInstance instanceof Gio.ListModel &&
    complexInstance instanceof SimpleInterface &&
    complexInstance instanceof ComplexInterface)
    console.log('An instance implementing three interfaces');
```

--------------------------------

### Access GNOME Shell Break and Time Limit Managers

Source: https://gjs.guide/extensions/upgrading/gnome-shell-48

GNOME Shell 48 introduces new managers for break reminders and screen time statistics. These can be accessed directly in `/ui/main.js/`.

```APIDOC
GNOME Shell Break and Time Limit Managers:

Description:
  GNOME Shell 48 includes new `/misc/breakManager.js` and `/misc/timeLimitsManager.js` files for break reminders and screen time statistics. The main instances are accessible in `/ui/main.js/`.

Accessible Managers:
  - `breakManager`: Type `/misc/breakManager.js/BreakManager`. Tracks active/inactive time and signals break times.
  - `breakManagerDispatcher`: Type `/misc/breakManager.js/BreakDispatcher`. Converts break status to notify a break event.
  - `timeLimitsManager`: Type `/misc/timeLimitsManager.js/TimeLimitsManager`. Tracks active/inactive time and signals daily time limit reached.
  - `timeLimitsDispatcher`: Type `/misc/timeLimitsManager.js/TimeLimitsDispatcher`. Converts time limit status to a notify event.
  - `ScreenTimeDBus`: Type `/ui/shellDBus.js/ScreenTimeDBus`. For the screen time D-Bus interface.
```

--------------------------------

### Create PopupSeparatorMenuItem in GJS

Source: https://gjs.guide/extensions/topics/popup-menu

Demonstrates creating a PopupSeparatorMenuItem, which is used to visually separate other menu items. An optional text label can be provided.

```javascript
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const menuItem = new PopupMenu.PopupSeparatorMenuItem('Optional Label');

// Setting the label
menuItem.label.text = 'New Label';
```

--------------------------------

### ExtensionUtils.getCurrentExtension()

Source: https://gjs.guide/extensions/topics/extension-utils

Retrieves the metadata object for the currently executing GNOME Shell extension. Returns null if called outside of an extension context.

```APIDOC
ExtensionUtils.getCurrentExtension():
  Type: Static
  Returns: (Object|null) An Extension Object or null.
  Description: Gets the Extension Metadata for the current extension, or null if not called from an extension.
```

--------------------------------

### Basic GLib.Variant Creation and Retrieval

Source: https://gjs.guide/guides/glib/gvariant

Demonstrates creating and retrieving values from simple GLib.Variant types like boolean, int64, string, and string arrays using GJS. Highlights potential limitations with 64-bit integers in older GJS versions.

```javascript
import GLib from 'gi://GLib';

// Simple types work pretty much like you expect
const variantBool = GLib.Variant.new_boolean(true);

if (variantBool.get_type_string() === 'b')
    print('Variant is a boolean!');

if (variantBool.get_boolean() === true)
    print('Value is true!');

// NOTE: As of GJS v1.68 all numeric types are still `Number` values, so some
// 64-bit values may not be fully supported. `BigInt` support to come.
const variantInt64 = GLib.Variant.new_int64(-42);

if (variantInt64.get_type_string() === 'x')
    print('Variant is an int64!');

if (variantInt64.get_int64() === -42)
    print('Value is -42!');

// NOTE: GLib.Variant.prototype.get_string() returns the value and the length
const variantString = GLib.Variant.new_string('a string');
const [strValue, strLength] = variantString.get_string();

if (variantString.get_type_string() === 's')
    print('Variant is a string!');

if (variantString.get_string()[0] === 'a string')
    print('Success!');

// List of strings are also straight forward
const stringList = ['one', 'two'];
const variantStrv = GLib.Variant.new_strv(stringList);

if (variantStrv.get_type_string() === 'as')
    print('Variant is an array of strings!');

if (variantStrv.get_strv().every(value => stringList.includes(value)))
    print('Success!');
```

--------------------------------

### Declare GNOME Shell Version Support (metadata.json)

Source: https://gjs.guide/extensions/development/targeting-older-gnome

Specifies the GNOME Shell versions an extension is compatible with. This field in `metadata.json` is crucial for extension managers to filter extensions based on the running shell version.

```json
{
    "shell-version": [ "3.36", "3.38", "40", "41", "42" ]
}
```

--------------------------------

### Open Read-Write File Stream in GJS

Source: https://gjs.guide/guides/gio/file-operations

Opens a file for both reading and writing using Gio.File.open_readwrite_async. Returns a Gio.FileIOStream which provides separate input and output streams.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-file.txt');

const ioStream = await file.open_readwrite_async(GLib.PRIORITY_DEFAULT,
    null);

const inputStream = ioStream.get_input_stream();
const outputStream = ioStream.get_output_stream();
```

--------------------------------

### Disconnect Signals (GNOME 45+)

Source: https://gjs.guide/extensions/review-guidelines/review-guidelines

Demonstrates how to disconnect signal handlers in the `disable()` method for GNOME 45 and later. This ensures that resources are properly cleaned up when the extension is disabled, preventing memory leaks or unexpected behavior. It uses `global.settings.connect` and `global.settings.disconnect`.

```js
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ExampleExtension extends Extension {
    enable() {
        this._handlerId = global.settings.connect('changed::favorite-apps', () => {
            console.log('app favorites changed');
        });
    }

    disable() {
        if (this._handlerId) {
            global.settings.disconnect(this._handlerId);
            this._handlerId = null;
        }
    }
}
```

--------------------------------

### Debugging GJS Processes

Source: https://gjs.guide/extensions/development/preferences

Provides a shell command to monitor logs from the GJS process, which is useful for debugging extension preferences that run in a separate process from GNOME Shell.

```sh
$ journalctl -f -o cat /usr/bin/gjs
```

--------------------------------

### Connect to D-Bus Signals (GJS)

Source: https://gjs.guide/guides/gio/dbus

Explains how to subscribe to D-Bus signals emitted by a remote object. Signals are connected using `connectSignal` and disconnected using `disconnectSignal` to avoid conflicts with GObject methods.

```js
const handlerId = proxy.connectSignal('TestSignal', (_proxy, nameOwner, args) => {
    console.log(`TestSignal: ${args[0]}, ${args[1]}`);

    proxy.disconnectSignal(handlerId);
});
```

--------------------------------

### GLib.Variant API: Packing and Complex Types

Source: https://gjs.guide/guides/glib/gvariant

Covers methods for constructing GLib.Variant objects using the `new` keyword with format strings, and details how to pack complex types like tuples, dictionaries with uniform values, and dictionaries with varying values.

```APIDOC
new GLib.Variant(type: string, value: any): GLib.Variant
  - Constructs a GLib.Variant by providing a GVariant format string and the corresponding value(s).
  - This is a flexible way to create variants, especially complex ones.
  - Parameters:
    - type: The GVariant format string (e.g., 'as', 'a{sv}', '(si)').
    - value: The value to pack, matching the type string. For complex types, this can be nested arrays or objects.
  - Returns: A new GLib.Variant instance.

GLib.Variant.new_strv(type: string, value: string[]): GLib.Variant
  - Specific constructor for string arrays, allowing explicit type specification.
  - Parameters:
    - type: The format string, typically 'as'.
    - value: An array of strings.
  - Returns: A new GLib.Variant instance.

GLib.Variant.prototype.equal(other: GLib.Variant): boolean
  - Compares this GLib.Variant with another for equality.
  - Parameters:
    - other: The GLib.Variant to compare against.
  - Returns: true if the variants are equal, false otherwise.

Packing Complex Types:
  - Tuples: Represented as JavaScript Arrays. Example type: '(si)' for a tuple of string and int.
    `new GLib.Variant('(si)', ['hello', 123])`
  - Dictionaries (Maps): Represented as JavaScript Objects.
    - Uniform values: `a{ss}` for string keys and string values.
      `new GLib.Variant('a{ss}', {'key1': 'value1', 'key2': 'value2'})`
    - Varying values: `a{sv}` for string keys and generic variant values.
      `new GLib.Variant('a{sv}', {'key1': GLib.Variant.new_string('string'), 'key2': GLib.Variant.new_boolean(true)})`
  - Arrays: Represented as JavaScript Arrays. Example type: 'ai' for an array of ints.
    `new GLib.Variant('ai', [1, 2, 3])`
```

--------------------------------

### Scan for Translatable Strings with xgettext

Source: https://gjs.guide/extensions/development/translations

Shell command to generate a Portable Object Template (POT) file from your GJS extension's source code. This file lists all strings marked for translation, enabling translators to create language-specific files.

```sh
cd ~/.local/share/gnome-shell/extensions/example@gjs.guide
xgettext --from-code=UTF-8 --output=po/example@gjs.guide.pot *.js
```

--------------------------------

### GNOME Shell Extension Base Class Structure (JavaScript)

Source: https://gjs.guide/extensions/overview/anatomy

The core `extension.js` file for GNOME Shell extensions using ESModules. It requires exporting a subclass of `Extension` and implementing `enable()` and `disable()` methods. The constructor must call `super()` with metadata. This structure is essential for extension lifecycle management.

```javascript
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ExampleExtension extends Extension {
    /**
     * This class is constructed once when your extension is loaded, not
     * enabled. This is a good time to setup translations or anything else you
     * only do once.
     *
     * You MUST NOT make any changes to GNOME Shell, connect any signals or add
     * any event sources here.
     *
     * @param {ExtensionMeta} metadata - An extension meta object
     */
    constructor(metadata) {
        super(metadata);

        console.debug(`constructing ${this.metadata.name}`);
    }

    /**
     * This function is called when your extension is enabled, which could be
     * done in GNOME Extensions, when you log in or when the screen is unlocked.
     *
     * This is when you should setup any UI for your extension, change existing
     * widgets, connect signals or modify GNOME Shell's behavior.
     */
    enable() {
        console.debug(`enabling ${this.metadata.name}`);
    }

    /**
     * This function is called when your extension is uninstalled, disabled in
     * GNOME Extensions or when the screen locks.
     *
     * Anything you created, modified or setup in enable() MUST be undone here.
     * Not doing so is the most common reason extensions are rejected in review!
     */
    disable() {
        console.debug(`disabling ${this.metadata.name}`);
    }
}
```

--------------------------------

### ResultMeta Type Definition

Source: https://gjs.guide/extensions/topics/search-provider

Defines the structure of the ResultMeta object, used by search providers to represent search results. It includes properties like id, name, description, clipboardText, and a createIcon function. The id is used for activating results, description for list view display, and clipboardText for copy operations.

```javascript
/**
 * @typedef ResultMeta
 * @type {object}
 * @property {string} id - the unique identifier of the result
 * @property {string} name - the name of the result
 * @property {string} [description] - optional description of the result
 * @property {string} [clipboardText] - optional clipboard content
 * @property {CreateIcon} createIcon - creates an icon for the result
 */
```

--------------------------------

### GNOME Shell 43 Screen Sharing Indicator

Source: https://gjs.guide/extensions/upgrading/gnome-shell-43

GNOME Shell 43 introduces a new screen sharing indicator in the panel. This documentation provides the direct access method for interacting with it.

```APIDOC
GNOME Shell 43 Screen Sharing Indicator:

Direct access to the screen sharing indicator:
  Main.panel.statusArea.screenSharing
```

--------------------------------

### GType Object Comparison

Source: https://gjs.guide/guides/gobject/gtype

Demonstrates how to compare the GType of an object instance's constructor with a class's static $gtype property and with a GType obtained using GObject.type_from_name(). This is useful for verifying type equivalency.

```javascript
const icon = new Gio.ThemedIcon({name: 'dialog-information'});

if (icon.constructor.$gtype === Gio.ThemedIcon.$gtype)
    console.log('These values are exactly equivalent');

if (icon.constructor.$gtype === GObject.type_from_name('GThemedIcon'))
    console.log('These values are exactly equivalent');
```

--------------------------------

### Open GNOME Extension Preferences

Source: https://gjs.guide/extensions/overview/anatomy

This shell command opens the preferences dialog for a specific GNOME extension. It requires the extension's unique ID as an argument.

```sh
$ gnome-extensions prefs example@gjs.guide
```

--------------------------------

### Resize GNOME Shell Prefs Window (JavaScript)

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Shows how to set the default dimensions for a GNOME Shell preferences window in GTK4. It uses `get_root()` to access the top-level window and `default_width`/`default_height` properties, as `resize()` is no longer available.

```js
prefsWidget.connect('realize', () => {
    let window = prefsWidget.get_root();
    window.default_width = 700;
    window.default_height = 900;
    // window.resize(700, 900);
});
```

--------------------------------

### GtkMenuButton Icon Configuration in GTK4 XML

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Illustrates the correct way to set an icon for a GtkMenuButton in GTK4 using XML. Previously, an embedded GtkImage was used, but now `icon-name` and `icon-size` properties should be set directly on the GtkMenuButton.

```xml
<object class="GtkMenuButton">
    <property name="visible">True</property>
    <property name="can-focus">True</property>
    <property name="focus-on-click">True</property>
    <property name="receives-default">True</property>
    <property name="popover">popwidget</property>
    <property name="icon-name">open-menu-symbolic</property>
    <property name="icon-size">1</property>
</object>
```

--------------------------------

### Monitor File System Events with Gio.FileMonitor in JavaScript

Source: https://gjs.guide/guides/gio/file-operations

This snippet demonstrates how to monitor a directory for file system changes using Gio.FileMonitor. It connects to signals to react to file creation, deletion, modification, and moves within the monitored directory. Ensure a reference to the Gio.FileMonitor object is maintained to prevent garbage collection.

```js
import Gio from 'gi://Gio';

const directory = Gio.File.new_for_path('.');

// Monitor for moves and other changes
const fileMonitor = directory.monitor(Gio.FileMonitorFlags.WATCH_MOVES, null);

fileMonitor.connect('changed', (_fileMonitor, file, otherFile, eventType) => {
    switch (eventType) {
    case Gio.FileMonitorEvent.CHANGED:
        console.log(`${otherFile.get_basename()} was changed`);
        break;

    case Gio.FileMonitorEvent.DELETED:
        console.log(`${otherFile.get_basename()} was deleted`);
        break;

    case Gio.FileMonitorEvent.CREATED:
        console.log(`${otherFile.get_basename()} was created`);
        break;

    case Gio.FileMonitorEvent.MOVED_IN:
        console.log(`${otherFile.get_basename()} was moved into the directory`);
        break;

    case Gio.FileMonitorEvent.MOVED_OUT:
        console.log(`${otherFile.get_basename()} was moved out of the directory`);
        break;
    }
});
```

--------------------------------

### GJS API Change: GtkNotificationDaemonAppSource

Source: https://gjs.guide/extensions/upgrading/gnome-shell-47

Highlights a new dbus parameter for the constructor of `ui/notificationDaemon.js/GtkNotificationDaemonAppSource` and the addition of an `emitActionInvoked()` method. This method allows emitting the `ActionInvoked` signal to dbus.

```APIDOC
Class:
  ui/notificationDaemon.js/GtkNotificationDaemonAppSource

Changes:
  - New dbus parameter added to the constructor.
  - New method `emitActionInvoked()` added.

Method Signature (emitActionInvoked):
  emitActionInvoked()

Description (emitActionInvoked):
  Emits the `ActionInvoked` signal to the dbus.
```

--------------------------------

### Call D-Bus Notify Method with GJS

Source: https://gjs.guide/guides/gio/dbus

Demonstrates sending a libnotify notification using GJS and D-Bus. It covers packing arguments, calling the 'Notify' method on 'org.freedesktop.Notifications', unpacking the reply, and handling D-Bus errors.

```js
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

try {
    /* 1. Packing the method arguments
     * 
     *    Note that calling methods directly in this way will require you to
     *    find documentation or introspect the interface. D-Spy can help here.
     */
    const notification = new GLib.Variant('(susssasa{sv}i)', [
        'GJS D-Bus Tutorial',
        0,
        'dialog-information-symbolic',
        'Example Title',
        'Example Body',
        [],
        {},
        -1,
    ]);

    /* 2. Calling the method
     * 
     *    To call a method directly, you will need to know the well-known name,
     *    object path and interface name. You will also need to know whether
     *    the service is on the session bus or the system bus.
     */
    const reply = await Gio.DBus.session.call(
        'org.freedesktop.Notifications',
        '/org/freedesktop/Notifications',
        'org.freedesktop.Notifications',
        'Notify',
        notification,
        null,
        Gio.DBusCallFlags.NONE,
        -1,
        null);

    /* 3. Unpacking the method reply
     * 
     *    The reply of a D-Bus method call is always a tuple. If the
     *    method has no return value the tuple will be empty, otherwise
     *    it will be a packed variant.
     */

    // Our method call has a reply, so we will extract it by getting the
    // first child of the tuple, which is the actual method return value.
    const value = reply.get_child_value(0);

    // The return type of this method is a 32-bit unsigned integer or `u`,
    // although the JavaScript type will be `Number`.
    const replaceId = value.get_uint32();

    // And log the reply
    console.log(`Notification ID: ${replaceId}`);
} catch (e) {
    /* 4. Handling D-Bus errors
     * 
     *    Errors returned by D-Bus may contain extra information we don't
     *    want to present to users. See the documentation for more
     *    information about `Gio.DBusError`.
     */
    if (e instanceof Gio.DBusError)
        Gio.DBusError.strip_remote_error(e);

    logError(e);
}

```

--------------------------------

### GJS API Change: PopupBaseMenuItem selection style

Source: https://gjs.guide/extensions/upgrading/gnome-shell-47

Informs about a change in how `PopupBaseMenuItem` handles selection styling. The `selected` style class is no longer used; instead, the `:selected` pseudo-class should be used for styling selected menu items.

```APIDOC
Class:
  PopupBaseMenuItem

Change:
  - The `selected` style class is no longer applied when a menu item is selected.
  - The `:selected` pseudo-class should now be used for styling selected items.

Impact:
  CSS rules targeting `.selected` for `PopupBaseMenuItem` need to be updated to use `:selected`.
```

--------------------------------

### Create Translation Directory

Source: https://gjs.guide/extensions/development/translations

Shell command to create the 'po/' subdirectory within the extension's directory, which is used to store translation source files like .po files.

```sh
mkdir -p ~/.local/share/gnome-shell/extensions/example@gjs.guide/po
```

--------------------------------

### Extension Object Properties

Source: https://gjs.guide/extensions/topics/extension-utils

Represents the metadata and state of a GNOME Shell extension. This object is retrieved using ExtensionUtils.getCurrentExtension().

```APIDOC
Extension Object:
  metadata (Object): The contents of the metadata.json file (read-only).
  uuid (String): The extension's unique identifier (read-only).
  type (ExtensionType): The type of extension installation (read-only).
  dir (Gio.File): The extension directory represented as a Gio.File object (read-only).
  path (String): The extension directory as a file path (read-only).
  error (String): An error message, or an empty string if no error occurred (read-only).
  hasPrefs (Boolean): Indicates if the extension has a preferences UI (read-only).
  hasUpdate (Boolean): Indicates if the extension has a pending update (read-only).
  canChange (Boolean): Indicates if the extension can be enabled or disabled (read-only).
  sessionModes (Array(String)): A list of supported session modes (read-only).
```

--------------------------------

### GtkEventControllerKey XML Definition

Source: https://gjs.guide/extensions/upgrading/gnome-shell-40

Defines a GtkEventControllerKey object within an XML interface file, specifying a handler for the 'key-pressed' signal. This object is intended to be added to a widget's controller list.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface domain="my-gettext-domain">

    <template class="PrefsWidget" parent="GtkBox">
        <property name="visible">True</property>
        <property name="can-focus">True</property>
        <property name="orientation">vertical</property>
        <child>
            <object class="GtkLabel" id="log_label">
                <property name="label">Key Log</property>
            </object>
        </child>
    </template>

    <object class="GtkEventControllerKey" id="event_key_controller">
        <signal name="key-pressed" handler="_onKeyPressed" swapped="no"/>
    </object>

</interface>
```

--------------------------------

### Configure package.json for GNOME Extension

Source: https://gjs.guide/extensions/development/typescript

Defines project metadata, dependencies, and settings for a GNOME Shell extension. Crucially sets 'type': 'module' for modern JavaScript features.

```json
{
  "name": "my-extension",
  "version": "0.0.0",
  "description": "A TypeScript GNOME Extension",
  "type": "module",
  "private": true,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/example/my-extension.git"
  },
  "author": "Álan Crístoffer e Sousa <acristoffers@startmail.com>",
  "license": "LGPL-3.0-or-later",
  "bugs": {
    "url": "https://github.com/example/my-extension/issues"
  },
  "homepage": "https://github.com/example/my-extension#readme",
  "sideEffects": false
}
```

--------------------------------

### GNOME Shell Extension Metadata Fields

Source: https://gjs.guide/extensions/overview/anatomy

Defines the structure and purpose of key fields in a GNOME Shell extension's metadata. This includes identifiers, versioning, compatibility, and configuration schemas.

```APIDOC
uuid: string
  Description: A globally-unique identifier for the extension, composed of two parts separated by '@'. Each part must contain only letters, numbers, period (.), underscore (_), and hyphen (-). The first part is a short identifier (e.g., "click-to-focus"), and the second is a namespace under the developer's control (e.g., "username.github.io"). Extensions cannot use "gnome.org" without permission.
  Example: "click-to-focus@username.github.io"

name: string
  Description: A short, descriptive name for the extension.
  Example: "Click To Focus"

description: string
  Description: A relatively short description of the extension's function. Supports line breaks and tabs using '\n' and '\t' escape sequences.

shell-version: array of strings
  Description: An array of strings specifying the GNOME Shell versions the extension supports. Must contain at least one entry. For versions up to 3.38, use major.minor (e.g., "3.38"). Starting with GNOME 40, use only the major version (e.g., "40", "41").
  Example: ["40", "41", "42"]

url: string
  Description: A URL for the extension, typically a git repository for code and issue reporting. Required for extensions submitted to extensions.gnome.org.
  Example: "https://github.com/username/extension-repo"

gettext-domain: string (Optional)
  Description: A Gettext translation domain, used for automatic translation initialization. Uniqueness is recommended, often derived from the UUID.
  Example: "example@gjs.guide"

settings-schema: string (Optional)
  Description: A Gio.SettingsSchema ID used by `Extension.getSettings()` and `ExtensionPreferences.getSettings()`. By convention, it starts with "org.gnome.shell.extensions." followed by the extension ID.
  Example: "org.gnome.shell.extensions.example"

session-modes: array of strings (Optional, added in GNOME 42)
  Description: An array of strings specifying the GNOME Shell session modes the extension supports. Common modes include "user" (default), "unlock-dialog" (lock screen), and "gdm" (login screen). Extensions for "gdm" are typically system extensions.
  Possible values: ["user", "unlock-dialog", "gdm"]
  Example: ["user", "unlock-dialog"]

version: number (Optional, managed by GNOME Extensions website)
  Description: The submission version of an extension, incremented by the GNOME Extensions website. Must be a whole number (e.g., 1). Developers should not set this field as it may be overridden.
  Example: 1

version-name: string (Optional, for display)
  Description: The version name visible to users, allowing for semantic versioning or other display formats.
  Example: "1.2.0"
```

--------------------------------

### Import GNOME Shell UI Components

Source: https://gjs.guide/extensions/overview/imports-and-modules

Illustrates importing specific UI components from GNOME Shell's internal JavaScript modules. These are accessed via `resource://` URIs, pointing to files within the GNOME Shell source tree, such as those in the `js/ui/` directory.

```javascript
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';
```

--------------------------------

### Define Extension Schema ID in metadata.json

Source: https://gjs.guide/extensions/development/preferences

Specifies the GSettings schema ID for an extension by defining the `settings-schema` key in the `metadata.json` file. This allows GNOME Shell to automatically associate the correct schema when `ExtensionsBase.prototype.getSettings()` is called.

```json
{
    "uuid": "example@gjs.guide",
    "name": "Example Extension",
    "description": "An example extension with preferences",
    "shell-version": [ "45" ],
    "url": "https://gjs.guide/extensions",
    "gettext-domain": "example@gjs.guide",
    "settings-schema": "org.gnome.shell.extensions.example"
}
```

--------------------------------

### GJS Looking Glass Console Usage

Source: https://gjs.guide/extensions/development/debugging

Demonstrates interactive JavaScript execution within the GNOME Shell Looking Glass console. Multiple expressions can be chained with semicolons, and results are stored in the 'r' variable.

```javascript
const sum = 2 + 2; const square = sum * sum; return `Sum: ${sum}, Square: ${square}`;
// Expected output: r(0) = Sum: 4, Square: 16
```

```javascript
Main.panel
// Expected output: r(1) = [0x55b300338460 Gjs_ui_panel_Panel:first-child last-child "panel"]
```

```javascript
2 + 2
// Expected output: r(0) = 4
```

```javascript
inspect(1028, 26)
// Expected output: r(2) = [0x55b3003a3d30 Gjs_ui_dateMenu_DateMenuButton.panel-button clock-display:first-child last-child "(Jun 8 17:43)"]
```

--------------------------------

### Save Data to File

Source: https://gjs.guide/guides/gtk/3/15-saving-data

Saves JSON data to a file, creating parent directories if they don't exist. It uses Gio.File for file operations and handles potential errors during the write process.

```javascript
const PERMISSIONS_MODE = 0o755; // Example permissions
let destinationFile = Gio.File.new_for_path(destination);

if (GLib.mkdir_with_parents(destinationFile.get_parent().get_path(), PERMISSIONS_MODE) === 0) {
    let [success, tag] = file.replace_contents(dataJSON, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);

    if(success) {
        /* it worked! */
    } else {
        /* it failed */
    }
} else {
     /* error creating directory */
}
```

--------------------------------

### PopupSubMenu Class API

Source: https://gjs.guide/extensions/topics/popup-menu

Details the constructor for the PopupSubMenu class, which is typically used indirectly via PopupSubMenuMenuItem. It defines the relationship between the submenu and its source actor and arrow.

```APIDOC
PopupSubMenu Class:

Parent Class: PopupMenu.PopupMenuBase

This menu should typically only be used indirectly, by creating a PopupSubMenuMenuItem.

Methods:

new PopupSubMenu(sourceActor, sourceArrow)
  - Constructor for the PopupSubMenu.
  - Parameters:
    - sourceActor (Clutter.Actor): The Clutter.Actor the menu points to.
    - sourceArrow (Clutter.Actor): The parent item's expander arrow.
```

--------------------------------

### Query File Information using Gio.File

Source: https://gjs.guide/guides/gio/file-operations

Retrieves detailed information about a file, including standard attributes like name and size, and custom attributes like UID. It uses `Gio.File.query_info_async` and handles `Gio.FileInfo` objects. The `NOFOLLOW_SYMLINKS` flag ensures information is for the link itself, not the target.

```javascript
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

const file = Gio.File.new_for_path('test-file.txt');

const fileInfo = await file.query_info_async('standard::*,unix::uid',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);

// Attributes in the `standard` namespace
const fileName = fileInfo.get_name();
const fileSize = fileInfo.get_size();

// Attributes in other namespaces
const unixMode = fileInfo.get_attribute_uint32('unix::uid');
```

--------------------------------

### Configure tsconfig.json for GNOME Extension

Source: https://gjs.guide/extensions/development/typescript

TypeScript compiler configuration file. Modifying it may break the build process by setting module resolution, output directory, and strictness.

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "sourceMap": false,
    "strict": true,
    "target": "ES2022",
    "lib": [
      "ES2022"
    ]
  },
  "include": [
    "ambient.d.ts"
  ],
  "files": [
    "extension.ts",
    "prefs.ts"
  ]
}
```

--------------------------------

### Signal Callback Return Values (Async/Promise)

Source: https://gjs.guide/guides/gobject/basics

Illustrates using an `async` function as a signal handler. It notes that `async` functions implicitly return Promises, which are coerced to truthy values. For explicit control, traditional Promise chains should be used to return the expected value type.

```js
linkLabel.connect('activate-link', (label, uri) => {
    // Do something asynchronous with the signal arguments
    Promise.resolve(uri).catch(logError);

    return true;
});
```

--------------------------------

### Debugging and Printing GLib.Variant

Source: https://gjs.guide/guides/glib/gvariant

Shows how to print the string representation of a GLib.Variant, including complex nested structures like dictionaries with string keys and variant values. Also demonstrates retrieving the type string.

```javascript
import GLib from 'gi://GLib';

const deepDict = new GLib.Variant('a{sv}', {
    'key1': GLib.Variant.new_string('string'),
    'key2': GLib.Variant.new_boolean(true),
});

// Expected output here is: "{'key1': <'string'>, 'key2': <true>}"
print(deepDict.print(true));

// Expected output here is: "a{sv}"
print(deepDict.get_type_string());
```

--------------------------------

### Connect to Gio.MenuModel items-changed signal

Source: https://gjs.guide/guides/gio/actions-and-menus

Demonstrates how to connect to the `items-changed` signal of a `Gio.MenuModel`. This signal efficiently tracks membership changes for items, sections, and submenus, similar to `Gio.ListModel`. The handler receives the position, number of removed items, and number of added items, requiring careful processing of removals before additions.

```js
import Gio from 'gi://Gio';

const menuModel = new Gio.Menu();

menuModel.connect('items-changed', (menu, position, removed, added) => {
    console.log(`position: ${position}, removed: ${removed}, added: ${added}`);

    /* Items are added and removed from the same position, so the removals
     * must be handled first.
     *
     * NOTE: remember that the items have already changed in the model when this
     *       signal is emitted, so you can not query removed items.
     */
    while (removed--)
        console.log('removed an item');

    /* Once the removals have been processed, the additions must be inserted
     * at the same position.
     */
    for (let i = 0; i < added; i++)
        console.log('added an item');
});
```

--------------------------------

### ExtensionBase Class

Source: https://gjs.guide/extensions/topics/extension

The base class for Extension and ExtensionPreferences classes in GJS. It should not be subclassed directly, and its constructor must be called when creating custom extension classes.

```APIDOC
ExtensionBase:
  Parent Class: Object (Source: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/extensions/sharedInternals.js)

  Description: The `ExtensionBase` class serves as the foundation for both the `Extension` and `ExtensionPreferences` classes. It is not intended for direct subclassing. When overriding the `constructor()` for `Extension` or `ExtensionPreferences`, ensure the `metadata` argument is passed to the parent class constructor.
```

--------------------------------

### GJS: Access Template Widgets

Source: https://gjs.guide/guides/gtk/3/14-templates

This snippet illustrates how to access widgets that have been registered using the `InternalChildren` property. These widgets are made available as properties on the class instance, prefixed with an underscore (e.g., `this._button`).

```javascript
this._button.do_something();
```

--------------------------------

### Access and Modify D-Bus Properties (GJS)

Source: https://gjs.guide/guides/gio/dbus

Shows how to interact with D-Bus properties using standard JavaScript property accessors. Read-only properties can be read, while read-write properties can be read and modified. Changes can be monitored via signals.

```js
console.log(`ReadOnlyProperty: ${proxy.ReadOnlyProperty}`);
console.log(`ReadWriteProperty: ${proxy.ReadWriteProperty}`);

proxy.ReadWriteProperty = true;
console.log(`ReadWriteProperty: ${proxy.ReadWriteProperty}`);

proxy.connect('g-properties-changed', (_proxy, _changed, _invalidated) => {
    // Handle property changes here
});
```

--------------------------------

### Custom Notification Policy in GJS

Source: https://gjs.guide/extensions/topics/notifications

This snippet demonstrates how to create a custom notification policy by subclassing `MessageTray.NotificationPolicy` in GJS. It shows how to override read-only property getters to define specific behaviors like enabling sounds, showing banners, or displaying notifications on the lock screen. The `store()` method is also included for custom logic when a source is added.

```javascript
const NotificationPolicy = GObject.registerClass(
class NotificationPolicy extends MessageTray.NotificationPolicy {
    /**
     * Whether notifications will be shown.
     *
     * @type {boolean}
     */
    get enable() {
        return true;
    }

    /**
     * Whether sound will be played.
     *
     * @type {boolean}
     */
    get enableSound() {
        return true;
    }

    /**
     * Whether the notification will popup outside of the tray.
     *
     * @type {boolean}
     */
    get showBanners() {
        return true;
    }

    /**
     * Whether the notification will always be expanded.
     *
     * @type {boolean}
     */
    get forceExpanded() {
        return false;
    }

    /**
     * Whether the notification will be shown on the lock screen.
     *
     * @type {boolean}
     */
    get showInLockScreen() {
        return false;
    }

    /**
     * Whether the notification content will be shown on the lock screen.
     *
     * @type {boolean}
     */
    get detailsInLockScreen() {
        return false;
    }

    /**
     * Called when the source is added to the message tray
     */
    store() {
    }
});
```
