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
  gstOnSoya: any = 5;
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

  grandTotal: any = 0;
  calculatedCgstRs: any = 0;
  calculatedSgstRs: any = 0;
  customerAddress: any = '';
  customerState: any = '';
  stateCode: any = '';
  customerGstNumber: any = '';

  isVehicleNumber: any = false;
  isStandardSellRate: any = false;
  isCustomerNameValid: any = false;
  isTotalBagsValid: any = false;
  isTotalWeight: any = false;
  isAllFieldsCalculated: any = true;

  isCustomerAddressValid: any = false;
  isCustomerStateValid: any = false;
  isStateCodeValid: any = false;
  isCustomerGstNumberValid: any = false;

  editBill: any = '';
  centerName: any = '';
  isPrint: any = false;
  forShowOnly: any = null;
  constructor(private configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    this.editBill = this.configApi.getData();
    if (this.editBill) {
      this.setEditBillData(this.editBill);
    } else {
      this.getTodaysDate();
    }
    const _lsUserData = JSON.parse(localStorage.getItem('currentUser'));
    this.centerName = _lsUserData.center;
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
    this.grandTotal = editBill.grandTotal;
    this.calculatedCgstRs = editBill.calculatedCgstRs;
    this.calculatedSgstRs = editBill.calculatedSgstRs;
    this.customerAddress = editBill.customerAddress;
    this.customerState = editBill.customerState;
    this.stateCode = editBill.stateCode;
    this.customerGstNumber = editBill.customerGstNumber;
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
      this.totalAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(0));
      this.netPayAmount = this.totalAmount - this.carryCharge;
      this.calculatedCgstRs = Number((this.netPayAmount * ((this.gstOnSoya / 2) / 100)).toFixed(0));
      this.calculatedSgstRs = Number((this.netPayAmount * ((this.gstOnSoya / 2) / 100)).toFixed(0));
      this.grandTotal = this.calculatedCgstRs + this.calculatedSgstRs + this.netPayAmount;
      this.isAllFieldsCalculated = false;
    }
  }

  submitCalculatedForm = () => {
    if (this.isAllFieldsCalculated) {
      this.toastr.warning('Please Calculate The Bill Before Saving', '', { timeOut: 1200 });
    } else {
      if (this.submitValidation()) {
        this.spinner.show();
        const request = {
          'date': this.todaysDate,
          'id': this.sellBillId ? this.sellBillId : null,
          'vehicleNumber': this.vehicleNumber,
          'standardRate': Number(this.standardSellRate),
          'customerName': this.customerName,
          'customerAddress': this.customerAddress,
          'customerState': this.customerState,
          'stateCode': this.stateCode,
          'customerGstNumber': this.customerGstNumber,
          'totalBags': Number(this.totalBags),
          'totalWeight': Number(this.totalWeight),
          'weightCutting': Number(this.totalCutting),
          'netWeight': this.netWeight,
          'totalAmount': this.totalAmount,
          'carryCharge': this.carryCharge,
          'netPayAmount': this.netPayAmount,
          'comments': this.commentsOnSell,
          'calculatedCgstRs': this.calculatedCgstRs,
          'calculatedSgstRs': this.calculatedSgstRs,
          'grandTotal': this.grandTotal
        };

        if (!this.sellBillId) {
          this.configApi.saveSellBill(request).subscribe(
            resp => {
              this.spinner.hide();
              this.clearData();
              this.toastr.success('Data saved successfully', '', { timeOut: 1200 });
            },
            error => {
              this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
              this.spinner.hide();
            }
          );
        } else {
          this.configApi.updateSellBill(request).subscribe(
            resp => {
              this.spinner.hide();
              this.clearData();
              this.router.navigate(['sell-list']);
              this.toastr.success('Data Updated Successfully', '', { timeOut: 1200 });
            },
            error => {
              this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
              this.spinner.hide();
            }
          );
        }
        this.configApi.setData('');
      }
    }
  }

  validateForm = () => {
    let isValid = true;

    if (!this.standardSellRate) {
      this.isStandardSellRate = true;
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
      this.toastr.warning('Please Check Highlighted Fields', '', { timeOut: 1200 });
    }
    return isValid;
  }

  submitValidation = () => {
    let isValid = true;

    if (!this.customerName) {
      this.isCustomerNameValid = true;
      isValid = false;
    }
    if (!this.vehicleNumber) {
      this.isVehicleNumber = true;
      isValid = false;
    }
    if (!this.customerAddress) {
      this.isCustomerAddressValid = true;
      isValid = false;
    }
    if (!this.customerState) {
      this.isCustomerStateValid = true;
      isValid = false;
    }
    if (!this.stateCode) {
      this.isStateCodeValid = true;
      isValid = false;
    }
    if (!this.customerGstNumber) {
      this.isCustomerGstNumberValid = true;
      isValid = false;
    }

    if (!isValid) {
      this.toastr.warning('Please Check Highlighted Fields', '', { timeOut: 1200 });
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

    this.grandTotal = 0;
    this.calculatedCgstRs = 0;
    this.calculatedSgstRs = 0;
    this.customerAddress = '';
    this.customerState = '';
    this.stateCode = '';
    this.customerGstNumber = '';
  }

  getTodaysDate = () => {
    var today: any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    this.todaysDate = today;
  }

  // document.getElementById('number').onkeyup = function () {
  //   document.getElementById('words').innerHTML = amountInWords(document.getElementById('number').value);
  // };
  amountInWords = (num) => {
    let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    let n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }

  printBill = () => {
    this.isPrint = true;
    setTimeout(() => {
      window.print();
      this.isPrint = false;
    });
  }
  cancelForm = () => {
    this.router.navigate(['sell-list']);
  }
}
