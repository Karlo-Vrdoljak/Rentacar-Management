import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/user/register/register.component';
import { RentVehicleComponent } from './components/vehicle/rent-vehicle/rent-vehicle.component';
import { HomeComponent } from './components/_pages/home/home.component';
import { LoginPageComponent } from './components/_pages/login-page/login-page.component';
import { ProfilePageComponent } from './components/_pages/profile-page/profile-page.component';
import { HomeResolver } from './_resolvers/home.resolver';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { RentVehicleResolver } from './_resolvers/rentVehicle.resolver';

const routes: Routes = [
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'vehicle/rent/:pkVehicle', component: RentVehicleComponent, resolve: { pageData: RentVehicleResolver } },
	{ path: 'profile/:pkUser', component: ProfilePageComponent, resolve: { pageData: ProfileResolver } },
	{ path: 'home', component: HomeComponent, resolve: { pageData: HomeResolver } },
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
