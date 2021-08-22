import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogRef, User } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { Config } from './../../../_services/config';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
	dialogRef: DialogRef;
	user: User;
	userForm: FormGroup;
	results: any;
	autocomplete: any;
	constructor(public loader: LoaderService, public config: Config, public ref: DynamicDialogRef, public dialogCfg: DynamicDialogConfig) {}

	ngOnInit(): void {
		this.dialogRef = {
			ref: this.ref,
			cfg: this.dialogCfg,
		};
		const { data } = this.dialogCfg;
		this.user = data;
		this.userForm = new FormGroup({
			address: new FormControl(this.user?.address ?? null, []),
			lastName: new FormControl(this.user?.lastName ?? null, []),
			name: new FormControl(this.user?.name ?? null, []),
			phone: new FormControl(this.user?.phone ?? null, []),
		});
		console.log(this.user);
	}

	fetchAutoComplete({ query }): void {
		fetch(this.config.value.AUTO_COMPLETE_API + query)
			.then((response) => response.json())
			.then((result) => {
				const { features } = result;
				this.results = features.map((feature) => ({ ...features, autocomplete: feature?.properties?.formatted ?? null }));
				this.autocomplete = this.results.map((result) => result?.autocomplete || '');
			})
			.catch((error) => console.log('error', error));
	}
	canSaveUi() {
		return !(this.userForm.valid && !this.userForm.pristine);
	}
	save() {
		this.ref.close({ user: this.userForm.value });
	}
}
