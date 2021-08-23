import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Rent } from 'src/app/_consts/consts';
import { ConfirmationService } from 'primeng/api';
import { use } from 'typescript-mix';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Table } from 'primeng/table';

export interface RentListComponent extends BaseClass {}

@Component({
	selector: 'app-rent-list',
	templateUrl: './rent-list.component.html',
	styleUrls: ['./rent-list.component.scss'],
})
export class RentListComponent implements OnInit {
	@use(BaseClass) this;
	@Input() rents: Rent[];
	cols: { field: string; header: string }[];
	@Output() onChange = new EventEmitter<any>();
	selectedRents: Rent[];
	filter: string | null;
	constructor(public cs: ConfirmationService) {}

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
			accept: () => {},
			acceptLabel: 'Yes!',
			rejectLabel: 'Not really',
			icon: 'pi pi-exclamation-triangle',
		});
	}

	clear(table: Table) {
		table.clear();
		this.filter = null;
	}
}
