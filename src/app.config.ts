import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from "@angular/router";
import { apiToken } from "@interceptor/api-token/api-token.interceptor";
import { routes } from "./app/app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([apiToken])),
        provideAnimations()
    ]
}