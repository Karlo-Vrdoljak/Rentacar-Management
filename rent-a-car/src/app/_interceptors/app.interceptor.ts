import { Injectable } from '@angular/core'; //TRIBA OTKOMENTIRAT
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ELocalStorage } from '../_consts/consts';
import { Config } from './../_services/config';
import { AuthService } from 'src/app/_services/auth.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
	constructor(public auth: AuthService, public config: Config) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let token = undefined as any;
		if (localStorage.getItem(ELocalStorage.JWT)) {
			token = localStorage.getItem(ELocalStorage.JWT);
		} else if (this.auth.jwt) {
			token = this.auth.jwt;
		}
		if (token) {
			req = req.clone({
				setHeaders: { Authorization: `Bearer ${token}` },
			});
		}
		// else {
		// 	req = req.clone({
		// 		setHeaders: {},
		// 	});
		// }
		return next.handle(req);
	}
}
