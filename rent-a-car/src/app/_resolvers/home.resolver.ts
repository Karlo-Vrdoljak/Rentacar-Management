import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VehicleService } from '../_services/vehicle.service';

@Injectable({
	providedIn: 'root',
})
export class HomeResolver implements Resolve<any> {
	constructor(public vehicleService: VehicleService) {}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return forkJoin([this.vehicleService.getAllVehiclesAvailable()]).pipe(
			catchError((err, caught) => {
				return of([true]);
			})
		);
	}
}
