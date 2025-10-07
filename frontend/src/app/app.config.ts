import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Init } from '../core/services/init';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { authInterceptor } from '../core/interceptors/auth-interceptor';
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([loadingInterceptor,authInterceptor,errorInterceptor ])
    ),
    provideAppInitializer(async () => {
      const initService = inject(Init);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            return lastValueFrom(initService.init());
          } finally {
            const splash = document.getElementById('initial-splash');
            if (splash) {
              splash.remove();
            }
            resolve();
          }
        });
      });
    }),
  ],
};
