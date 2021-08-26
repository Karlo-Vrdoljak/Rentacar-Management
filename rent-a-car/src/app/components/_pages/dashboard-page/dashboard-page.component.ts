import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { Receipt, Rent } from 'src/app/_consts/consts';
import { RentService } from 'src/app/_services/rent.service';
import { LoaderService } from 'src/app/_services/loader.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { ReceiptService } from './../../../_services/receipt.service';
import { Vehicle, User } from './../../../_consts/consts';
import { Location } from '@angular/common';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

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
	users: User[];
	constructor(public auth: AuthService, public userService: UserService, public location: Location, public vehicleService: VehicleService, public receiptService: ReceiptService, public loader: LoaderService, public rent: RentService, public route: ActivatedRoute, public router: Router) {
		route.params.subscribe((params) => {
			const { index } = params;
			if (index && !isNaN(index)) {
				this.tabIndex = +index;
			}
		});
	}

	ngOnInit(): void {
		this.initView(this.route.snapshot.data.pageData);
	}

	initView(init) {
		const [stats, rents, vehicles, receipts, users] = init;
		this.stats = stats;
		this.rents = rents;
		this.vehicles = vehicles;
		this.receipts = receipts;
		this.users = (users as User[]).filter((u) => this.auth.hasClaim('admin') || !u.claims.includes('admin'));
		console.log([stats, rents, vehicles, receipts]);
	}
	onChangeHandler() {
		this.loader.startBg();
		forkJoin([this.rent.getStats(), this.rent.getAll(), this.vehicleService.getAll(), this.receiptService.getAll(), this.userService.getAll()])
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
