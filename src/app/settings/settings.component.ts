import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../web.api.services';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

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
  constructor(private router: Router, private configApi: WebApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.getTodaysDate();
    this.getGlobalData();
  }
  getGlobalData = () => {
    this.spinner.show();
    const req = {
      'centerid': localStorage.getItem('centerId')
    }
    this.configApi.getGlobalData(req).subscribe(
      (resp: any) => {
        if (resp.body['success']) {
          this.todaysRate = resp.body['body'][resp.body['body'].length-1]['todayStdRate'];
          this.carryCharge = resp.body['body'][resp.body['body'].length-1]['carryRate'];
          this.weightCutting = resp.body['body'][resp.body['body'].length-1]['weightCutting'];
        } else {
          this.toastr.error(resp.body['error'], '', { timeOut: 1200 });
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.body['error'], '', { timeOut: 1200 });
      }
    );
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
      this.toastr.error('Please Enter Valid Data', '', { timeOut: 1200 });
      isValid = false;
    }
    return isValid;
  }
  clearData = () => {
    this.todaysDate = '';
    this.todaysRate = '';
    this.carryCharge = '';
    this.weightCutting = '';
  }
  submitData = () => {
    if (!!this.validateFields()) {
      this.btnDisableFlag = true;
      this.spinner.show();
      const req = {
        "centerid": localStorage.getItem('centerId'),
        "todayStdRate": Number(this.todaysRate) ? Number(this.todaysRate) : null,
        "carryRate": Number(this.carryCharge) ? Number(this.carryCharge) : 10,
        "weightCutting": Number(this.weightCutting) ? Number(this.weightCutting) : 2
      }

      this.configApi.setGlobalData(req).subscribe(
        resp => {
          if (resp.body['success']) {
            this.toastr.success(resp.body['message'], '', { timeOut: 1200 });
          } else {
            this.toastr.error(resp.body['error'], '', { timeOut: 1200 });
          }
          this.spinner.hide();
          this.btnDisableFlag = false;
        },
        error => {
          this.toastr.error(error.body['error'], '', { timeOut: 1200 });
          this.btnDisableFlag = false;
          this.spinner.hide();
        }
      );
    }
  }
}