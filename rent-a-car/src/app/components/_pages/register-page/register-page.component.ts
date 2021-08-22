import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BaseClass } from "src/app/_abstract/base.class";
import { EInteractionReducer } from "src/app/_consts/consts";
import { AuthService } from "src/app/_services/auth.service";
import { Config } from "src/app/_services/config";
import { use } from "typescript-mix";

export interface RegisterPageComponent extends BaseClass {}
@Component({
	selector: 'app-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
	@use(BaseClass) this;
	hasRedirect: boolean;
	redirectUrl: string;

	constructor(public config: Config, public route: ActivatedRoute, public router: Router, public auth: AuthService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.config.currentInteraction.pipe(takeUntil(this.destroy)).subscribe((event) => {
			if (event.id == EInteractionReducer.loggedIn) {
				this.hasRedirect ? this.router.navigateByUrl(this.redirectUrl) : this.router.navigate(['/profile', this.auth.user?.pkUser]);
			}
		});
	}
}
