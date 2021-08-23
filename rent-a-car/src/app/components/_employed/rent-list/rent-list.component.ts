import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Rent, ONE_SECOND } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { RentService } from 'src/app/_services/rent.service';
import { use } from 'typescript-mix';
import { AddRentComponent } from './crud/add-rent/add-rent.component';
import { ChangeStatusRentComponent } from './crud/change-status-rent/change-status-rent.component';
import { ViewRentComponent } from './crud/view-rent/view-rent.component';

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
	constructor(public rent: RentService, public loader: LoaderService, public toast: MessageService, public rentService: RentService, public ds: DialogService, public cs: ConfirmationService) {}

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
						},
						(err) => {
							console.log(err);
							this.onChange.emit({});
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
						},
						(err) => {
							this.loader.stop();
							this.onChange.emit({});
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
			this.onChange.emit({});
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
						(data) => {
							this.loader.stop('Status changed successfully!');
							this.onChange.emit({});
						},
						(err) => {
							this.loader.stop();
							this.onChange.emit({});
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
						},
						(err) => {
							this.loader.stop();
							this.onChange.emit({});
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
}
