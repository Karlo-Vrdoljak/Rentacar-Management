import { Component, Input, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ONE_SECOND, RENT_STATUS } from 'src/app/_consts/consts';
import { use } from 'typescript-mix';
import { ChangeStatusRentComponent } from '../components/_employed/rent-list/crud/change-status-rent/change-status-rent.component';
import { RentCompleteUpdateKmComponent } from '../components/_employed/rent-list/crud/rent-complete-update-km/rent-complete-update-km.component';
import { BaseClass } from '../_abstract/base.class';
import { EInteractionReducer, Rent, Vehicle } from '../_consts/consts';
import { AuthService } from '../_services/auth.service';
import { Config } from '../_services/config';
import { LoaderService } from '../_services/loader.service';
import { RentService } from '../_services/rent.service';
import { UserService } from '../_services/user.service';
import { VehicleService } from '../_services/vehicle.service';
import { AddRentComponent } from './../components/_employed/rent-list/crud/add-rent/add-rent.component';

export interface RentComponent extends BaseClass {}

@Component({
	selector: 'app-rent',
	templateUrl: './rent.component.html',
	styleUrls: ['./rent.component.scss'],
	providers: [DialogService],
})
export class RentComponent implements OnInit {
	@use(BaseClass) this;
	@Input() rent: Rent;
	vehicles: Vehicle[];
	constructor(public auth: AuthService, public cs: ConfirmationService, public ds: DialogService, public rentService: RentService, public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		console.log(this.rent);
	}
	editRent() {
		const ref = this.ds.open(AddRentComponent, { header: 'Edit rent', modal: true, data: { rent: this.rent } });
		ref.onClose.subscribe((data?) => {
			if (data) {
				this.loader.start();
				this.rentService
					.makeRent(data)
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop('Rent updated successfully!');
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}

	updateVehicleKilometersOnRentComplete(rent: Rent) {
		const ref = this.ds.open(RentCompleteUpdateKmComponent, { header: 'Update kilometers', modal: true, closable: false, closeOnEscape: false, data: { rent } });
		ref.onClose.subscribe((data: { kilometers }) => {
			if (data) {
				const { kilometers } = data;
				if (kilometers) {
					this.rentService
						.updateKilometers({ pkRent: rent.pkRent, currentKilometers: kilometers.currentKilometers })
						.pipe(first())
						.subscribe((data) => {
							this.loader.stop('The rent is now completed!');
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						});
				}
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}

	changeStatusRent() {
		const ref = this.ds.open(ChangeStatusRentComponent, { header: 'Change rent status', modal: true, data: { rent: this.rent } });
		ref.onClose.subscribe((data: { rentStatus }) => {
			if (data) {
				this.loader.start();
				const { rentStatus } = data;
				console.log(rentStatus);
				this.rentService
					.changeStatusRent({ pkRent: this.rent.pkRent, rentStatus })
					.pipe(first())

					.subscribe(
						(rent: Rent) => {
							rent.pkRentStatus == RENT_STATUS.Complete && this.updateVehicleKilometersOnRentComplete(rent);

							this.loader.stop('Status changed successfully!');
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
	confirmDelete(event, selectedRents: Rent[]) {
		console.log(selectedRents);
		this.confirm({
			confirmationService: this.cs,
			event,
			message: `Are you sure you want to delete ${selectedRents?.length == 1 ? 'this rent?' : 'selected rents?'}`,
			accept: () => {
				this.loader.start();
				forkJoin(selectedRents.map((sr) => this.rentService.deleteOne({ pkRent: sr.pkRent })))
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop();

							console.log(data);
							this.showToast({ toast: this.toast, detail: 'Deleted successfully!' });
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							console.log(err);
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });

							this.loader.stop();
						}
					);
			},
			acceptLabel: 'Yes!',
			rejectLabel: 'Not really',
			icon: 'pi pi-exclamation-triangle',
		});
	}
}
