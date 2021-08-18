import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from './../../_services/vehicle.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	vehicles: any[];
	constructor(public route: ActivatedRoute, public router: Router) {}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		this.vehicles = this.route.snapshot.data.pageData[0] || [];
		console.log(this.vehicles);
		
	}
}
