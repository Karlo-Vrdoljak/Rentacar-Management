import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Vehicle } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';
import { Rent } from './../../../../../_consts/consts';

export interface RentCompleteUpdateKmComponent extends BaseClass {}

@Component({
	selector: 'app-rent-complete-update-km',
	templateUrl: './rent-complete-update-km.component.html',
	styleUrls: ['./rent-complete-update-km.component.scss'],
})
export class RentCompleteUpdateKmComponent implements OnInit {
	@use(BaseClass) this;
	form = new FormGroup({
		currentKilometers: new FormControl(null, [Validators.required]),
	});
	vehicle: Vehicle;

	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { rent }: { rent: Rent } = this.dialogCfg?.data ?? {};
		if (rent.vehicle) {
			this.form.patchValue({
				currentKilometers: rent.vehicle.currentKilometers,
			});
		}
		this.vehicle = rent.vehicle ?? null;
	}
	save() {
		if (this.vehicle) {
			this.ref.close({ kilometers: { ...this.form.value } });
		}
	}
}
