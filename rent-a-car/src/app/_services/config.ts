import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from './appConfig';
@Injectable({
	providedIn: 'root',
})
export class Config {
	value: AppConfig;
	constructor(@Inject(APP_CONFIG) appConfig: AppConfig) {
		this.value = appConfig;
	}
}
