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
    this.configApi.getGlobalData().subscribe(
      (resp: any) => {
        this.todaysRate = resp.body[0]['todayStdRate'];
        this.carryCharge = resp.body[0]['carryRate'];
        this.weightCutting = resp.body[0]['weightCutting'];
        this.spinner.hide();
        if (!this.todaysRate) {
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
    if (!this.todaysRate) {
      this.toastr.error('Please Enter Valid Data');
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
        "id": 1,
        "todayStdRate": Number(this.todaysRate) ? Number(this.todaysRate) : null,
        "carryRate": Number(this.carryCharge) ? Number(this.carryCharge) : 10,
        "weightCutting": Number(this.weightCutting) ? Number(this.weightCutting) : 2
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
}