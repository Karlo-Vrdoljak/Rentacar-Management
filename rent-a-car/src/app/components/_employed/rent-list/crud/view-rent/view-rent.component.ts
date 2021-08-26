import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { EInteractionReducer, Rent, Vehicle } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { RentService } from 'src/app/_services/rent.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';

export interface ViewRentComponent extends BaseClass {}

@Component({
	selector: 'app-view-rent',
	templateUrl: './view-rent.component.html',
	styleUrls: ['./view-rent.component.scss'],
})
export class ViewRentComponent implements OnInit {
	@use(BaseClass) this;
	@Input() rent: Rent;
	vehicles: Vehicle[];
	constructor(public rentService: RentService, public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {
		this.destroy = new Subject();
	}
	ngOnInit(): void {
		this.initView();
	}
	initView() {
		// this.loader.start();
		const { rent }: { rent: Rent } = this.dialogCfg?.data ?? {};
		this.rent = rent;

		this.config.currentInteraction.pipe(takeUntil(this.destroy)).subscribe((interaction) => {
			if (interaction.id == EInteractionReducer.stateChanged) {
				this.rentService
					.getOne({ pkRent: rent.pkRent })
					.pipe(takeUntil(this.destroy))
					.subscribe((rent: any) => {
						this.rent = rent;
					});
			}
		});
	}
}
