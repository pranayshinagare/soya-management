import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../web.api.services';
import { FormControl, FormsModule, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-buy-page',
  templateUrl: './buy-page.component.html',
  styleUrls: ['./buy-page.component.scss']
})
export class BuyPageComponent implements OnInit {
  moisture: any = '';
  customerName: any = '';
  totalBags: any = '';
  calculatedRate: any = 0;
  bagWeightList: any = [];
  totalWeight: any = 0;
  weightExtraCuting: any = 0;
  todaysDate: any = '';
  weightCutting: any = 0;
  netWeight: any = 0;
  totalAmount: any = 0;
  carryCharge: any = 0;
  netPayAmount: any = 0;
  commentsOnBill: any = '';
  billNumber: any = '';
  chequeNumberBox: any = '';
  isChequePayment: any = false;

  standardCarrying: any = 10;
  standardRate: any = 0;
  standardWeightCut: any = 2;

  isCustomerNameValid: any = false;
  isMoistureValid: any = false;
  isTotalBagsValid: any = false;
  isAllFieldsCalculated: any = true;
  isChequeNumberBox: any = false;

  editBill: any = '';
  customerBillId: any = null;
  constructor(private configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) {
    // router.events.subscribe((val) => {
    //   console.log(val instanceof NavigationEnd)
    // });
  }

  getGlobalData = () => {
    this.spinner.show();
    this.configApi.getGlobalData().subscribe(
      resp => {
        this.standardRate = resp.body['todayStdRate'];
        this.standardCarrying = resp.body['carryRate'];
        this.standardWeightCut = resp.body['weightCutting'];
        this.spinner.hide();
        if (!this.standardRate) {
          this.toastr.error('Something Went Wrong');
          this.router.navigate(['page-not-found']);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Something Went Wrong');
        this.router.navigate(['page-not-found']);
      }
    );
  }

  ngOnInit() {
    this.editBill = this.configApi.getData();
    if (this.editBill) {
      this.setEditBillData(this.editBill);
    } else {
      this.getTodaysDate();
      this.getGlobalData();
    }
  }

  setEditBillData = (editBill) => {
    this.billNumber = editBill.id;
    this.customerBillId = editBill.id;
    this.todaysDate = editBill.date;
    this.standardRate = editBill.standardRate;
    this.customerName = editBill.customerName;
    this.moisture = editBill.moisture;
    this.calculatedRate = editBill.calculatedRate;
    this.totalBags = editBill.totalBags;
    this.bagWeightList = editBill.bagWeightList;
    this.totalWeight = editBill.totalWeight;
    this.weightCutting = editBill.weightCutting;
    this.weightExtraCuting = editBill.weightExtraCuting;
    this.netWeight = editBill.netWeight;
    this.totalAmount = editBill.totalAmount;
    this.carryCharge = editBill.carryCharge;
    this.netPayAmount = editBill.netPayAmount;
    this.commentsOnBill = editBill.comments;
    this.isChequePayment = editBill.chequeMode;
    this.chequeNumberBox = editBill.chequeNumber;
    this.isAllFieldsCalculated = false;
  }

  onBagWeightChange = (event, item) => {
    this.bagWeightList.forEach((datum) => {
      if (item.id == datum.id) {
        let val = event.target.value ? event.target.value : 0;
        datum.weight = parseInt(val)
      }
    });
  }

  submitCalculatedForm = (event) => {
    if (this.isAllFieldsCalculated) {
      this.toastr.warning('Please Calculate The Bill Before Saving');
    } else {
      this.spinner.show();
      const request = {
        'date': this.todaysDate,
        'customerBillId': this.customerBillId ? this.customerBillId : null,
        'id': this.customerBillId ? this.customerBillId : null,
        'standardRate': this.standardRate,
        'customerName': this.customerName,
        'moisture': Number(this.moisture),
        'calculatedRate': this.calculatedRate,
        'totalBags': Number(this.totalBags),
        'bagWeightList': this.bagWeightList,
        'totalWeight': this.totalWeight,
        'weightCutting': this.weightCutting,
        'weightExtraCuting': Number(this.weightExtraCuting),
        'netWeight': this.netWeight,
        'totalAmount': this.totalAmount,
        'carryCharge': this.carryCharge,
        'netPayAmount': this.netPayAmount,
        'comments': this.commentsOnBill,
        'chequeMode': this.isChequePayment,
        'chequeNumber': this.isChequePayment ? this.chequeNumberBox : null
      };

      if (!this.customerBillId) {
        this.configApi.saveCustomerBill(request).subscribe(
          resp => {
            this.spinner.hide();
            this.clearData();
            this.toastr.success('Data saved successfully');
          },
          error => {
            this.toastr.error('Something Went Wrong');
            // this.clearData();
            // this.router.navigate(['page-not-found']);
            this.spinner.hide();
          }
        );
      } else {
        this.configApi.updateCustomerBill(request).subscribe(
          resp => {
            this.spinner.hide();
            this.clearData();
            this.router.navigate(['customers']);
            this.toastr.success('Data Updated Successfully');
          },
          error => {
            this.toastr.error('Something Went Wrong');
            // this.router.navigate(['page-not-found']);
            this.spinner.hide();
          }
        );
      }
      this.configApi.setData('');
    }
  }

  clearData = () => {
    this.moisture = '';
    this.customerName = '';
    this.totalBags = '';
    this.calculatedRate = 0;
    this.bagWeightList = [];
    this.totalWeight = 0;
    this.weightExtraCuting = 0;
    this.weightCutting = 0;
    this.netWeight = 0;
    this.totalAmount = 0;
    this.carryCharge = 0;
    this.netPayAmount = 0;
    this.commentsOnBill = '';
    // reset date and standard rate
    this.getTodaysDate();
    this.getGlobalData();
  }

  getTodaysDate = () => {
    var today: any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    this.todaysDate = today;
  }

  onMoistureChange = (event, moisture) => {
    if (!isNaN(moisture) && /\S/.test(moisture)) {
      this.calculatedRate = this.calculateActualRate(this.standardRate, Number(moisture));
    } else {
      this.moisture = 0;
      this.calculatedRate = 0;
    }
  }

  calculateActualRate = (stdRate, moisture) => {
    const moistNum = Number(moisture);
    let totalMoist = moistNum;
    if (moistNum > 18) {
      const doubleMoist = moistNum - 18;
      totalMoist = (doubleMoist * 2) + 18;
    } else if (moistNum < 10) {
      totalMoist = 10;
    }
    return stdRate - (totalMoist - 10) * ((stdRate + 200) / 100);
  }

  calculateCutting = () => {
    this.weightCutting = (this.totalWeight / 100) * Number(this.standardWeightCut);
  }

  calculateNettWeight = () => {
    const actWeight = this.totalWeight - this.weightCutting;
    const actCutWeight = isNaN(this.weightExtraCuting) ? 0 : this.weightExtraCuting;
    this.netWeight = actWeight - Number(actCutWeight);
    this.calculateTotalAmount();
  }

  calculateTotalAmount = () => {
    const decimalVal = (this.netWeight * this.calculatedRate) / 100;
    this.totalAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(2));
  }

