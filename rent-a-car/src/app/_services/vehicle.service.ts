import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from './config';

const SLUG = 'vehicle';

@Injectable({
	providedIn: 'root',
})
export class VehicleService {
	constructor(public httpClient: HttpClient, public config: Config) {
		console.log(config.value.API_URL);
	}

	getAllVehiclesAvailable() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/public/available');
	}
	getOne({ pkVehicle }) {
		const req = {
			pkVehicle,
		};
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/public/one', { params: req });
	}
}
