import { Component, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

@Component({
	template: '',
})
export abstract class BaseClass implements OnDestroy {
	destroy: Subject<unknown>;

	ngOnDestroy(): void {
		this.destroy?.next();
		this.destroy?.unsubscribe();
	}
	constructor() {}
	confirm({ confirmationService, acceptLabel = 'Yes', rejectLabel = 'No', event, accept, reject = () => {}, message = 'Are you sure that you want to proceed?', icon = 'pi pi-exclamation-triangle' }: { confirmationService: ConfirmationService; acceptLabel?: string; rejectLabel?: string; event: Event; accept: Function; reject?: Function; message?: string; icon?: string }) {
		return confirmationService.confirm({
			target: event.target as EventTarget,
			message: message,
			icon: icon,
			accept: accept,
			reject: reject,
			acceptLabel,
			rejectLabel,
		});
	}
	showToast({ toast, severity = 'success', summary = 'Success', detail = 'Changes saved!' }: { toast: MessageService; severity?: string; summary?: string; detail?: string }) {
		toast.clear();
		toast.add({ severity, summary, detail });
	}
	nextMonth() {
		const d = new Date();
		d.setDate(d.getDate() + 31);
		return d;
	}

}
