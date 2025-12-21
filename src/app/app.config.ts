import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { credentialsInterceptor } from './core/auth/interceptors/credentials.interceptor';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),
    provideAnimations(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    {provide: LOCALE_ID, useValue: 'es-ES' },
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideNativeDateAdapter()
  ],
};
