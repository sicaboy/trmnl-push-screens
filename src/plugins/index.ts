import CalendarPlugin from './calendar/CalendarPlugin';

export const plugins = {
  calendar: CalendarPlugin,
};

export type PluginKey = keyof typeof plugins;