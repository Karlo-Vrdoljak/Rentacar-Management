import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../_services/user.service';
import { VehicleService } from '../_services/vehicle.service';

@Injectable({
	providedIn: 'root',
})
export class ProfileResolver implements Resolve<any> {
	constructor(public vehicleService: VehicleService, public userService: UserService) {}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const { pkUser } = route.params;
		return forkJoin([this.userService.getOne({ pkUser }), this.vehicleService.getAllVehiclesForUser({ pkUser }), this.userService.getStats({ pkUser })]).pipe(
			catchError((err, caught) => {
				return of([true]);
			})
		);
	}
}
