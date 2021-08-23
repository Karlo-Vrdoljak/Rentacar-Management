import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rent } from 'src/app/_consts/consts';

@Component({
	selector: 'app-dashboard-page',
	templateUrl: './dashboard-page.component.html',
	styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
	stats: any;
	rents: Rent[];
	constructor(public route: ActivatedRoute, public router: Router) {}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const [stats, rents] = this.route.snapshot.data.pageData;
		this.stats = stats;
		this.rents = rents;
		console.log(stats);
	}
}
