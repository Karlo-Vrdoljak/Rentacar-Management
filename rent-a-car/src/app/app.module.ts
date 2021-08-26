import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFormErrorModule } from 'ngx-form-error';
import { NgxUiLoaderConfig, NgxUiLoaderModule, NgxUiLoaderRouterModule, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NavComponent } from './components/layout/nav/nav.component';
import { StatusIconComponent } from './components/status-icon/status-icon.component';
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { LoginDialogComponent } from './components/user/login-dialog/login-dialog.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { RentVehicleComponent } from './components/vehicle/rent-vehicle/rent-vehicle.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { HomeComponent } from './components/_pages/home/home.component';
import { LoginPageComponent } from './components/_pages/login-page/login-page.component';
import { ProfilePageComponent } from './components/_pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/_pages/register-page/register-page.component';
import { MAX_LOADER_SHOW } from './_consts/consts';
import { AppHttpInterceptor } from './_interceptors/app.interceptor';
import { HttpErrorInterceptor } from './_interceptors/error.interceptor';
import { DashboardPageComponent } from './components/_pages/dashboard-page/dashboard-page.component';
import { TableModule } from 'primeng/table';
import { RentListComponent } from './components/_employed/rent-list/rent-list.component';
import { TruncatePipe } from './_pipes/truncate.pipe';
import { ViewRentComponent } from './components/_employed/rent-list/crud/view-rent/view-rent.component';
import { AddRentComponent } from './components/_employed/rent-list/crud/add-rent/add-rent.component';
import { ChangeStatusRentComponent } from './components/_employed/rent-list/crud/change-status-rent/change-status-rent.component';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { VehicleListComponent } from './components/_employed/vehicle-list/vehicle-list.component';
import { InsertUpdateVehicleComponent } from './components/_employed/vehicle-list/vehicle/insert-update-vehicle/insert-update-vehicle.component';
import { ChangeStatusVehicleComponent } from './components/_employed/vehicle-list/vehicle/change-status-vehicle/change-status-vehicle.component';
import { ViewVehicleComponent } from './components/_employed/vehicle-list/vehicle/view-vehicle/view-vehicle.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserListComponent } from './components/_employed/user-list/user-list.component';
import { UpdateUserComponent } from './components/_employed/user-list/update-user/update-user.component';
import { SliderModule } from 'primeng/slider';
import { RentComponent } from './rent/rent.component';
import { ReceiptListComponent } from './components/_employed/receipt-list/receipt-list.component';
import { InsertEditReceiptComponent } from './components/_employed/receipt-list/crud/insert-edit-receipt/insert-edit-receipt.component';
import { AddPaymentComponent } from './components/_employed/receipt-list/crud/add-payment/add-payment.component';
import { ChangeReceiptStatusComponent } from './components/_employed/receipt-list/crud/change-receipt-status/change-receipt-status.component';
import { RentCompleteUpdateKmComponent } from './components/_employed/rent-list/crud/rent-complete-update-km/rent-complete-update-km.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
	bgsColor: '#95B7FF',
	fgsColor: '#7FC849',
	overlayColor: '#00000000',
	bgsPosition: POSITION.bottomLeft,
	bgsSize: 50,
	bgsType: SPINNER.chasingDots, // background spinner type
	fgsType: SPINNER.cubeGrid, // foreground spinner type
	pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
	pbColor: '#7FC849',
	pbThickness: 2, // progress bar thickness
	maxTime: MAX_LOADER_SHOW,
};

@NgModule({
	declarations: [
		TruncatePipe,
		AppComponent,
		NavComponent,
		FooterComponent,
		HeaderComponent,
		HomeComponent,
		VehicleComponent,
		RentVehicleComponent,
		LoginComponent,
		RegisterComponent,
		LoginDialogComponent,
		LoginPageComponent,
		ProfilePageComponent,
		StatusIconComponent,
		EditProfileComponent,
		RegisterPageComponent,
		DashboardPageComponent,
		RentListComponent,
		ViewRentComponent,
		AddRentComponent,
		ChangeStatusRentComponent,
		VehicleListComponent,
		InsertUpdateVehicleComponent,
		ChangeStatusVehicleComponent,
		ViewVehicleComponent,
		UserListComponent,
		UpdateUserComponent,
		RentComponent,
		ReceiptListComponent,
		InsertEditReceiptComponent,
		AddPaymentComponent,
		ChangeReceiptStatusComponent,
		RentCompleteUpdateKmComponent,
	],
	imports: [
		DropdownModule,
		TableModule,
		InputMaskModule,
		TooltipModule,
		MenubarModule,
		NgxFormErrorModule,
		ListboxModule,
		CheckboxModule,
		DynamicDialogModule,
		ConfirmPopupModule,
		ToastModule,
		NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
		NgxUiLoaderRouterModule.forRoot({ showForeground: false }),
		ScrollingModule,
		KeyFilterModule,
		AutoCompleteModule,
		BrowserAnimationsModule,
		CalendarModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		ToolbarModule,
		RippleModule,
		ButtonModule,
		BrowserModule,
		AppRoutingModule,
		InputTextModule,
		InputNumberModule,
		SliderModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AppHttpInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true,
		},
		ConfirmationService,
		MessageService,
	],
	entryComponents: [RentCompleteUpdateKmComponent, InsertEditReceiptComponent, AddPaymentComponent, ChangeReceiptStatusComponent, UpdateUserComponent, InsertUpdateVehicleComponent, ChangeStatusVehicleComponent, ViewVehicleComponent, ChangeStatusRentComponent, ViewRentComponent, AddRentComponent, LoginComponent, EditProfileComponent],
	bootstrap: [AppComponent],
})
export class AppModule {}
