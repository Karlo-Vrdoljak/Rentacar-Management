import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

export interface ViewVehicleComponent extends BaseClass {}
@Component({
	selector: 'app-view-vehicle',
	templateUrl: './view-vehicle.component.html',
	styleUrls: ['./view-vehicle.component.scss'],
})
export class ViewVehicleComponent implements OnInit, AfterContentChecked {
	@use(BaseClass) this;
	vehicle: Vehicle;
	rents: Rent[];

	constructor(public cdref: ChangeDetectorRef, public rent: RentService, public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService, public vehicleService: VehicleService) {
		this.destroy = new Subject();
	}
	ngAfterContentChecked(): void {
		this.cdref.detectChanges();
	}
	ngOnInit(): void {
		this.initView();
	}

	initView() {
		// this.loader.start();
		const { vehicle }: { vehicle: Vehicle } = this.dialogCfg?.data ?? {};
		this.vehicle = vehicle;
		this.fetchData(vehicle);
		this.config.currentInteraction.pipe(takeUntil(this.destroy)).subscribe((interaction) => {
			if (interaction.id == EInteractionReducer.stateChanged) {
				this.fetchData(this.vehicle);
			}
		});
	}

	fetchData(vehicle) {
		this.rent
			.getByVehicle({ pkVehicle: vehicle.pkVehicle })
			.pipe(first())
			.subscribe((rents: Rent[]) => {
				// this.loader.stop();
				this.rents = rents;
			});
	}
}
