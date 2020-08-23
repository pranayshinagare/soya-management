import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sell-list',
  templateUrl: './sell-list.component.html',
  styleUrls: ['./sell-list.component.scss']
})
export class SellListComponent implements OnInit {
  // fromdDate: NgbDateStruct;
  // date: {year: number, month: number};
  billNumber: any = '';
  fromdDate: any = '';
  toDate: any = '';
  customerName: any = '';

  customerData: any = [
    {
      'billNo': '1001',
      'date': '10-08-2020',
      'customerName': 'Sadashiv Anand Jadhav',
      'rateOfMoisture': 3700,
      'moisture': 12.45,
      'rateToGive': 3560,
      'totalBags': 12,
      'totalWeight': 1230,
      'weightCutting': 24,
      'extraCutting': 0,
      'netWeight': 1216,
      'totalAmount': 40500,
      'carryCharges': 100,
      'netAmount': 40400
    },
    {
      'billNo': '1002',
      'date': '10-08-2020',
      'customerName': 'Vishwas Anand Adke',
      'rateOfMoisture': 3700,
      'moisture': 12.45,
      'rateToGive': 3560,
      'totalBags': 12,
      'totalWeight': 1230,
      'weightCutting': 24,
      'extraCutting': 0,
      'netWeight': 1216,
      'totalAmount': 40500,
      'carryCharges': 100,
      'netAmount': 40400
    },
    {
      'billNo': '1003',
      'date': '10-08-2020',
      'customerName': 'Srinath Krishna Patil',
      'rateOfMoisture': 3200,
      'moisture': 11.45,
      'rateToGive': 3160,
      'totalBags': 19,
      'totalWeight': 1930,
      'weightCutting': 39,
      'extraCutting': 0,
      'netWeight': 1800,
      'totalAmount': 70500,
      'carryCharges': 100,
      'netAmount': 60400
    }

  ]

  constructor(private calendar: NgbCalendar) { }
  clearSelection = (event) => {
    console.log(this);
    this.billNumber = '';
    this.fromdDate = '';
    this.toDate = '';
    this.customerName = '';
  }

  searchCustomers = () => {
    // api call 
  }

  ngOnInit(): void {
  }

}
