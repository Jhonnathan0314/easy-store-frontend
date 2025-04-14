import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionService } from "../../services/utils/session/session.service";

export const apiToken: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if(req.url.includes("auth")) return next(req.clone());
    if(req.url.includes("forgot-password")) return next(req.clone());

    const sessionService = inject(SessionService);

    const token = sessionService.session()?.token ?? '';
    if(token === '') return next(req.clone());

    const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq);
}