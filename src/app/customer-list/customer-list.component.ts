import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { WebApiService } from '../web.api.services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  billNumber: any = '';
  fromdDate: any = '';
  toDate: any = '';
  customerName: any = '';
  customerData: any = [];
  customerDataPage = 1;
  customerDataPageSize = 10;

  constructor(private calendar: NgbCalendar, public configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }
  clearSelection = (event) => {
    this.billNumber = '';
    this.fromdDate = '';
    this.toDate = '';
    this.customerName = '';
  }

  getCustomerList = () => {
    const request = {
      'billNumber': this.billNumber,
      'fromdDate': this.fromdDate,
      'toDate': this.toDate,
      'customerName': this.customerName
    }
    this.spinner.show();
    this.configApi.searchCustomers(request).subscribe(
      resp => {
        this.customerData = resp.body;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.customerData = [];
        this.toastr.error('Something Went Wrong');
      }
    );
  }

  viewBill = (currentBill) => {
    this.configApi.setData(currentBill);
    this.router.navigate(['buy-soyabean']);
  }

  ngOnInit() {
    this.getCustomerList();
  }

}
