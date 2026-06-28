import { ClockWidget, CSS as ClockWidgetCSS } from './ClockWidget.js';
import { NowPlayingWidget, CSS as NowPlayingCSS } from './NowPlayingWidget.js';
import { QuickTogglesWidget, CSS as QuickTogglesCSS } from './QuickTogglesWidget.js';
import { VolumeWidget, CSS as VolumeWidgetCSS } from './VolumeWidget.js';
import { MicWidget, CSS as MicWidgetCSS } from './MicWidget.js';
import { BrightnessWidget, CSS as BrightnessWidgetCSS } from './BrightnessWidget.js';
import { PowerWidget, CSS as PowerWidgetCSS } from './PowerWidget.js';
import { BatteryHealthWidget, CSS as BatteryHealthCSS } from './BatteryHealthWidget.js';
import { CalendarWidget, CSS as CalendarWidgetCSS } from './CalendarWidget.js';
import { HabitTrackerWidget, CSS as HabitTrackerCSS } from './HabitTrackerWidget.js';
import { IPWidget, CSS as IPWidgetCSS } from './IPWidget.js';

// Render order. A widget may expose `static get section()` to start a labelled
// group before it (see WidgetsPage). Glass layout:
// clock → now playing → quick toggles → audio & display → power → calendar → habits → network.
export const WIDGETS = [
    ClockWidget,
    NowPlayingWidget,
    QuickTogglesWidget,
    VolumeWidget,
    MicWidget,
    BrightnessWidget,
    PowerWidget,
    BatteryHealthWidget,
    CalendarWidget,
    HabitTrackerWidget,
    IPWidget,
];

export const WIDGET_CSS = [
    ClockWidgetCSS,
    NowPlayingCSS,
    QuickTogglesCSS,
    VolumeWidgetCSS,
    MicWidgetCSS,
    BrightnessWidgetCSS,
    PowerWidgetCSS,
    BatteryHealthCSS,
    CalendarWidgetCSS,
    HabitTrackerCSS,
    IPWidgetCSS,
].join('\n');
