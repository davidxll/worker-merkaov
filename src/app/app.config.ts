import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter }          from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG }         from 'primeng/config';
import { definePreset }           from '@primeng/themes';
import Aura                       from '@primeng/themes/aura';
import { routes }                 from './app.routes';

// Windows Blue accent applied as the PrimeNG primary palette
const FluentPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#EBF3FB',
      100: '#C3DCF5',
      200: '#90BFE8',
      300: '#60CDFF',
      400: '#4DB0E5',
      500: '#1697D5',
      600: '#0078D4',
      700: '#106EBE',
      800: '#005A9E',
      900: '#004578',
      950: '#003060',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: FluentPreset,
        options: { darkModeSelector: 'none' },
      },
    }),
  ],
};
