import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const serverUrl = 'http://shingaretraders.co.in/soyaapp/';
// const baseUrl = 'http://localhost:3000/';
// const getGlobalData = `${baseUrl}globalData`;
// const setGlobalData = `${baseUrl}globalData`;
// const saveCustomerBill = `${baseUrl}buyCustomerList`;
// const customerList = `${baseUrl}buyCustomerList?_sort=id&_order=DESC`;
// const updateCustomerBill = `${baseUrl}buyCustomerList`;

// const saveSellBill = `${baseUrl}sellList`;
// const updateSellBill = `${baseUrl}sellList`;
// const sellBillList = `${baseUrl}sellList?_sort=id&_order=DESC`;

@Injectable({
  providedIn: 'root'
})

export class WebApiService {
  constructor(private http: HttpClient) { }

  getGlobalData(request): Observable<HttpResponse<[]>> {
    return this.http.post<[]>(
      `${serverUrl}get_std_rates.php`, request, { observe: 'response' })
  }

  getCenters(): Observable<HttpResponse<[]>> {
    return this.http.get<[]>(
      `${serverUrl}getcenter.php`, { observe: 'response' })
  }
  userLogin = (request) => {
    return this.http.post<[]>(
      `${serverUrl}signin.php`, request, { observe: 'response' })
  }
  setGlobalData = (request) => {
    return this.http.post<[]>(
      `${serverUrl}save_std_rate.php`, request, { observe: 'response' })
  }

  saveCustomerBill = (request) => {
    return this.http.post<[]>(
      `${serverUrl}save_customer_soya.php`, request, { observe: 'response' })
  }

  updateCustomerBill = (request) => {
    return this.http.post<[]>(
      `${serverUrl}update_customer_soya.php`, request, { observe: 'response' })
  }

  searchCustomers = (request) => {
    return this.http.post<[]>(
      `${serverUrl}get_cust_soya.php`, request, { observe: 'response' })
  }
  saveSellBill = (request) => {
    return this.http.post<[]>(
      `${serverUrl}save_sell_soya.php`, request, { observe: 'response' })
  }

  updateSellBill = (request) => {
    return this.http.post<[]>(
      `${serverUrl}update_sell_soya.php`, request, { observe: 'response' })
  }

  sellBillList = (request) => {
    return this.http.post<[]>(
      `${serverUrl}get_sell_soya.php`, request, { observe: 'response' })
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

