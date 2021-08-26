import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VehicleService } from '../_services/vehicle.service';
import { RentService } from './../_services/rent.service';
import { UserService } from 'src/app/_services/user.service';
import { ReceiptService } from './../_services/receipt.service';

@Injectable({
	providedIn: 'root',
})
export class DashboardResolver implements Resolve<any> {
	constructor(public receiptService: ReceiptService, public userService: UserService, public rent: RentService, public vehicleService: VehicleService) {}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return forkJoin([this.rent.getStats(), this.rent.getAll(), this.vehicleService.getAll(), this.receiptService.getAll(), this.userService.getAll()]).pipe(
			catchError((err, caught) => {
				return of([true]);
			})
		);
	}
}
