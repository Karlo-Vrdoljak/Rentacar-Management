import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { DialogRef, EInteractionReducer } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { use } from 'typescript-mix';
import { AuthService } from './../../../_services/auth.service';
import { Config } from 'src/app/_services/config';

export interface LoginComponent extends BaseClass {}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@use(BaseClass) this;

	@Input() dialogRef: DialogRef;
	login = new FormGroup({
		email: new FormControl(null, [Validators.required]),
		password: new FormControl(null, [Validators.required]),
		rememberMe: new FormControl(false, []),
	});

	constructor(public config: Config, public loader: LoaderService, public auth: AuthService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		console.log(this.dialogRef);
	}
	handleRegisterClick() {
		this.dialogRef?.ref.close();
	}
	signIn() {
		this.loader.start();
		this.auth
			.signIn({ ...this.login.value })
			.pipe(takeUntil(this.destroy))
			.subscribe(
				({ jwt }) => {
					const { rememberMe } = this.login.value;
					if (rememberMe) {
						this.auth.saveLocal(jwt);
					}
					this.auth.user = this.auth.parseJwt(jwt);
					this.config.nextInteraction({ id: EInteractionReducer.loggedIn, args: this.auth.user });
					this.loader.stop(`Welcome back ${this.auth.user?.name} ${this.auth.user?.lastName}!`);

					this.dialogRef?.ref.close({ user: this.auth.user });
				},
				(err) => {
					this.loader.stop();
				}
			);
	}
}
