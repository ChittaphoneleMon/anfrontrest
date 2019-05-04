import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent implements OnInit {
  carts: Array<any> = new Array();
  constructor(public http: HttpClient, public router: Router, private ngxService: NgxUiLoaderService) { }

  sum: number = 0

  ngOnInit() {
    this.carts = JSON.parse(localStorage.getItem("carts"));
    // if (this.carts) {
    //   for (const key in this.carts) {
    //     this.sum += this.carts[key].price * this.carts[key].qty_in_cart
    //   }
    // }
  }


  onDeletecart(item) {
    if (confirm("Are you sure Delete Item of Carts")) {
      for (var i = 0; i < this.carts.length; i++) {
        if (this.carts[i]._id == item._id) {
          this.carts.splice(i, 1);
        }
      }
      localStorage.setItem("carts", JSON.stringify(this.carts));
    }
  }

  onConfirmOrder() {
    var dataConfirm = {
      carts: this.carts,
      customerDeteil: JSON.parse(localStorage.getItem("customer"))
    }
    this.ngxService.start();
    this.http.post(environment.apiBaseUrl + 'orders/save', dataConfirm).subscribe(res => {
      this.ngxService.stop();
      if (res['statuscode'] == 200) {

        localStorage.removeItem('carts')
        this.router.navigate(['/myorder'])
      }
    })
  }

}
