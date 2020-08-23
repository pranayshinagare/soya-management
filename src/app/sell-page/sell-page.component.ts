import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.scss']
})
export class SellPageComponent implements OnInit {
  customerName: any = '';
  vehicleNumber: any = '';
  todaysDate: any = '';
  totalBags: any = 0;
  totalWeight: any = 0;
  totalCutting: any = 0;
  netWeight: any = 0;
  totalAmount: any = 0;
  standardSellRate: any = 4000;
  carryCharge: any = 0;
  netPayAmount: any = 0;
  commentsOnSell: any = '';
  sellSoyaFormData: any = {};
  weightCuting: any = 0;
  constructor() { }

  ngOnInit() {
    this.getTodaysDate();
  }
  onTotalBagChange = (event, totalBags) => {
    this.totalBags = Number(totalBags);
  }
  onTotalWeightChange = (event, totalWeight) => {
    this.totalWeight = Number(totalWeight);
  }
  onTotalWeightCutting = (event, totalCutting) => {
    this.totalCutting = Number(totalCutting);
  }
  onCarryChargeChange = (event, carryCharge) => {
    this.carryCharge = Number(carryCharge);
  }
  calculateBill = () => {
    this.netWeight = this.totalWeight - this.totalCutting;
    const decimalVal = (this.netWeight * this.standardSellRate) / 100;
    this.totalAmount = Number((Math.round(decimalVal * 100) / 100).toFixed(2));
    this.netPayAmount = this.totalAmount - this.carryCharge;
    console.log(this.sellSoyaFormData);
  }
  getTodaysDate = () => {
    var today: any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    this.todaysDate = today;
  }
}
