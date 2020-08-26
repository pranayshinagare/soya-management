import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SellPageComponent } from './sell-page/sell-page.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { StockCheckComponent } from './stock-check/stock-check.component';
import { NumberDirective } from 'src/directives/directive.numberOnly';
import { NgbPaginationModule, NgbAlertModule, NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SellListComponent } from './sell-list/sell-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BuyPageComponent,
    SellPageComponent,
    SettingsComponent,
    HomeComponent,
    CustomerListComponent,
    StockCheckComponent,
    NumberDirective,
    SellListComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    NgxSpinnerModule
  ],
  providers: [NumberDirective, NgbDatepicker],
  bootstrap: [AppComponent]
})
export class AppModule { }
