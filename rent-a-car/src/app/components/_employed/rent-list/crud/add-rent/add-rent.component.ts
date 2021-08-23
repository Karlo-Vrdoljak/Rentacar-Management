import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { use } from 'typescript-mix';
import { BaseClass } from 'src/app/_abstract/base.class';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { UserService } from './../../../../../_services/user.service';
import { first } from 'rxjs/operators';
import { Rent, Vehicle } from './../../../../../_consts/consts';
import { User } from 'src/app/_consts/consts';
import { Config } from './../../../../../_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

export interface AddRentComponent extends BaseClass {}

@Component({
	selector: 'app-add-rent',
	templateUrl: './add-rent.component.html',
	styleUrls: ['./add-rent.component.scss'],
})
export class AddRentComponent implements OnInit {
	@use(BaseClass) this;
	vehicles: Vehicle[];
	users: User[];
	results: any;
	autocomplete: any;
	rent: Rent;
	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {}
	form = new FormGroup({
		rentFromAndRentTo: new FormControl(
			[new Date(), this.nextMonth()],
			[
				Validators.required,
				(dates: AbstractControl) => {
					return dates?.value.every((d) => !!d) ? null : { dateRange: {} };
				},
			]
		),
		pickupLocation: new FormControl(null, [Validators.required]),
		dropOffLocation: new FormControl(null, [Validators.required]),
		vehicle: new FormControl(null, [Validators.required]),
		user: new FormControl(null, [Validators.required]),
	});
	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { rent }: { rent: Rent } = this.dialogCfg?.data ?? {};
		console.log(rent);

		forkJoin([this.vehicleService.getAllVehiclesAvailable(), this.userService.getAll()])
			.pipe(first())
			.subscribe(([vehicles, users]: any[]) => {
				this.vehicles = vehicles;
				this.users = users.map((u) => ({ ...u, nameWithLastName: `${u.name} ${u.lastName}` }));

				if (!vehicles?.length) {
					if (rent) {
						this.showToast({ toast: this.toast, summary: 'Attention!', detail: 'Please note, you have no vehicles available!', severity: 'warn' });
					} else {
						this.showToast({ toast: this.toast, summary: 'Hold up!', detail: 'Cannot add new rent due to having no vehicles available!', severity: 'warn' });
						this.ref.close();
					}
				}
				if (rent) {
					this.form.patchValue({
						rentFromAndRentTo: [new Date(rent?.rentFrom), new Date(rent?.rentTo)],
						pickupLocation: rent?.pickupLocation,
						dropOffLocation: rent?.dropOffLocation,
						vehicle: rent?.vehicle,
						user: rent?.rent_user,
					});
					if (rent?.vehicle) this.vehicles = [...vehicles, rent?.vehicle];
				} else {
					this.form.controls.vehicle.patchValue(vehicles[0] ?? null);
					this.form.controls.user.patchValue(users[0] ?? null);
				}
				this.rent = rent;
			});
	}
	fetchAutoComplete({ query }): void {
		fetch(this.config.value.AUTO_COMPLETE_API + query)
			.then((response) => response.json())
			.then((result) => {
				const { features } = result;
				this.results = features.map((feature) => ({ ...features, autocomplete: feature?.properties?.formatted ?? null }));
				this.autocomplete = this.results.map((result) => result?.autocomplete || '');
			})
			.catch((error) => console.log('error', error));
	}

	save() {
		console.log(this.form, this.form.value);
		const { rentFromAndRentTo, pickupLocation, dropOffLocation, vehicle, user } = this.form.value;
		const [rentFrom, rentTo] = rentFromAndRentTo;
		const { pkVehicle } = vehicle;
		const { pkUser } = user;

		if (this.rent) {
			const params = { pkRent: this.rent.pkRent, pkRentStatus: this.rent.pkRentStatus, pkVehicle, pkUserRented: pkUser, rentFrom, rentTo, pickupLocation, dropOffLocation };

			this.ref.close(params);
		} else {
			const params = { pkVehicle, pkUserRented: pkUser, rentFrom, rentTo, pickupLocation, dropOffLocation };
			this.ref.close(params);
		}
	}
}
