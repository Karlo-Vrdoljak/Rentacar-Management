import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/_abstract/base.class';
import { VEHICLE_STATUS, Rent, Vehicle } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';

export interface ChangeStatusVehicleComponent extends BaseClass {}

@Component({
	selector: 'app-change-status-vehicle',
	templateUrl: './change-status-vehicle.component.html',
	styleUrls: ['./change-status-vehicle.component.scss'],
})
export class ChangeStatusVehicleComponent implements OnInit {
	@use(BaseClass) this;
	vehicleStatuses: { label: string; value: VEHICLE_STATUS }[];
	selectedStatus: any;
	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { vehicle }: { vehicle: Vehicle } = this.dialogCfg?.data ?? {};
		console.log(vehicle);
		this.vehicleStatuses = [
			{
				label: 'Available',
				value: VEHICLE_STATUS.Available,
			},
			{
				label: 'Rented',
				value: VEHICLE_STATUS.Rented,
			},
			{
				label: 'Service',
				value: VEHICLE_STATUS.Service,
			},
			{
				label: 'NotAvailable',
				value: VEHICLE_STATUS.NotAvailable,
			},
		];
		this.selectedStatus = vehicle?.vehicleStatus.pkVehicleStatus || 1;
	}
	onSelect(ev) {
		this.selectedStatus = ev;
	}
	save() {
		this.ref.close({ vehicleStatus: this.selectedStatus });
	}
}
