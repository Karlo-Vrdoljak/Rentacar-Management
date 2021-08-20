import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from './../../../_services/auth.service';
import { Config } from 'src/app/_services/config';
import { DialogService } from 'primeng/dynamicdialog';
import { LoginDialogComponent } from '../../user/login-dialog/login-dialog.component';
import { BaseClass } from 'src/app/_abstract/base.class';
import { use } from 'typescript-mix';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EInteractionReducer } from 'src/app/_consts/consts';

export interface NavComponent extends BaseClass {}
@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	providers: [DialogService],
})
export class NavComponent implements OnInit {
	@use(BaseClass) this;
	items: MenuItem[];
	constructor(public auth: AuthService, public config: Config, public dialogService: DialogService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.items = this.makeMenuItems();
		console.log(this.items);

		this.config.currentInteraction.subscribe(({ id }) => {
			if (id == EInteractionReducer.loggedIn || id == EInteractionReducer.logoff) {
				this.items = this.makeMenuItems();
			}
		});
	}

	makeMenuItems() {
		return [
			{
				label: 'Home',
				icon: 'pi pi-fw pi-home',
				routerLink: ['/home'],
			},
			this.auth.user
				? {
						label: 'My Profile',
						icon: 'pi pi-fw pi-user',
						routerLink: ['/profile', this.auth.user?.pkUser],
				  }
				: null,
		].filter((i) => !!i) as MenuItem[];
	}

	handleSignOut() {
		this.auth.logoff();
	}
	handleLogin() {
		const ref = this.dialogService.open(LoginDialogComponent, {
			header: '',
			closable: true,
			data: null,
		});
		ref.onClose.pipe(takeUntil(this.destroy)).subscribe(({ user }) => {
			console.log(user);
		});
	}
}
