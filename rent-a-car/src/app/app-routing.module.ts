import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentVehicleComponent } from './components/vehicle/rent-vehicle/rent-vehicle.component';
import { DashboardPageComponent } from './components/_pages/dashboard-page/dashboard-page.component';
import { HomeComponent } from './components/_pages/home/home.component';
import { LoginPageComponent } from './components/_pages/login-page/login-page.component';
import { ProfilePageComponent } from './components/_pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/_pages/register-page/register-page.component';
import { EMPLOYED_ROLE, USER_ROLE } from './_consts/consts';
import { AuthGuard } from './_guards/auth.guard';
import { DashboardResolver } from './_resolvers/dashboard.resolver';
import { HomeResolver } from './_resolvers/home.resolver';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { RentVehicleResolver } from './_resolvers/rentVehicle.resolver';

const routes: Routes = [
	{ path: 'register', component: RegisterPageComponent },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'vehicle/rent/:pkVehicle', component: RentVehicleComponent, resolve: { pageData: RentVehicleResolver } },
	{ path: 'profile/:pkUser', canActivate: [AuthGuard], data: { roles: USER_ROLE }, component: ProfilePageComponent, resolve: { pageData: ProfileResolver } },
	{ path: 'dashboard', component: DashboardPageComponent, data: { roles: EMPLOYED_ROLE }, resolve: { pageData: DashboardResolver } },
	{ path: 'home', component: HomeComponent, resolve: { pageData: HomeResolver } },
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
