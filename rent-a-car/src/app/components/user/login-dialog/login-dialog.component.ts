import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogRef } from 'src/app/_consts/consts';

@Component({
	selector: 'app-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
	dialogRef: DialogRef;
	constructor(public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig) {}

	ngOnInit(): void {
		this.dialogRef = {
			ref: this.ref,
			cfg: this.dialogCfg,
		};
	}
}
