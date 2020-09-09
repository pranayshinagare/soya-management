import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { WebApiService } from '../web.api.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import exportFromJSON from 'export-from-json'

@Component({
  selector: 'app-sell-list',
  templateUrl: './sell-list.component.html',
  styleUrls: ['./sell-list.component.scss']
})
export class SellListComponent implements OnInit {
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

  createExcelData = (exData, fileName, exportType) => {
    let exceData = [];
    exData.forEach(element => {
      exceData.push({
        'Bill No.': element.id,
        'Date': element.date,
        "Vehicle Number": element.vehicleNumber,
        'Invoice To': element.customerName,
        'Total Bags': element.totalBags,
        'Rate': element.standardRate,
        'Total Weight': element.totalWeight,
        'Sub Total': element.netPayAmount,
        "CGST": element.calculatedCgstRs,
        "SGST": element.calculatedSgstRs,
        "Grand Total": element.grandTotal,
        'Comments': element.comments
      });
    });
    const data = exceData;
    exportFromJSON({ data, fileName, exportType });
  }

  downloadDataExcel = () => {
    this.spinner.show();
    const fileName = 'sell_list';
    const exportType = 'xls';
    this.configApi.sellBillList({}).subscribe(
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
    this.configApi.sellBillList(request).subscribe(
      resp => {
        this.customerData = resp.body;
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
    this.router.navigate(['sell-soyabean']);
  }

  viewBill = (currentBill) => {
    this.configApi.setData(currentBill);
    this.router.navigate(['sell-soyabean']);
  }

  ngOnInit() {
    this.getCustomerList();
  }
}
