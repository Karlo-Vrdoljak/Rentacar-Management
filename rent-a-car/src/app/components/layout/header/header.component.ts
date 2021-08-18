import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { ONE_SECOND } from './../../../_consts/consts';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	@Input() header: string;
	searchForm = new FormGroup({
		search: new FormControl(null, []),
	});
	@Input() isSearch = false;
	constructor() {}

	ngOnInit(): void {
		this.searchForm.controls.search.valueChanges.pipe(debounceTime(ONE_SECOND / 2)).subscribe((change) => {
			console.log(change);
		});
	}
}
