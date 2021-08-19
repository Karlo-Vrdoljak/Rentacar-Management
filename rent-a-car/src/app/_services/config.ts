import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Interaction } from '../_consts/consts';
import { APP_CONFIG, AppConfig } from './appConfig';
@Injectable({
	providedIn: 'root',
})
export class Config {
	value: any;
	constructor(@Inject(APP_CONFIG) appConfig: AppConfig) {
		this.value = appConfig;
	}
	private interaction = new BehaviorSubject<Interaction>({} as any);
	currentInteraction = this.interaction.asObservable();

	nextInteraction(data: Interaction) {
		this.interaction.next(data);
	}
	/*******************************
		this.appService.currentInteraction.pipe(takeUntil(this.destroy)).subscribe((data) => {
			if (data?.id == EInteractionReducer.scroll && this.user?.PkUsera) {
				this.menu.hide();
			}
	 */
}
