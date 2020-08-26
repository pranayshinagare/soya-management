import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, NavigationEnd } from '@angular/router';
import { WebApiService } from '../web.api.services';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.scss']
})
export class SellPageComponent implements OnInit {
  sellBillId: any = null;
  customerName: any = '';
  vehicleNumber: any = '';
  todaysDate: any = '';
  totalBags: any = 0;
  totalWeight: any = 0;
  totalCutting: any = 0;
  netWeight: any = 0;
  totalAmount: any = 0;
  standardSellRate: any = 0;
  carryCharge: any = 0;
  netPayAmount: any = 0;
  commentsOnSell: any = '';
  sellSoyaFormData: any = {};
  billNumber: any = '';

  isVehicleNumber: any = false;
  isStandardSellRate: any = false;
  isCustomerNameValid: any = false;
  isTotalBagsValid: any = false;
  isTotalWeight: any = false;
  isAllFieldsCalculated: any = true;
  editBill: any = '';
  constructor(private configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    this.editBill = this.configApi.getData();
    if (this.editBill) {
      this.setEditBillData(this.editBill);
    } else {
      this.getTodaysDate();
    }
  }

  setEditBillData = (editBill) => {
    this.billNumber = editBill.id;
    this.vehicleNumber = editBill.vehicleNumber;
    this.sellBillId = editBill.id;
    this.todaysDate = editBill.date || this.todaysDate;
    this.standardSellRate = editBill.standardRate;
    this.customerName = editBill.customerName;
    this.totalBags = editBill.totalBags;
    this.totalWeight = editBill.totalWeight;
    this.totalCutting = editBill.weightCutting;
    this.netWeight = editBill.netWeight;
    this.totalAmount = editBill.totalAmount;
    this.carryCharge = editBill.carryCharge;
    this.netPayAmount = editBill.netPayAmount;
    this.commentsOnSell = editBill.comments;
    this.isAllFieldsCalculated = false;
  }
  onTotalBagChange = (event, totalBags) => {
    if (isNaN(Number(totalBags))) {
      this.totalBags = 0;
    } else {
      this.totalBags = Number(totalBags);
    }
  }
  onTotalWeightChange = (event, totalWeight) => {
    if (isNaN(Number(totalWeight))) {
      this.totalWeight = 0;
    } else {
      this.totalWeight = Number(totalWeight);
    }
  }
  onTotalWeightCutting = (event, totalCutting) => {
    if (isNaN(Number(totalCutting))) {
      this.totalCutting = 0;
    } else {
      this.totalCutting = Number(totalCutting);
    }
  }
  onCarryChargeChange = (event, carryCharge) => {
    if (isNaN(Number(carryCharge))) {
      this.carryCharge = 0;
    } else {
      this.carryCharge = Number(carryCharge);
    }
  }

  calculateBill = () => {
    if (this.validateForm()) {
      this.netWeight = this.totalWeight - this.totalCutting;
      const decimalVal = (this.netWeight * Number(this.standardSellRate)) / 100;
      this.totalAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(2));
      this.netPayAmount = this.totalAmount - this.carryCharge;
      this.isAllFieldsCalculated = false;
    }
  }

  submitCalculatedForm = () => {
    if (this.isAllFieldsCalculated) {
      this.toastr.warning('Please Calculate The Bill Before Saving');
    } else {
      this.spinner.show();
      const request = {
        'date': this.todaysDate,
        // 'sellBillId': this.sellBillId ? this.sellBillId : null,
        'id': this.sellBillId ? this.sellBillId : null,
        'vehicleNumber': this.vehicleNumber,
        'standardRate': Number(this.standardSellRate),
        'customerName': this.customerName,
        'totalBags': Number(this.totalBags),
        'totalWeight': Number(this.totalWeight),
        'weightCutting': Number(this.totalCutting),
        'netWeight': this.netWeight,
        'totalAmount': this.totalAmount,
        'carryCharge': this.carryCharge,
        'netPayAmount': this.netPayAmount,
        'comments': this.commentsOnSell
      };

      if (!this.sellBillId) {
        this.configApi.saveSellBill(request).subscribe(
          resp => {
            this.spinner.hide();
            this.clearData();
            this.toastr.success('Data saved successfully');
          },
          error => {
            this.toastr.error('Something Went Wrong');
            this.spinner.hide();
          }
        );
      } else {
        this.configApi.updateSellBill(request).subscribe(
          resp => {
            this.spinner.hide();
            this.clearData();
            this.router.navigate(['sell-list']);
            this.toastr.success('Data Updated Successfully');
          },
          error => {
            this.toastr.error('Something Went Wrong');
            this.spinner.hide();
          }
        );
      }
      this.configApi.setData('');
    }
  }

  validateForm = () => {
    let isValid = true;
    if (!this.vehicleNumber) {
      this.isVehicleNumber = true;
      isValid = false;
    }
    if (!this.standardSellRate) {
      this.isStandardSellRate = true;
      isValid = false;
    }
    if (!this.customerName) {
      this.isCustomerNameValid = true;
      isValid = false;
    }
    if (!this.totalBags) {
      this.isTotalBagsValid = true;
      isValid = false;
    }
    if (!this.totalWeight) {
      this.isTotalWeight = true;
      isValid = false;
    }
    if (!isValid) {
      this.toastr.warning('Please Check Highlighted Fields');
    }
    return isValid;
  }

  onRateChange = (value) => {
    if (isNaN(Number(value))) {
      this.standardSellRate = 0;
    }
  }

  clearData = () => {
    this.customerName = '';
    this.totalBags = 0;
    this.totalWeight = 0;
    this.totalCutting = 0;
    this.netWeight = 0;
    this.totalAmount = 0;
    this.carryCharge = 0;
    this.netPayAmount = 0;
    this.commentsOnSell = '';
    this.sellBillId = null;
    this.vehicleNumber = null;
    this.standardSellRate = 0;
    this.getTodaysDate();
    this.isAllFieldsCalculated = true;
  }
  getTodaysDate = () => {
    var today: any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    this.todaysDate = today;
  }
  printBill = () => {
    window.print();
  }
  cancelForm = () => {
    window.location.reload();
  }
}
