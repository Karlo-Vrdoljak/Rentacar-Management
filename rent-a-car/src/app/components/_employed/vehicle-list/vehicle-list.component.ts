import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { forkJoin, from, Subject } from 'rxjs';
import { concatMap, first, takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Vehicle } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { RentService } from 'src/app/_services/rent.service';
import { use } from 'typescript-mix';
import { ONE_SECOND } from './../../../_consts/consts';
import { VehicleService } from './../../../_services/vehicle.service';
import { InsertUpdateVehicleComponent } from './vehicle/insert-update-vehicle/insert-update-vehicle.component';
import { ChangeStatusVehicleComponent } from './vehicle/change-status-vehicle/change-status-vehicle.component';

export interface VehicleListComponent extends BaseClass {}
@Component({
	selector: 'app-vehicle-list',
	templateUrl: './vehicle-list.component.html',
	styleUrls: ['./vehicle-list.component.scss'],
	providers: [DialogService],
})
export class VehicleListComponent implements OnInit {
	@use(BaseClass) this;
	@Input() vehicles: Vehicle[];
	cols: { field: string; header: string }[];
	@Output() onChange = new EventEmitter<any>();
	selectedVehicles: Vehicle[];
	filter: string | null;
	constructor(public vehicleService: VehicleService, public rent: RentService, public loader: LoaderService, public toast: MessageService, public rentService: RentService, public ds: DialogService, public cs: ConfirmationService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.cols = [
			{ field: 'createdAt', header: 'Added on' },
			{ field: 'changedAt', header: 'Last change' },
			{ field: 'code', header: 'Code' },
			{ field: 'color', header: 'Color' },
			{ field: 'manufacturer', header: 'Manufacturer' },
			{ field: 'model', header: 'Model' },
			{ field: 'gasType', header: 'Gas type' },
			{ field: 'dateOfManufacture', header: 'Built on' },
			{ field: 'currentKilometers', header: 'Kilometers' },
			{ field: 'startingKilometers', header: 'Starting kilometers' },
			{ field: 'vehicleStatus', header: 'Status' },
		];
		console.log(this.vehicles);
	}
	confirmDelete(event, selectedVehicles: Vehicle[]) {
		console.log(selectedVehicles);
		this.confirm({
			confirmationService: this.cs,
			event,
			message: `Are you sure you want to delete ${selectedVehicles?.length == 1 ? 'this vehicle?' : 'selected vehicles?'}`,
			accept: () => {
				this.loader.start();
				forkJoin(selectedVehicles.map((sv) => this.vehicleService.deleteOne({ pkVehicle: sv.pkVehicle })))
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
							this.loader.showToast({ toast: this.toast, severity: 'error', summary: 'Error', detail: 'Cannot delete this vehicle, remove all rents associated with it first!' });
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
	addNewVehicle() {
		const ref = this.ds.open(InsertUpdateVehicleComponent, { header: 'Add new vehicle', modal: true });
		ref.onClose.subscribe((result) => {
			const { vehicle } = result;
			console.log(vehicle);
			if (vehicle) {
				this.loader.start();
				const fleet = new Array(vehicle.multiInsert).fill({ vehicle });
				// return;
				let completeCount = 0;
				from(fleet)
					.pipe(
						concatMap(({ vehicle }) => this.vehicleService.createOne({ vehicle })),
						takeUntil(this.destroy)
					)
					.subscribe(
						(result) => {
							completeCount++;
							if (fleet.length == completeCount) {
								console.log('completeCount', completeCount);

								this.loader.stop(vehicle.multiInsert > 1 ? 'Vehicles created successfully!' : 'Vehicle created successfully!');
								this.onChange.emit({});
							}
						},
						(err) => {
							console.error(err);
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
	expand(vehicle: Vehicle) {}
	editVehicle(vehicle: Vehicle) {
		const ref = this.ds.open(InsertUpdateVehicleComponent, { header: 'Edit vehicle', modal: true, data: { vehicle } });
		ref.onClose.subscribe((result) => {
			const { vehicle: dirtyVehicle } = result;
			if (dirtyVehicle) {
				this.loader.start();
				this.vehicleService
					.createOne({ vehicle: { ...vehicle, ...dirtyVehicle } })
					.pipe(first())
					.subscribe(
						(result) => {
							this.loader.stop('Vehicle details changed successfully!');

							this.onChange.emit({});
						},
						(err) => {
							console.error(err);
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
	changeStatusRent(vehicle: Vehicle) {
		const ref = this.ds.open(ChangeStatusVehicleComponent, { header: 'Change vehicle status', modal: true, data: { vehicle } });
		ref.onClose.subscribe((data: { vehicleStatus }) => {
			if (data) {
				this.loader.start();
				const { vehicleStatus } = data;
				console.log(vehicleStatus);
				this.vehicleService
					.changeStatus({ pkVehicle: vehicle.pkVehicle, vehicleStatus })
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
}
