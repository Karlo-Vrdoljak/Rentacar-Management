import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { EInteractionReducer, User } from 'src/app/_consts/consts';
import { AuthService } from 'src/app/_services/auth.service';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { use } from 'typescript-mix';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

export interface RegisterComponent extends BaseClass {}

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	providers: [DialogService],
})
export class RegisterComponent implements OnInit {
	@use(BaseClass) this;
	registerForm = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
		passwordConfirm: new FormControl(null, [
			Validators.required,
			Validators.minLength(4),
			(control) => {
				return this.registerForm?.controls?.password?.value != control.value
					? {
							passMatch: true,
					  }
					: null;
			},
		]),
	});

	constructor(public userService: UserService, public dialogService: DialogService, public config: Config, public loader: LoaderService, public auth: AuthService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {}

	register() {
		console.log(this.registerForm.value);
		const { email, password } = this.registerForm.value;
		this.userService.register({ email, password }).subscribe((user) => {
			this.auth.signIn({ email, password }).subscribe(
				({ jwt }) => {
					this.auth.saveLocal(jwt);
					this.auth.user = this.auth.parseJwt(jwt);
					this.auth.jwt = jwt;
					this.config.nextInteraction({ id: EInteractionReducer.loggedIn, args: this.auth.user });
					this.loader.stop(`Welcome ${this.auth.user?.name ?? ''} ${this.auth.user?.lastName ?? ''}!`);
					this.afterRegister();
				},
				(err) => {
					this.loader.stop();
				}
			);
		});
	}
	afterRegister() {
		const ref = this.dialogService.open(EditProfileComponent, {
			header: 'Edit your profile details',
			closable: false,
			data: this.auth.user,
		});
		ref.onClose.pipe(takeUntil(this.destroy)).subscribe(({ user }) => {
			console.log(user);
			this.loader.start();
			this.userService
				.updateOne({ ...this.auth.user, ...user })
				.pipe(takeUntil(this.destroy))
				.subscribe((user: User) => {
					this.loader.stop('Changes saved!');
					this.auth.user = user;
					this.config.nextInteraction({ id: EInteractionReducer.loggedIn, args: this.auth.user });
					
				});

			// this.persistRent();
		});
	}
}
