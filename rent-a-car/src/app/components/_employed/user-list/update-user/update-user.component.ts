import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/_abstract/base.class';
import { RENT_STATUS, Rent, User } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';

@Component({
	selector: 'app-update-user',
	templateUrl: './update-user.component.html',
	styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
	@use(BaseClass) this;
	claims: string = 'user';
	form = new FormGroup({
		claimLevel: new FormControl(1, [Validators.required]),
	});
	claimsMap = {
		1: 'user',
		2: 'user,employed',
		3: 'user,employed,admin',
		user: 1,
		'user,employed': 2,
		'user,employed,admin': 3,
	};
	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { user }: { user: User } = this.dialogCfg?.data ?? {};
		this.claims = user.claims;
		this.form.patchValue({
			claimLevel: this.claimsMap[user.claims],
		});
	}

	save() {
		this.ref.close({ claims: this.claimsMap[this.form.value.claimLevel] });
	}
}
