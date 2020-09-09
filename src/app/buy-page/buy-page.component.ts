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
  cashPayment: any = 0;
  chequeAmount: any = 0;

  standardCarrying: any = 10;
  standardRate: any = 0;
  standardWeightCut: any = 2;

  isCustomerNameValid: any = false;
  isMoistureValid: any = false;
  isTotalBagsValid: any = false;
  isAllFieldsCalculated: any = true;
  isChequeNumberBox: any = false;
  isCashPaymentValid: any = false;

  editBill: any = '';
  isPrintBill: Boolean = false;
  customerBillId: any = null;
  centerName: any = '';
  isPrint: any = false;
  forShowOnly: any = null;
  constructor(private configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) {
    // router.events.subscribe((val) => {
    //   console.log(val instanceof NavigationEnd)
    // });
  }

  getGlobalData = () => {
    this.spinner.show();
    this.configApi.getGlobalData().subscribe(
      (resp: any) => {
        this.standardRate = resp.body[0]['todayStdRate'];
        this.standardCarrying = resp.body[0]['carryRate'];
        this.standardWeightCut = resp.body[0]['weightCutting'];
        this.spinner.hide();
        if (!this.standardRate) {
          this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
          this.router.navigate(['page-not-found']);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
        this.router.navigate(['page-not-found']);
      }
    );
  }

  ngOnInit() {
    this.editBill = this.configApi.getData();
    this.isPrintBill = this.configApi.fromPrintBill();

    if (this.editBill || this.isPrintBill) {
      if (this.isPrintBill) {
        this.printBill();
        this.configApi.toPrintBill(false);
      }
      this.setEditBillData(this.editBill);
    } else {
      this.getTodaysDate();
      this.getGlobalData();
    }
    const _lsUserData = JSON.parse(localStorage.getItem('currentUser'));
    this.centerName = _lsUserData.center;
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
    this.cashPayment = editBill.cashPayment;
    this.chequeAmount = editBill.chequeAmount;
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
    if (this.isChequePayment && !this.chequeNumberBox) {
      this.toastr.warning('Please Add Cheque Number', '', { timeOut: 1200 });
      this.isChequeNumberBox = true;
    } else {
      if (this.isAllFieldsCalculated) {
        this.toastr.warning('Please Calculate The Bill Before Saving', '', { timeOut: 1200 });
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
          'cashPayment': this.cashPayment,
          'chequeAmount': this.chequeAmount,
          'chequeNumber': this.isChequePayment ? this.chequeNumberBox : null
        };

        if (!this.customerBillId) {
          this.configApi.saveCustomerBill(request).subscribe(
            resp => {
              this.spinner.hide();
              this.clearData();
              this.toastr.success('Data saved successfully', '', { timeOut: 1200 });
            },
            error => {
              this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
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
              this.toastr.success('Data Updated Successfully', '', { timeOut: 1200 });
            },
            error => {
              this.toastr.error('Something Went Wrong', '', { timeOut: 1200 });
              // this.router.navigate(['page-not-found']);
              this.spinner.hide();
            }
          );
        }
        this.configApi.setData('');
      }
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
    this.chequeAmount = 0;
    this.cashPayment = 0;
    this.commentsOnBill = '';
    this.chequeNumberBox = '';
    this.isChequePayment = false;
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
    return Number((stdRate - (totalMoist - 10) * ((stdRate + 200) / 100)).toFixed(0));
  }

  cashPaymentChange = (event, cashPayment) => {
    if (!isNaN(cashPayment)) {
      if (Number(cashPayment) > Number(this.netPayAmount)) {
        this.isCashPaymentValid = true;
        this.toastr.error('Please Enter Valid Amount', '', { timeOut: 1200 });
      } else {
        this.cashPayment = Number(cashPayment);
        this.chequeAmount = Number(this.netPayAmount) - this.cashPayment;
        this.isChequePayment = !!Number(this.chequeAmount);
      }
    } else {
      this.cashPayment = 0;
      this.chequeAmount = Number(this.netPayAmount) - this.cashPayment;
    }
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
    this.totalAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(0));
  }

  calculateCarryCharges = () => {
    const decimalVal = Number(this.totalBags) * Number(this.standardCarrying);
    this.carryCharge = Number((Math.round(decimalVal * 100) / 100).toFixed(0));
  }

  calculateNetAmount = () => {
    const decimalVal = this.totalAmount - this.carryCharge;
    this.netPayAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(0));
    this.chequeAmount = this.netPayAmount - Number(this.cashPayment);
  }

  calculateBill = () => {
    this.emptyWeightList(this.bagWeightList);
    if (this.validateForm()) {
      const totalBagWeight = this.bagWeightList.map(item => item.weight).reduce((prev, next) => prev + next);
      this.totalWeight = totalBagWeight;
      this.calculateCutting();
      this.calculateNettWeight();
      this.calculateCarryCharges();
      this.calculateNetAmount();
      this.isAllFieldsCalculated = false;

      if (this.chequeAmount && !this.isChequePayment) {
        this.isChequePayment = true;
      }
    }

  }

  emptyWeightList = (wtList) => {
    let list = wtList.filter(item => {
      return item.weight
    });
    this.bagWeightList = list;
    this.totalBags = this.bagWeightList.length
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

    if (Number(this.cashPayment) > Number(this.netPayAmount)) {
      this.isCashPaymentValid = true;
      isValid = false;
    }
    // let isListhasZero;
    // if (this.bagWeightList.length) {
    //   isListhasZero = this.bagWeightList.find(item => {
    //     return !item.weight;
    //   });
    //   if (isListhasZero) {
    //     isValid = false;
    //   }
    // }

    if (!isValid) {
      this.toastr.warning('Please Check Highlighted Fields', '', { timeOut: 1200 });
    }
    return isValid;
  }

  onTotalBagsChange = (event, bags) => {
    let numBags = Number(bags);
    if (numBags > this.bagWeightList.length && this.bagWeightList.length) {
      for (let index = 0; index < numBags; index++) {
        let isItemPresent = this.bagWeightList.find(itm => {
          return itm.id === (index + 1);
        });
        if (!isItemPresent) {
          this.bagWeightList.push({
            'id': index + 1,
            'weight': 0
          });
        }
      }
    } else if (numBags < this.bagWeightList.length && this.bagWeightList.length) {
      let diff = this.bagWeightList.length - numBags;
      for (let index = 0; index < diff; index++) {
        this.bagWeightList.pop(index);
      }
    } else {
      for (let index = 0; index < Number(bags); index++) {
        this.bagWeightList.push({
          'id': index + 1,
          'weight': 0
        });
      }
    }
    console.log(this.bagWeightList);
  }

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
    this.router.navigate(['customers']);
  }
}
