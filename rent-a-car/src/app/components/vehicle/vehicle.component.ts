import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Vehicle, VEHICLE_STATUS } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { use } from 'typescript-mix';

export interface VehicleComponent extends BaseClass {}
@Component({
	selector: 'app-vehicle',
	templateUrl: './vehicle.component.html',
	styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit, AfterViewInit {
	@use(BaseClass) this;
	@Input() vehicle: Vehicle;
	@Input() button = true;
	imgApiURL: string;
	imgSrc: string;
	@Input() large = false;
	constructor(public config: Config) {}

	ngAfterViewInit(): void {
		fetch(this.imgApiURL + `${this.vehicle.manufacturer.split(' ')[0]} ${this.vehicle.model.split(' ')[0]}`)
			.then((response) => response.json())
			.then((res) => {
				const { hits, totalHits } = res;
				const randomnumber = Math.floor(Math.random() * totalHits) + 0;
				const photo = hits[randomnumber];
				this.imgSrc = photo?.webformatURL || 'assets/images/defaultCar.jpg';
			});
	}

	ngOnInit(): void {
		this.imgApiURL = this.config.value.IMAGE_SEARCH_API;
	}
}
