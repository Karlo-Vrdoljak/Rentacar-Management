import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { Receipt, Rent } from 'src/app/_consts/consts';
import { RentService } from 'src/app/_services/rent.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { ReceiptService } from './../../../_services/receipt.service';
import { Vehicle } from './../../../_consts/consts';

@Component({
	selector: 'app-dashboard-page',
	templateUrl: './dashboard-page.component.html',
	styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
	stats: any;
	rents: Rent[];
	vehicles: Vehicle[];
	receipts: Receipt[];
	tabIndex: number = 0;
	constructor(public vehicleService: VehicleService, public receiptService: ReceiptService, public loader: LoaderService, public rent: RentService, public route: ActivatedRoute, public router: Router) {}

	ngOnInit(): void {
		this.initView(this.route.snapshot.data.pageData);
	}

	initView(init) {
		const [stats, rents, vehicles, receipts] = init;
		this.stats = stats;
		this.rents = rents;
		this.vehicles = vehicles;
		this.receipts = receipts;
		console.log([stats, rents, vehicles, receipts]);
	}
	onChangeRentChange() {
		this.loader.startBg();
		forkJoin([this.rent.getStats(), this.rent.getAll(), this.vehicleService.getAll(), this.receiptService.getAll()])
			.pipe(first())
			.subscribe(
				(data) => {
					this.loader.stopBg();

					this.initView(data);
				},
				(err) => {
					this.loader.stopBg();
				}
			);
	}
}
