import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Receipt, Rent } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { use } from 'typescript-mix';

export interface AddPaymentComponent extends BaseClass {}

@Component({
	selector: 'app-add-payment',
	templateUrl: './add-payment.component.html',
	styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit {
	@use(BaseClass) this;
	form = new FormGroup({
		currentlyPaid: new FormControl(0, []),
	});
	receipt: Receipt;

	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.initView();
	}

	initView() {}
	save() {
		const { currentlyPaid } = this.form.value;
		this.ref.close({
			payment: {
				currentlyPaid: this.parseCurrency(currentlyPaid),
			},
		});
	}
}
