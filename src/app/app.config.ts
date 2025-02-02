import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { apiToken } from "@interceptor/api-token/api-token.interceptor";

import { routes } from "./app.routes";
import { providePrimeNG } from "primeng/config";
import { LaraGreenPreset } from "@theme/lara-green";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withFetch(), withInterceptors([apiToken])),
        provideAnimationsAsync(),
        provideClientHydration(),
        providePrimeNG()
    ]
}