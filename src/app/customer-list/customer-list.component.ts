import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { WebApiService } from '../web.api.services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import exportFromJSON from 'export-from-json'

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
  centerId: any = '';
  constructor(private calendar: NgbCalendar, public configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }
  clearSelection = (event) => {
    this.billNumber = '';
    this.fromdDate = '';
    this.toDate = '';
    this.customerName = '';
  }

  createExcelData = (exData, fileName, exportType) => {
    let exceData = [];
    exData.forEach(element => {
      let wtList = [];
      element.bagWeightList.forEach(x => {
        wtList.push(x.weight);
      });
      let weightList = wtList.join(', ');
      const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
      // this.billNumber = `${localCurrentUser.centerId} ${editBill.id}`;
      exceData.push({
        'Bill No.': `${localCurrentUser.centerId} ${element.id}`,
        'Date': element.date,
        'Customer Name': element.customerName,
        'Total Bags': element.totalBags,
        'Moisture': element.moisture,
        'Std. Rate': element.standardRate,
        'Calc. Rate': element.calculatedRate,
        "Weights": weightList,
        'Total Weights': element.totalWeight,
        'Weight Cutting': element.weightCutting,
        'Extra Weight Cutting': element.weightExtraCuting,
        'Net Weight': element.netWeight,
        'Total Amount': element.totalAmount,
        'Hamali': element.carryCharge,
        'Net Payment': element.netPayAmount,
        'Cash Payment': element.cashPayment,
        'Cheque Payment': element.chequeAmount,
        'Cheque Number': element.chequeNumber ? element.chequeNumber : '',
        'Comments': element.comments
      });
    });
    const data = exceData;
    exportFromJSON({ data, fileName, exportType });
  }

  downloadDataExcel = () => {
    this.spinner.show();
    const fileName = 'customer_list';
    const exportType = 'xls';
    this.configApi.searchCustomers({}).subscribe(
      resp => {
        const data = resp.body;
        this.createExcelData(data, fileName, exportType);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
      }
    );
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
        const localCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.centerId = localCurrentUser.centerId;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.customerData = [];
        this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
      }
    );
  }

  printBill = (currentBill) => {
    const isBillPrint = true;
    this.configApi.toPrintBill(isBillPrint);
    this.configApi.setData(currentBill);
    this.router.navigate(['buy-soyabean']);
  }

  viewBill = (currentBill) => {
    this.configApi.setData(currentBill);
    this.router.navigate(['buy-soyabean']);
  }

  ngOnInit() {
    this.getCustomerList();
  }

}
