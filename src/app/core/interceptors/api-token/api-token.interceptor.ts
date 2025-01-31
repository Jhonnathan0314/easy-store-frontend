import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionService } from "../../services/session/session.service";

export const apiToken: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if(req.url.includes("auth")) return next(req.clone());

    const sessionService = inject(SessionService);

    const token = sessionService.getToken();

    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq);
}