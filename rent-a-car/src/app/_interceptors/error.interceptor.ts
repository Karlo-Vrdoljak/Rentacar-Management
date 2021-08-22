import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { concat, Observable, of, throwError } from 'rxjs';
import { catchError, first, flatMap, map, retry, switchMap, tap, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';
import { Config } from 'src/app/_services/config';
import { use } from 'typescript-mix';
import { BaseClass } from '../_abstract/base.class';
import { EInteractionReducer, ELocalStorage } from '../_consts/consts';

export interface HttpErrorInterceptor extends BaseClass {}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	@use(BaseClass) this;

	constructor(public config: Config, public auth: AuthService, public route: ActivatedRoute, public router: Router, private toast: MessageService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next.handle(request).pipe(
			retry(1),
			catchError((error: HttpErrorResponse) => {
				console.log(error);
				let errorMessage = '';

				if (error.error instanceof ErrorEvent) {
					console.error('client-side error');
					// client-side error
					errorMessage = `Error: ${error.error.message}`;
				} else {
					console.error('server-side error');
					// server-side error
				}
				return this.handleError(error);
			}),
			map((value) => {
				if (value?.status == 299) {
					const jwt = value.body.jwt;
					if (localStorage.getItem(ELocalStorage.JWT)) {
						this.auth.saveLocal(jwt);
					}
					window.location.reload();
				}
				return value;
			})
		);
	}
	handleError({ error }): Observable<any> {
		console.log(error, { redirect: this.router.routerState.snapshot.url });

		if (error?.status) {
			switch (error?.status) {
				case 401:
					this.auth.logoff(false);
					this.router.navigate(['/login'], { replaceUrl: true, queryParams: { redirect: this.router.routerState.snapshot.url } });
					return of(true);
				default:
					this.showToast({ toast: this.toast, severity: 'error', detail: error?.error.message, summary: 'Not good!' });
					return throwError(error);
			}
		}
		return throwError(error);
	}
}
