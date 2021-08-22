import { Component, Input, OnInit } from '@angular/core';
import { BaseClass } from 'src/app/_abstract/base.class';
import { use } from 'typescript-mix';

export interface StatusIconComponent extends BaseClass {}

@Component({
	selector: 'app-status-icon',
	templateUrl: './status-icon.component.html',
	styleUrls: ['./status-icon.component.scss'],
})
export class StatusIconComponent implements OnInit {
	@use(BaseClass) this;

	@Input() status: any;
	@Input() symbolFor: string = 'vehicle';
	constructor() {}

	ngOnInit(): void {
		
	}
}
