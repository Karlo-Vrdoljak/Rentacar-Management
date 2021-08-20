import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseClass } from 'src/app/_abstract/base.class';
import { use } from 'typescript-mix';
import { Rent, User, UserRentStats, Vehicle } from './../../../_consts/consts';

export interface ProfilePageComponent extends BaseClass {}

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
	@use(BaseClass) this;
	user: User;
	rents: Rent[];
	stats: UserRentStats;
	constructor(public route: ActivatedRoute, public router: Router) {}

	ngOnInit(): void {
		this.initView();
	}

	iterateRent(rent: Rent) {
		return Object.keys(rent)
			.filter((key) => !key.startsWith('pk') && !['vehicle', 'rentStatus', 'receipt'].includes(key))
			.map((i) => ({ key: i, label: this.sentenceCase(i) }));
	}

	initView(): void {
		const [user, rents, stats] = this.route.snapshot.data.pageData;
		this.user = user;
		this.rents = rents;
		this.stats = stats;
		console.log(user, rents, stats);
	}
}
