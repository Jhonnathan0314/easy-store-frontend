import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SessionService } from "../../services/session/session.service";

@Injectable()
export class ApiToken implements HttpInterceptor {

    constructor(private sessionService: SessionService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.includes("auth")) return next.handle(req.clone());
        
        const token = this.sessionService.getToken();

        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });

        return next.handle(authReq);
    }

}
