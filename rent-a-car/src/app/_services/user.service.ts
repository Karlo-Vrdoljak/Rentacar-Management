import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_consts/consts';
import { Config } from './config';

const SLUG = 'user';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(public httpClient: HttpClient, public config: Config) {}

	getAll() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/all');
	}
	getOne({ pkUser }) {
		const req = {
			pkUser,
		};
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/one', { params: req });
	}
	getStats({ pkUser }) {
		const req = {
			pkUser,
		};
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/stats', { params: req });
	}
	updateOne(user: User): Observable<any> {
		const req = {
			...user,
		};
		return this.httpClient.put(this.config.value.API_URL + SLUG + '/update', req);
	}
	deleteOne({ pkUser }) {
		const req = {
			pkUser,
		};
		return this.httpClient.delete(this.config.value.API_URL + SLUG + '/one', { params: req });
	}
	register({ email, password }) {
		const req = {
			email,
			password,
		};
		return this.httpClient.post(this.config.value.API_URL + SLUG + '/register', req);
	}
	updateClaims({ claims, pkUser }) {
		const req = {
			claims,
			pkUser,
		};
		return this.httpClient.put(this.config.value.API_URL + SLUG + '/claims', req);
	}
}
