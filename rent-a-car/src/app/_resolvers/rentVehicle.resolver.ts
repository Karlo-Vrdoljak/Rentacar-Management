import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VehicleService } from '../_services/vehicle.service';

@Injectable({
	providedIn: 'root',
})
export class RentVehicleResolver implements Resolve<any> {
	constructor(public vehicleService: VehicleService) {}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const { pkVehicle } = route.params;
		console.log(route.params);

		return forkJoin([this.vehicleService.getOne({ pkVehicle })]).pipe(
			catchError((err, caught) => {
				return of([true]);
			})
		);
	}
}
