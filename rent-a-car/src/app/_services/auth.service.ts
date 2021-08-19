import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from 'src/app/_services/config';
import { Observable } from 'rxjs';
import { ELocalStorage } from '../_consts/consts';
import { User } from './../_consts/consts';

const USER = 'user';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	user: User | null;
	constructor(public httpClient: HttpClient, public config: Config) {
		this.user = this.fetchLocal();
	}

	signIn({ email, password }): Observable<any> {
		const req = {
			email,
			password,
		};
		return this.httpClient.post(this.config.value.API_URL + USER + '/login', req);
	}
	saveLocal(jwt: string) {
		localStorage.setItem(ELocalStorage.JWT, jwt);
	}
	fetchLocal() {
		const jwt = localStorage.getItem(ELocalStorage.JWT);
		if (jwt) {
			const user = this.parseJwt(jwt);
			return user;
		}
		return null;
	}
	parseJwt(token): User {
		if (!token) return {} as User;
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}
	clearAuth() {
		localStorage.removeItem(ELocalStorage.JWT);
	}
	logoff(reload = true) {
		this.clearAuth();
		this.user = null;
		reload && window.location.reload();
	}
}
