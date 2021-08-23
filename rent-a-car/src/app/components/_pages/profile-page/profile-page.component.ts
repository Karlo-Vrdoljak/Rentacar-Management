import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { VehicleService } from 'src/app/_services/vehicle.service';
import { use } from 'typescript-mix';
import { EditProfileComponent } from '../../user/edit-profile/edit-profile.component';
import { Rent, User, UserRentStats, Vehicle } from './../../../_consts/consts';
import { AuthService } from './../../../_services/auth.service';

export interface ProfilePageComponent extends BaseClass {}

@Component({
	selector: 'app-profile-page',
	templateUrl: './profile-page.component.html',
	styleUrls: ['./profile-page.component.scss'],
	providers: [DialogService],
})
export class ProfilePageComponent implements OnInit {
	@use(BaseClass) this;
	user: User;
	rents: Rent[];
	stats: UserRentStats;
	constructor(public loader: LoaderService, public dialogService: DialogService, public auth: AuthService, public route: ActivatedRoute, public router: Router, public vehicleService: VehicleService, public userService: UserService) {
		this.destroy = new Subject();
		route.params.subscribe((data) => {
			const { pkUser } = data;
			forkJoin([this.userService.getOne({ pkUser }), this.vehicleService.getAllVehiclesForUser({ pkUser }), this.userService.getStats({ pkUser })]).subscribe((data) => this.initView(data));
		});
	}

	ngOnInit(): void {
		this.initView(this.route.snapshot.data.pageData);
		console.log(this.user);
	}

	iterateRent(rent: Rent) {
		return Object.keys(rent)
			.filter((key) => !key.startsWith('pk') && !['vehicle', 'rentStatus', 'receipt'].includes(key))
			.map((i) => ({ key: i, label: this.sentenceCase(i) }));
	}

	initView(init): void {
		const [user, rents, stats] = init;
		this.user = user;
		this.rents = rents;
		this.stats = stats;
	}
	openEditProfile() {
		const ref = this.dialogService.open(EditProfileComponent, {
			header: 'Edit your profile details',
			closable: true,
			data: this.user,
			modal: true,
		});
		ref.onClose.pipe(takeUntil(this.destroy)).subscribe((result) => {
			if (result) {
				const { user } = result;
				console.log(user);
				this.loader.start();
				this.userService
					.updateOne({ ...this.user, ...user })
					.pipe(takeUntil(this.destroy))
					.subscribe((user: User) => {
						this.loader.stop('Changes saved!');

						this.user = user;
					});
			}
		});
	}
}
