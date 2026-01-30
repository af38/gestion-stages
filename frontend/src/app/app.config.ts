import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { spinnerInterceptorInterceptor } from '../services/spinner-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
        HttpClientXsrfModule.withOptions({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    provideRouter(routes), provideClientHydration(), provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([spinnerInterceptorInterceptor])
    )]
};


