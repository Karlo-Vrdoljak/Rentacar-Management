import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { BaseClass } from 'src/app/_abstract/base.class';
import { Receipt, Rent } from 'src/app/_consts/consts';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { UserService } from 'src/app/_services/user.service';
import { use } from 'typescript-mix';

export interface InsertEditReceiptComponent extends BaseClass {}

@Component({
	selector: 'app-insert-edit-receipt',
	templateUrl: './insert-edit-receipt.component.html',
	styleUrls: ['./insert-edit-receipt.component.scss'],
})
export class InsertEditReceiptComponent implements OnInit {
	@use(BaseClass) this;
	form = new FormGroup({
		dateDue: new FormControl(null, [Validators.required]),
		price: new FormControl(0, [Validators.required]),
		currentlyPaid: new FormControl(0, []),
	});
	receipt: Receipt;

	constructor(public toast: MessageService, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig, public loader: LoaderService, public config: Config, public userService: UserService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.initView();
	}

	initView() {
		const { receipt, rent }: { receipt: Receipt; rent: Rent } = this.dialogCfg?.data ?? {};
		if (receipt && rent) {
			this.form.patchValue({
				...{ ...receipt, dateDue: new Date(receipt.dateDue) },
			});
		} else if (!receipt && rent) {
			this.form.patchValue({
				dateDue: this.nextMonth(rent.rentTo),
			});
		}
	}
	save() {
		const { dateDue, price, currentlyPaid } = this.form.value;
		this.ref.close({
			receipt: {
				dateDue,
				price: this.parseCurrency(price),
				currentlyPaid: this.parseCurrency(currentlyPaid),
			},
		});
	}
}
