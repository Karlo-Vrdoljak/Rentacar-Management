import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from './config';

const SLUG = 'user';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(public httpClient: HttpClient, public config: Config) {
		console.log(config.value.API_URL);
	}

	getAll() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/public/available');
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
}
