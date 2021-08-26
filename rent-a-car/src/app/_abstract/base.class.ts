import { Component, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ONE_SECOND, RENT_STATUS, User, VEHICLE_STATUS } from '../_consts/consts';
import { AuthService } from '../_services/auth.service';
import { RECEIPT_STATUS } from './../_consts/consts';

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
		toast.add({ severity, summary, detail, life: ONE_SECOND * 5 });
	}
	nextMonth(defaultDate?: Date) {
		const d = defaultDate ? new Date(defaultDate) : new Date();
		d.setDate(d.getDate() + 31);
		return d;
	}
	get vehicleStatus() {
		return VEHICLE_STATUS;
	}
	get receiptStatus() {
		return RECEIPT_STATUS;
	}
	get rentStatus() {
		return RENT_STATUS;
	}

	sentenceCase(text: string) {
		const result = text.replace(/([A-Z])/g, ' $1');
		return result.charAt(0).toUpperCase() + result.slice(1);
	}
	isValidDate(date) {
		return !isNaN(Date.parse(date));
	}
	isRestricted(bool: boolean, auth: AuthService, ui = false) {
		const result = auth.isAdmin() ? true : bool;
		return ui ? !result : result;
	}
	parseCurrency(price) {
		return `${price}`.includes('.') ? price : price + '.00';
	}
}
