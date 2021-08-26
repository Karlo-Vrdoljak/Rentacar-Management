import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { forkJoin, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { BaseClass } from 'src/app/_abstract/base.class';
import { User } from 'src/app/_consts/consts';
import { LoaderService } from 'src/app/_services/loader.service';
import { RentService } from 'src/app/_services/rent.service';
import { UserService } from 'src/app/_services/user.service';
import { use } from 'typescript-mix';
import { ONE_SECOND } from './../../../_consts/consts';
import { UpdateUserComponent } from './update-user/update-user.component';

export interface UserListComponent extends BaseClass {}

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss'],
	providers: [DialogService],
})
export class UserListComponent implements OnInit {
	@use(BaseClass) this;
	@Input() users: User[];
	cols: { field: string; header: string }[];
	@Output() onChange = new EventEmitter<any>();
	selectedUsers: User[];
	filter: string | null;
	constructor(public userService: UserService, public rent: RentService, public loader: LoaderService, public toast: MessageService, public rentService: RentService, public ds: DialogService, public cs: ConfirmationService) {
		this.destroy = new Subject();
	}

	ngOnInit(): void {
		this.cols = [
			{ field: 'createdAt', header: 'Created at' },
			{ field: 'changedAt', header: 'Last change' },
			{ field: 'email', header: 'Email' },
			{ field: 'name', header: 'Name' },
			{ field: 'lastName', header: 'Last name' },
			{ field: 'phone', header: 'Phone' },
			{ field: 'address', header: 'Address' },
			{ field: 'claims', header: 'Claims' },
		];
		console.log(this.users);
	}

	confirmDelete(event, selectedUsers: User[]) {
		console.log(selectedUsers);
		this.confirm({
			confirmationService: this.cs,
			event,
			message: `Are you sure you want to delete ${selectedUsers?.length == 1 ? 'this user?' : 'selected users?'}`,
			accept: () => {
				this.loader.start();
				forkJoin(selectedUsers.map((su) => this.userService.deleteOne({ pkUser: su.pkUser })))
					.pipe(first())
					.subscribe(
						(data) => {
							this.loader.stop();

							console.log(data);
							this.showToast({ toast: this.toast, detail: 'Deleted successfully!' });
							this.onChange.emit({});
						},
						(err) => {
							console.log(err);
							this.onChange.emit({});
							this.loader.stop();
						}
					);
			},
			acceptLabel: 'Yes!',
			rejectLabel: 'Not really',
			icon: 'pi pi-exclamation-triangle',
		});
	}

	clear(table: Table) {
		table.clear();
		this.filter = null;
	}
	expand(user: User) {}

	editUser(user: User) {
		const ref = this.ds.open(UpdateUserComponent, { header: 'Change user claims', modal: true, data: { user } });
		ref.onClose.subscribe((result) => {
			const { claims } = result ?? {};
			if (claims) {
				this.loader.start();
				this.userService
					.updateClaims({ claims, pkUser: user.pkUser })
					.pipe(takeUntil(this.destroy))
					.subscribe(
						(result) => {
							this.loader.stop('User claims saved!');
							this.onChange.emit({});
						},
						(err) => {
							console.log(err);
							this.onChange.emit({});
							this.loader.stop();
						}
					);
			}
			setTimeout(() => {
				ref.destroy();
			}, ONE_SECOND);
		});
	}
}
