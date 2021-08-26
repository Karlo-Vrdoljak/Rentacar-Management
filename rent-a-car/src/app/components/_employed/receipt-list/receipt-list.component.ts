import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { forkJoin, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { EInteractionReducer, ONE_SECOND, Receipt, Rent } from 'src/app/_consts/consts';
import { AuthService } from 'src/app/_services/auth.service';
import { Config } from 'src/app/_services/config';
import { LoaderService } from 'src/app/_services/loader.service';
import { ReceiptService } from 'src/app/_services/receipt.service';
import { RentService } from 'src/app/_services/rent.service';
import { use } from 'typescript-mix';
import { InsertEditReceiptComponent } from './crud/insert-edit-receipt/insert-edit-receipt.component';
import { AddPaymentComponent } from './crud/add-payment/add-payment.component';

export interface ReceiptListComponent extends BaseClass {}

@Component({
	selector: 'app-receipt-list',
	templateUrl: './receipt-list.component.html',
	styleUrls: ['./receipt-list.component.scss'],
	providers: [DialogService],
})
export class ReceiptListComponent implements OnInit {
	@Input() receipt: Receipt[];
	@Input() rent: Rent;
	@use(BaseClass) this;
	cols: { field: string; header: string }[];
	selectedReceipts: Receipt[];
	filter: string | null;
	constructor(public receiptService: ReceiptService, public auth: AuthService, public config: Config, public loader: LoaderService, public toast: MessageService, public rentService: RentService, public ds: DialogService, public cs: ConfirmationService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.cols = [
			{ field: 'createdAt', header: 'Queued at' },
			{ field: 'changedAt', header: 'Last change' },
			{ field: 'dateDue', header: 'Due' },
			{ field: 'isPaid', header: 'Is fully paid' },
			{ field: 'price', header: 'Price' },
			{ field: 'currentlyPaid', header: 'Paid' },
			{ field: 'receiptStatus', header: 'Status' },
		];
		console.log(this.receipt);
	}

	clear(table: Table) {
		table.clear();
		this.filter = null;
	}
	addNewReceipt() {
		const ref = this.ds.open(InsertEditReceiptComponent, { header: 'Add new Receipt', modal: true, data: { rent: this.rent } });
		ref.onClose.subscribe((data?) => {
			if (data) {
				const { receipt } = data;
				const { price, dateDue, currentlyPaid } = receipt;
				this.loader.start();
				this.receiptService
					.create({ pkRent: this.rent.pkRent, price, dateDue, currentlyPaid })
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop('Rent added successfully!');
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
	addPayment(receipt: Receipt) {
		const ref = this.ds.open(AddPaymentComponent, { header: 'Add payment', modal: true });
		ref.onClose.subscribe((data?) => {
			if (data) {
				const { payment } = data;
				const { currentlyPaid } = payment;
				this.loader.start();
				this.receiptService
					.addPayment({ pkReceipt: receipt.pkReceipt, currentlyPaid })
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop('Payment added successfully!');
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}

	editReceipt(receipt: Receipt) {
		const ref = this.ds.open(InsertEditReceiptComponent, { header: 'Add new Receipt', modal: true, data: { receipt, rent: this.rent } });
		ref.onClose.subscribe((data?) => {
			if (data) {
				const { receipt: receiptDirty } = data;
				const { price, dateDue, currentlyPaid } = receiptDirty;
				this.loader.start();
				this.receiptService
					.edit({ pkReceipt: receipt.pkReceipt, price, dateDue, currentlyPaid })
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop('Rent changed successfully!');
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							this.loader.stop();
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
	changeStatusReceipt(receipt: Receipt) {}

	confirmDelete(event, selectedReceipts: Receipt[]) {
		console.log(selectedReceipts);
		this.confirm({
			confirmationService: this.cs,
			event,
			message: `Are you sure you want to delete ${selectedReceipts?.length == 1 ? 'this receipt?' : 'selected receipts?'}`,
			accept: () => {
				this.loader.start();
				forkJoin(selectedReceipts.map((r) => this.receiptService.deleteOne({ pkReceipt: r.pkReceipt })))
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop();
							console.log(data);
							this.showToast({ toast: this.toast, detail: 'Deleted successfully!' });
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
						},
						(err) => {
							console.log(err);
							// this.loader.showToast({ toast: this.toast, severity: 'error', summary: 'Error', detail: 'Cannot delete this vehicle, remove all rents associated with it first!' });
							this.config.nextInteraction({ id: EInteractionReducer.stateChanged });
							this.loader.stop();
						}
					);
			},
			acceptLabel: 'Yes!',
			rejectLabel: 'Not really',
			icon: 'pi pi-exclamation-triangle',
		});
	}
}
