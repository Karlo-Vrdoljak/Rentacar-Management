import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Rent, ONE_SECOND, EInteractionReducer, RENT_STATUS } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { RentService } from 'src/app/_services/rent.service';
import { use } from 'typescript-mix';
import { AddRentComponent } from './crud/add-rent/add-rent.component';
import { ChangeStatusRentComponent } from './crud/change-status-rent/change-status-rent.component';
import { ViewRentComponent } from './crud/view-rent/view-rent.component';
import { Config } from 'src/app/_services/config';
import { AuthService } from 'src/app/_services/auth.service';
import { RentCompleteUpdateKmComponent } from './crud/rent-complete-update-km/rent-complete-update-km.component';

export interface RentListComponent extends BaseClass {}

@Component({
	selector: 'app-rent-list',
	templateUrl: './rent-list.component.html',
	styleUrls: ['./rent-list.component.scss'],
	providers: [DialogService],
})
export class RentListComponent implements OnInit {
	@use(BaseClass) this;
	@Input() rents: Rent[];
	cols: { field: string; header: string }[];
	@Output() onChange = new EventEmitter<any>();
	selectedRents: Rent[];
	filter: string | null;
	constructor(public auth: AuthService, public config: Config, public rent: RentService, public loader: LoaderService, public toast: MessageService, public rentService: RentService, public ds: DialogService, public cs: ConfirmationService) {}

	ngOnInit(): void {
		this.cols = [
			{ field: 'createdAt', header: 'Queued at' },
			{ field: 'changedAt', header: 'Last change' },
			{ field: 'rentFrom', header: 'From' },
			{ field: 'rentTo', header: 'To' },
			{ field: 'rentCompleteKilometers', header: 'Completed rent kilometers' },
			{ field: 'pickupLocation', header: 'Pickup' },
			{ field: 'dropOffLocation', header: 'Dropoff' },
			{ field: 'rentStatus', header: 'status' },
			{ field: 'rent_entry', header: 'Entered by' },
			{ field: 'rent_user', header: 'Renting user' },
			{ field: 'vehicle', header: 'Vehicle' },
		];
		console.log(this.rents);
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
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							console.log(err);
							this.onChange.emit({});
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

	clear(table: Table) {
		table.clear();
		this.filter = null;
	}
	expand(rent: Rent) {
		const ref = this.ds.open(ViewRentComponent, { header: 'View rent', modal: true, data: { rent } });
		ref.onClose.subscribe((data) => {
			if (data) {
				const { rent } = data;
				console.log(rent);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
			this.onChange.emit({});
			this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
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
						});
				}
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}

	editRent(rent: Rent) {
		const ref = this.ds.open(AddRentComponent, { header: 'Edit rent', modal: true, data: { rent } });
		ref.onClose.subscribe((data?) => {
			if (data) {
				this.loader.start();
				this.rent
					.makeRent(data)
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop('Rent updated successfully!');
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
			this.onChange.emit({});
			this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
		});
	}
	changeStatusRent(rent: Rent) {
		const ref = this.ds.open(ChangeStatusRentComponent, { header: 'Change rent status', modal: true, data: { rent } });
		ref.onClose.subscribe((data: { rentStatus }) => {
			if (data) {
				this.loader.start();
				const { rentStatus } = data;
				console.log(rentStatus);
				this.rent
					.changeStatusRent({ pkRent: rent.pkRent, rentStatus })
					.pipe(first())

					.subscribe(
						(rent: Rent) => {
							rent.pkRentStatus == RENT_STATUS.Complete && this.updateVehicleKilometersOnRentComplete(rent);

							this.loader.stop('Status changed successfully!');
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
	addNewRent() {
		const ref = this.ds.open(AddRentComponent, { header: 'Add new rent', modal: true });
		ref.onClose.subscribe((data?) => {
			if (data) {
				this.loader.start();
				this.rent
					.makeRent(data)
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop('Rent added successfully!');
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.onChange.emit({});
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
}
