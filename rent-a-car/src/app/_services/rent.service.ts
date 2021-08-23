import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RENT_STATUS, VEHICLE_STATUS } from '../_consts/consts';
import { AuthService } from './auth.service';
import { Config } from './config';

const SLUG = 'rent';
interface MakeRent {
	pkRent?: any;
	pkVehicle: number;
	pkUserRented?: any;
	pkRentStatus?: RENT_STATUS;
	rentFrom: string;
	rentTo: string;
	pickupLocation: string;
	dropOffLocation?: any;
	pkVehicleStatus?: VEHICLE_STATUS;
}

@Injectable({
	providedIn: 'root',
})
export class RentService {
	constructor(public httpClient: HttpClient, public config: Config, public auth: AuthService) {}

	makeRent({ pkVehicleStatus = VEHICLE_STATUS.Rented, pkRent = null, pkVehicle, pkUserRented = this.auth.user?.pkUser ?? null, pkRentStatus = RENT_STATUS.Queued, rentFrom, rentTo, pickupLocation, dropOffLocation }: MakeRent) {
		const req = {
			...(pkRent && { pkRent }),
			...(pkVehicle && { pkVehicle }),
			...(pkVehicleStatus && { pkVehicleStatus }),
			...(pkUserRented && { pkUserRented }),
			...(pkRentStatus && { pkRentStatus }),
			...(rentFrom && { rentFrom }),
			...(rentTo && { rentTo }),
			...(pickupLocation && { pickupLocation }),
			...(dropOffLocation && { dropOffLocation }),
		};
		return this.httpClient.post(this.config.value.API_URL + SLUG + '/public/upsert', req);
	}
	getStats() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/stats');
	}
	getAll() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/all');
	}
}
