import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';
import { use } from 'typescript-mix';
import { BaseClass } from '../_abstract/base.class';
import { MessageService } from 'primeng/api';

export interface HttpErrorInterceptor extends BaseClass {}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	@use(BaseClass) this;

	constructor(private toast: MessageService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
					this.showToast({ toast: this.toast, severity: 'error', detail: error?.error.message, summary: 'Not good!' });
					// server-side error
				}

				return throwError(error);
			})
		);
	}
}
