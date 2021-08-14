import { InjectionToken } from '@angular/core';

export class AppConfig {
	version: string | undefined;
}

export let APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
