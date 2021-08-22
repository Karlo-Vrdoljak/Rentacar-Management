import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { EInteractionReducer } from 'src/app/_consts/consts';
import { AuthService } from 'src/app/_services/auth.service';
import { use } from 'typescript-mix';
import { Config } from './../../../_services/config';

export interface LoginPageComponent extends BaseClass {}
@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
	@use(BaseClass) this;
	hasRedirect: boolean;
	redirectUrl: string;

	constructor(public config: Config, public route: ActivatedRoute, public router: Router, public auth: AuthService) {
		this.destroy = new Subject();

		this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe((qs) => {
			const { redirect } = qs;
			this.hasRedirect = !!redirect;
			this.redirectUrl = redirect;
		});

		// router.events.pipe(takeUntil(this.destroy)).subscribe((event) => {
		// 	if (event instanceof NavigationEnd) {
		// 	}
		// });
		// const state = this.router
		// console.log({ state }, this.router?.getCurrentNavigation()?.extras);
		// NavigationEnd
		// NavigationCancel
		// NavigationError
		// RoutesRecognized
	}

	ngOnInit(): void {
		this.config.currentInteraction.pipe(takeUntil(this.destroy)).subscribe((event) => {
			if (event.id == EInteractionReducer.loggedIn) {
				this.hasRedirect ? this.router.navigateByUrl(this.redirectUrl) : this.router.navigate(['/profile', this.auth.user?.pkUser]);
			}
		});
	}
}
