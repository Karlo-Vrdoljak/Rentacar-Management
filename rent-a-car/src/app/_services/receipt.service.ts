import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Config } from './config';

const SLUG = 'receipt';

@Injectable({
	providedIn: 'root',
})
export class ReceiptService {
	constructor(public httpClient: HttpClient, public config: Config, public auth: AuthService) {}

	getAll() {
		return this.httpClient.get(this.config.value.API_URL + SLUG + '/all');
	}
	deleteOne({ pkReceipt }) {
		const req = {
			pkReceipt,
		};
		return this.httpClient.delete(this.config.value.API_URL + SLUG + '/one', { params: req });
	}
	changeStatusReceipt({ pkReceipt, rentStatus }) {
		const req = {
			pkReceipt,
			pkReceiptStatus: rentStatus,
		};
		return this.httpClient.put(this.config.value.API_URL + SLUG + '/update/status', req);
	}
	create({ pkRent, price, dateDue, currentlyPaid }) {
		const req = { pkRent, price, dateDue, currentlyPaid };
		return this.httpClient.post(this.config.value.API_URL + SLUG + '/create', req);
	}
	edit({ pkReceipt, price, dateDue, currentlyPaid }) {
		const req = { pkReceipt, price, dateDue, currentlyPaid };
		return this.httpClient.put(this.config.value.API_URL + SLUG + '/edit', req);
	}
	addPayment({ pkReceipt, currentlyPaid }) {
		const req = { pkReceipt, deposit: currentlyPaid };
		return this.httpClient.put(this.config.value.API_URL + SLUG + '/update/deposit', req);
	}
}
