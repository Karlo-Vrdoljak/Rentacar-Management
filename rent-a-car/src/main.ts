import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_CONFIG } from 'src/app/_services/appConfig';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import '@angular/compiler';

fetch(environment.production ? '/assets/config.prod.json' : '/assets/config.json')
	.then((response) => response.json())
	.then((config) => {
		if (environment.production) {
			enableProdMode();
		}
		console.log(config);
		
		platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
			.bootstrapModule(AppModule)
			.catch((err) => console.error(err));
	});
