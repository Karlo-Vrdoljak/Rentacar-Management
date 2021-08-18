import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomeResolver } from './_resolvers/home.resolver';

const routes: Routes = [
	{ path: '', component: HomeComponent, resolve: { pageData: HomeResolver } },
	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
