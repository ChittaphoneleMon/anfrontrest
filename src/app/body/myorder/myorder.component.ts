import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit {
  dataMyorder: [] = []
  detailBill: object
  customerName: string
  constructor(public http: HttpClient, private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.ngxService.start();
    this.http.post(environment.apiBaseUrl + 'orders', JSON.parse(localStorage.getItem("customer"))).subscribe(res => {
      this.ngxService.stop();
      if (res['statuscode'] == 200) {
        this.dataMyorder = res['result']
        this.customerName = res['result'][0]['customer']
      }
    })
  }

  onShowDetail(item) {
    this.ngxService.start();
    this.http.get(environment.apiBaseUrl + 'orders/detailBill/' + item).subscribe(res => {
      this.ngxService.stop();
      if (res['statuscode'] == 200) {
        this.detailBill = res['result']
        console.log(this.detailBill)
      }
    })
  }
}