  calculateCarryCharges = () => {
    const decimalVal = Number(this.totalBags) * Number(this.standardCarrying);
    this.carryCharge = Number((Math.round(decimalVal * 100) / 100).toFixed(2));
  }

  calculateNetAmount = () => {
    const decimalVal = this.totalAmount - this.carryCharge;
    this.netPayAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(2));
  }

  calculateBill = () => {
    if (this.validateForm()) {
      const totalBagWeight = this.bagWeightList.map(item => item.weight).reduce((prev, next) => prev + next);
      this.totalWeight = totalBagWeight;
      this.calculateCutting();
      this.calculateNettWeight();
      this.calculateCarryCharges();
      this.calculateNetAmount();
      this.isAllFieldsCalculated = false;
    }
  }

  validateForm = () => {
    let isValid = true;
    if (!this.customerName) {
      this.isCustomerNameValid = true;
      isValid = false;
    }
    if (!this.moisture) {
      this.isMoistureValid = true;
      isValid = false;
    }
    if (!this.totalBags) {
      this.isTotalBagsValid = true;
      isValid = false;
    }

    if (this.isChequePayment) {
      if (!this.chequeNumberBox) {
        this.isChequeNumberBox = true;
        isValid = false;
      }
    }

    let isListhasZero;
    if (this.bagWeightList.length) {
      isListhasZero = this.bagWeightList.find(item => {
        return !item.weight;
      });
      if (isListhasZero) {
        isValid = false;
      }
    }

    if (!isValid) {
      this.toastr.warning('Please Check Highlighted Fields');
    }
    return isValid;
  }

  onTotalBagsChange = (event, bags) => {
    this.bagWeightList = [];
    for (let index = 0; index < Number(bags); index++) {
      this.bagWeightList.push({
        'id': index + 1,
        'weight': 0
      });
    }
  }
  printBill = () => {
    window.print();
  }
  cancelForm = () => {
    window.location.reload();
  }
}
