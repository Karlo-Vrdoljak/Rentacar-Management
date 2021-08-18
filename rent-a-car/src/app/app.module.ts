import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NavComponent } from './components/layout/nav/nav.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ToolbarModule } from 'primeng/toolbar';
import { HeaderComponent } from './components/layout/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './_interceptors/app.interceptor';
import { VehicleComponent } from './components/vehicle/vehicle.component';
@NgModule({
	declarations: [AppComponent, NavComponent, FooterComponent, HeaderComponent, HomeComponent, VehicleComponent],
	imports: [HttpClientModule, ToolbarModule, RippleModule, ButtonModule, BrowserModule, AppRoutingModule, InputTextModule],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AppHttpInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
