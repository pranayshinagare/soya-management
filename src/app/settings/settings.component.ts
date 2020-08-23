import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../web.api.services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  todaysDate: any = '';
  todaysRate: any = '';
  carryCharge: any = '';
  weightCutting: any = '';

  isRateValid: any = false;
  isCuttingValid: any = false;
  isCarryRateValid: any = false;

  btnDisableFlag: any = false;
  constructor(private configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.getTodaysDate();
  }

  getTodaysDate = () => {
    var today: any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    this.todaysDate = today;
  }

  validateFields = () => {
    let isValid = true;
    if (!this.todaysRate || !this.carryCharge || !this.weightCutting) {
      this.toastr.error('Please Enter Valid Data');
      isValid = false;
    }
    console.log('test valid')
    return isValid;
  }

  clearData = () => {
    this.todaysDate = '';
    this.todaysRate = '';
    this.carryCharge = '';
    this.weightCutting = '';
  }

  submitData = () => {
    this.btnDisableFlag = true;
    this.spinner.show();
    const req = {
      "todayStdRate": Number(this.todaysRate) ? Number(this.todaysRate) : null,
      "carryRate": Number(this.carryCharge) ? Number(this.carryCharge) : null,
      "weightCutting": Number(this.weightCutting) ? Number(this.weightCutting) : null
    }

    this.configApi.setGlobalData(req).subscribe(
      resp => {
        this.spinner.hide();
        this.toastr.success('Data saved successfully');
        this.btnDisableFlag = false;
      },
      error => {
        this.toastr.error('Something Went Wrong');
        this.btnDisableFlag = false;
        // this.clearData();
        this.spinner.hide();
      }
    );
  }
}