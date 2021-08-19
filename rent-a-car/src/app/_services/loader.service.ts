import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { use } from 'typescript-mix';
import { BaseClass } from '../_abstract/base.class';
import { MAX_LOADER_SHOW } from './../_consts/consts';
import { MessageService } from 'primeng/api';

export interface LoaderService extends BaseClass {}

@Injectable({
	providedIn: 'root',
})
export class LoaderService {
	isLoading: boolean = false;
	@use(BaseClass) this;

	constructor(public toast: MessageService, public loader: NgxUiLoaderService) {}
	start() {
		this.isLoading = true;
		this.loader.start();
		setTimeout(() => {
			this.loader.stop();
			this.isLoading = false;
		}, MAX_LOADER_SHOW);
	}
	startBg() {
		this.isLoading = true;
		this.loader.startBackground();
		setTimeout(() => {
			this.loader.stopBackground();
			this.isLoading = false;
		}, MAX_LOADER_SHOW);
	}
	stop(msg?: string) {
		this.isLoading = false;
		this.loader.stop();
		if (msg) {
			this.showToast({ toast: this.toast, detail: msg });
		}
	}
	stopBg() {
		this.isLoading = false;
		this.loader.stopBackground();
	}
}
