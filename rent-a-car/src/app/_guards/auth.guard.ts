import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { VehicleService } from '../_services/vehicle.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(public router: Router, public auth: AuthService, public vehicleService: VehicleService, public userService: UserService) {}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

		let pk = null as number | null;
		if (!pk) pk = route.params?.pkUser;
		if (!pk) pk = route.queryParams?.pkUser;

		const roles = route.data.roles as string[];
		const result = roles.every((role) => this.auth.hasClaim(role, pk));
		if (result) return true;
		this.router.parseUrl('/home');
		return false;
	}
}
