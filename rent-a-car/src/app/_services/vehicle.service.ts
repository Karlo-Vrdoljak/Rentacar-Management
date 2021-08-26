import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from './config';
import { Vehicle } from './../_consts/consts';
import { Observable } from 'rxjs';

const SLUG = 'vehicle';

@Injectable({
	providedIn: 'root',
})
export class VehicleService {
	constructor(public httpClient: HttpClient, public config: Config) {}

	getAllVehiclesAvailable() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/public/available');
	}
	getOne({ pkVehicle }) {
		const req = {
			pkVehicle,
		};
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/public/one', { params: req });
	}
	getAllVehiclesForUser({ pkUser }) {
		const req = {
			pkUser,
		};
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/user/vehicles', { params: req });
	}
	getAll() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/all');
	}
	deleteOne({ pkVehicle }) {
		const req = {
			pkVehicle,
		};
		return this.httpClient.delete(this.config.value.API_URL + SLUG + '/one', { params: req });
	}
	createOne({ vehicle }: { vehicle: Vehicle }): Observable<any> {
		const req = {
			...vehicle,
		};
		return this.httpClient.post(this.config.value.API_URL + SLUG + '/upsert', req);
	}
	changeStatus({ pkVehicle, vehicleStatus }) {
		const req = {
			pkVehicle,
			pkVehicleStatus: vehicleStatus,
		};
		return this.httpClient.put(this.config.value.API_URL + SLUG + '/update/status', req);
	}
	getByRent({ pkRent }): Observable<any> {
		const req = {
			pkRent,
		};
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/vehicles/rent', { params: req });
	}
}
