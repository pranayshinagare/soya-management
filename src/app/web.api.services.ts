import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const baseUrl = 'http://localhost:3000/';
const getGlobalData = `${baseUrl}globalData`;
const setGlobalData = `${baseUrl}globalData`;
const saveCustomerBill = `${baseUrl}buyCustomerList`;
const customerList = `${baseUrl}buyCustomerList?_sort=id&_order=DESC`;
const updateCustomerBill = `${baseUrl}buyCustomerList`;

const saveSellBill = `${baseUrl}sellList`;
const updateSellBill = `${baseUrl}sellList`;
const sellBillList = `${baseUrl}sellList?_sort=id&_order=DESC`;

@Injectable({
  providedIn: 'root'
})

export class WebApiService {
  constructor(private http: HttpClient) { }

  getGlobalData(): Observable<HttpResponse<[]>> {
    return this.http.get<[]>(
      `${getGlobalData}`, { observe: 'response' })
  }

  setGlobalData = (request) => {
    // this.http.post(setGlobalData, request)
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => {
    //       console.log("Error occured");
    //     }
    //   );
    return this.http.put<[]>(
      `${setGlobalData}/${request.id}`, request, { observe: 'response' })
    // return this.http.put<[]>(
    //   setGlobalData, request, { observe: 'response' })
  }

  saveCustomerBill = (request) => {
    return this.http.post<[]>(
      saveCustomerBill, request, { observe: 'response' })
  }

  updateCustomerBill = (request) => {
    return this.http.put<[]>(
      `${updateCustomerBill}/${request.id}`, request, { observe: 'response' })
  }

  searchCustomers = (request) => {
    return this.http.get<[]>(
      customerList, { observe: 'response' })
  }
  saveSellBill = (request) => {
    return this.http.post<[]>(
      saveSellBill, request, { observe: 'response' })
  }

  updateSellBill = (request) => {
    return this.http.put<[]>(
      `${updateSellBill}/${request.id}`, request, { observe: 'response' })
  }

  sellBillList = (request) => {
    return this.http.get<[]>(
      sellBillList, { observe: 'response' })
  }

  componentData = '';
  setData = (data) => {
    this.componentData = data;
  }

  getData = () => {
    return this.componentData;
  }

  isPrintBill = false;
  toPrintBill = (isPrint) => {
    this.isPrintBill = isPrint;
  }

  fromPrintBill = () => {
    return this.isPrintBill;
  }
}

