import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Rent, RENT_STATUS } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';

export interface ChangeStatusRentComponent extends BaseClass {}
@Component({
	selector: 'app-change-status-rent',
	templateUrl: './change-status-rent.component.html',
	styleUrls: ['./change-status-rent.component.scss'],
})
export class ChangeStatusRentComponent implements OnInit {
	@use(BaseClass) this;
	rentStatuses: { label: string; value: RENT_STATUS }[];
	selectedStatus: any;
	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { rent }: { rent: Rent } = this.dialogCfg?.data ?? {};
		console.log(rent);
		this.rentStatuses = [
			{
				label: 'Queued',
				value: RENT_STATUS.Queued,
			},
			{
				label: 'Started',
				value: RENT_STATUS.Started,
			},
			{
				label: 'Complete',
				value: RENT_STATUS.Complete,
			},
			{
				label: 'Late',
				value: RENT_STATUS.Late,
			},
		];
		this.selectedStatus = rent?.pkRentStatus || 1;
	}
	onSelect(ev) {
		this.selectedStatus = ev;
	}
	save() {
		this.ref.close({ rentStatus: this.selectedStatus });
	}
}
