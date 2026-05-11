import { ClockWidget, CSS as ClockWidgetCSS } from './ClockWidget.js';
import { CalendarWidget, CSS as CalendarWidgetCSS } from './CalendarWidget.js';
import { VolumeWidget, CSS as VolumeWidgetCSS } from './VolumeWidget.js';
import { MicWidget, CSS as MicWidgetCSS } from './MicWidget.js';
import { BrightnessWidget, CSS as BrightnessWidgetCSS } from './BrightnessWidget.js';

export const WIDGETS = [ClockWidget, CalendarWidget, VolumeWidget, MicWidget, BrightnessWidget];

export const WIDGET_CSS = [ClockWidgetCSS, CalendarWidgetCSS, VolumeWidgetCSS, MicWidgetCSS, BrightnessWidgetCSS].join('\n');