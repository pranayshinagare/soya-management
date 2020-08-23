import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SellPageComponent } from './sell-page/sell-page.component';
import { SettingsComponent } from './settings/settings.component';
import { StockCheckComponent } from './stock-check/stock-check.component';
import { SellListComponent } from './sell-list/sell-list.component';


const routes: Routes = [
  { path: 'customers', component: CustomerListComponent },
  { path: 'buy-soyabean', component: BuyPageComponent },
  { path: 'sell-soyabean', component: SellPageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'stock', component: StockCheckComponent },
  { path: 'stock', component: StockCheckComponent },
  { path: 'sell-list', component: SellListComponent },
  { path: '',   redirectTo: '/customers', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
