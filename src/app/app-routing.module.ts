import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SellPageComponent } from './sell-page/sell-page.component';
import { SettingsComponent } from './settings/settings.component';
import { StockCheckComponent } from './stock-check/stock-check.component';
import { SellListComponent } from './sell-list/sell-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';

// const routes: Routes = [
//   { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuard] },
//   { path: 'buy-soyabean', component: BuyPageComponent, canActivate: [AuthGuard] },
//   { path: 'sell-soyabean', component: SellPageComponent, canActivate: [AuthGuard] },
//   { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
//   { path: 'stock', component: StockCheckComponent, canActivate: [AuthGuard] },
//   { path: 'stock', component: StockCheckComponent, canActivate: [AuthGuard] },
//   { path: 'sell-list', component: SellListComponent, canActivate: [AuthGuard] },
//   { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuard] },
//   { path: 'login', component: LoginComponent },
//   { path: '', component: CustomerListComponent, canActivate: [AuthGuard] },
//   { path: '**', redirectTo: '' }
// ];
const routes: Routes = [
  { path: 'customers', component: CustomerListComponent },
  { path: 'buy-soyabean', component: BuyPageComponent },
  { path: 'sell-soyabean', component: SellPageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'stock', component: StockCheckComponent },
  { path: 'stock', component: StockCheckComponent },
  { path: 'sell-list', component: SellListComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
