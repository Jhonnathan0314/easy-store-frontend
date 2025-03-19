import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { apiToken } from "@interceptor/api-token/api-token.interceptor";

import { routes } from "./app.routes";
import { providePrimeNG } from "primeng/config";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes),
        provideHttpClient(withFetch(), withInterceptors([apiToken])),
        provideClientHydration(),
        provideAnimationsAsync(),
        providePrimeNG(
            { 
                theme: {
                    options: {
                      cssLayer: {
                        name: 'primeng',
                        order: 'tailwind-base, primeng, tailwind-utilities'
                      }
                    }
                },
                ripple: true,
                csp: {
                    nonce: '...'
                }
            }
        )
    ]
}