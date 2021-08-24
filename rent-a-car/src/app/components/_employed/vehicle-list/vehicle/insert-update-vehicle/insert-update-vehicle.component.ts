import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';
import { Vehicle } from './../../../../../_consts/consts';
import { Subject } from 'rxjs';

export interface InsertUpdateVehicleComponent extends BaseClass {}

@Component({
	selector: 'app-insert-update-vehicle',
	templateUrl: './insert-update-vehicle.component.html',
	styleUrls: ['./insert-update-vehicle.component.scss'],
})
export class InsertUpdateVehicleComponent implements OnInit {
	@use(BaseClass) this;
	form = new FormGroup({
		color: new FormControl(null, [Validators.required]),
		currentKilometers: new FormControl(null, [Validators.required]),
		dateOfManufacture: new FormControl(null, [Validators.required]),
		gasType: new FormControl(null, [Validators.required]),
		manufacturer: new FormControl(null, [Validators.required]),
		model: new FormControl(null, [Validators.required]),
		startingKilometers: new FormControl(null, [Validators.required]),
		multiInsert: new FormControl(1, []),
	});
	vehicle: Vehicle;

	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { vehicle }: { vehicle: Vehicle } = this.dialogCfg?.data ?? {};
		if (vehicle) {
			this.form.patchValue({
				...{ ...vehicle, dateOfManufacture: new Date(vehicle.dateOfManufacture) },
			});
		} else {
			this.form.controls.currentKilometers.disable();
			this.form.controls.startingKilometers.valueChanges.pipe(takeUntil(this.destroy)).subscribe((change) => this.form.controls.currentKilometers.patchValue(change));
		}
		this.vehicle = vehicle ?? null;
	}
	save() {
		if (this.vehicle) {
			this.ref.close({ vehicle: { ...this.form.value } });
		} else {
			this.ref.close({ vehicle: { ...this.form.value, currentKilometers: this.form.controls.currentKilometers.value } });
		}
	}
}
