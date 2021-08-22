import { Component, OnInit } from '@angular/core';
import { AbstractControl, EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Vehicle, ONE_SECOND } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { use } from 'typescript-mix';
import { LoginDialogComponent } from '../../user/login-dialog/login-dialog.component';
import { Config } from './../../../_services/config';
import { AuthService } from './../../../_services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { RentService } from 'src/app/_services/rent.service';

export interface RentVehicleComponent extends BaseClass {}

@Component({
	selector: 'app-rent-vehicle',
	templateUrl: './rent-vehicle.component.html',
	styleUrls: ['./rent-vehicle.component.scss'],
	providers: [DialogService],
})
export class RentVehicleComponent implements OnInit {
	@use(BaseClass) this;

	vehicle: Vehicle;
	rentVehicle = new FormGroup({
		dates: new FormControl(
			[new Date(), this.nextMonth()],
			[
				Validators.required,
				(dates: AbstractControl) => {

					return dates?.value.every((d) => !!d) ? null : { dateRange: {} };
				},
			]
		),
		location: new FormControl(null, [Validators.required]),
	});
	results: any;
	autocomplete: string[];
	constructor(public rent: RentService, public auth: AuthService, public loader: LoaderService, public dialogService: DialogService, public cs: ConfirmationService, public toast: MessageService, public config: Config, public route: ActivatedRoute, public router: Router) {
		this.destroy = new Subject();
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

	get uiSubmit() {
		return !this.rentVehicle.valid;
	}

	async confirmPopup(event: Event) {
		this.confirm({
			confirmationService: this.cs,
			event,
			message: 'Everything seems alright?',
			accept: () => {
				if (!this.auth.user) {
					const ref = this.dialogService.open(LoginDialogComponent, {
						header: 'To finish up the request, please sign in!',
						closable: true,
						data: this.rentVehicle.value,
					});
					ref.onClose.pipe(takeUntil(this.destroy)).subscribe(({ user }) => {
						this.persistRent();
					});
				} else {
					this.persistRent();
				}
			},
			acceptLabel: 'Submit rent',
			rejectLabel: 'Not yet',
			icon: 'pi pi-send',
		});
	}

	persistRent() {
		const { dates, location } = this.rentVehicle.value;
		const [rentFrom, rentTo] = dates;
		this.loader.start();
		this.rent
			.makeRent({
				pickupLocation: location,
				rentFrom,
				rentTo,
				pkVehicle: this.vehicle.pkVehicle,
			})
			.pipe(takeUntil(this.destroy))
			.subscribe(
				(data) => {
					this.loader.stop();

					this.loader.showToast({ toast: this.toast, detail: 'Great! We will contact you when the vehicle is on your address!' });
					setTimeout(() => {
						this.router.navigate(['/profile', this.auth.user?.pkUser]);
					}, ONE_SECOND);
				},
				(err) => {
					this.loader.stop();
					this.loader.startBg();
					setTimeout(() => {
						this.loader.stopBg();
						this.router.navigate(['/profile', this.auth.user?.pkUser]);
					}, ONE_SECOND);
				}
			);
	}

	ngOnInit(): void {
		this.vehicle = this.route.snapshot.data.pageData[0] || [];
	}
}
