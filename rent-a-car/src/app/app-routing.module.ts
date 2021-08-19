import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/user/register/register.component';
import { RentVehicleComponent } from './components/vehicle/rent-vehicle/rent-vehicle.component';
import { HomeComponent } from './components/_pages/home/home.component';
import { LoginPageComponent } from './components/_pages/login-page/login-page.component';
import { HomeResolver } from './_resolvers/home.resolver';
import { RentVehicleResolver } from './_resolvers/rentVehicle.resolver';

const routes: Routes = [
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'vehicle/rent/:pkVehicle', component: RentVehicleComponent, resolve: { pageData: RentVehicleResolver } },
	{ path: '', component: HomeComponent, resolve: { pageData: HomeResolver } },
	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
