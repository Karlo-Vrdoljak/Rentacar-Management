import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VehicleService } from '../_services/vehicle.service';
import { RentService } from './../_services/rent.service';

@Injectable({
	providedIn: 'root',
})
export class DashboardResolver implements Resolve<any> {
	constructor(public rent: RentService, public vehicleService: VehicleService) {}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return forkJoin([this.rent.getStats(), this.rent.getAll()]).pipe(
			catchError((err, caught) => {
				return of([true]);
			})
		);
	}
}
