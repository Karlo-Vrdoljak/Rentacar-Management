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

@NgModule({
	declarations: [AppComponent, NavComponent, FooterComponent],
	imports: [ToolbarModule, RippleModule, ButtonModule, BrowserModule, AppRoutingModule, InputTextModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
