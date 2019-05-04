import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
declare var $;

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.css']
})
export class MenulistComponent implements OnInit {
  dataProduct: [] = [];
  dataProductBF: [] = [];
  dataProductLH: [] = [];
  dataProductDN: [] = [];
  dataProductDK: [] = [];
  carts: Array<any> = new Array();
  qty: number = 1
  sum: number = 0

  constructor(public http: HttpClient, private ngxService: NgxUiLoaderService, public router: Router) { }

  ngOnInit() {
    this.carts = JSON.parse(localStorage.getItem("carts"));
    this.getdataProduct()
    this.onCalculate()
  }

  onMinus() {
    if (this.qty <= 1) {
      return
    }
    this.qty -= 1
  }

  onPlus() {
    if (this.qty >= 10) {
      return
    }
    this.qty += 1
  }

  onCalculate() {
    this.sum = 0
    if (this.carts) {
      for (const key in this.carts) {
        this.sum += this.carts[key].price * this.carts[key].qty_in_cart
      }
    }
  }

  getdataProduct() {
    this.ngxService.start();

    this.http.get(environment.apiBaseUrl + 'products').subscribe((res: any) => {
      this.ngxService.stop();
      this.dataProductBF = res['datacatBF']
      this.dataProductLH = res['datacatLH']
      this.dataProductDN = res['datacatDN']
      this.dataProductDK = res['datacatDK']
    })
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
    this.onCalculate()
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
        // localStorage.removeItem('carts')
        this.carts = []
        localStorage.setItem("carts", JSON.stringify(this.carts));
        this.router.navigate(['/myorder'])
        this.onCalculate()
      }
    })
  }

  addToCarts(item) {
    console.log(this.qty)
    // ตรวดสอบว่าเราเคยทำการ add Cart มาก่อนไม (Add แต่ยังไม่ได้เพี่มไปที่ Database) เพื่อว่าถ้ามีมาก่อนก็ให้เพี่มใว้ใน this.carts เพื่อเพี่มครั้งใหม่ตัวเก่าจะได้้ไม่หาย.
    // Ex: ถ้าเพี่มมาก่อน และ เราไปที่หน้าดู Carts และ ถ้ากลับไปหน้า Shop อีก แล้วกดปุ่ม Add To Carts ตัวเก่าจะหายถ้าไม่ตรวดสอบก่อนแบบข้างล่าง.
    if (localStorage.getItem("carts")) {
      this.carts = JSON.parse(localStorage.getItem("carts"));
    } else {
      this.carts = []
    }

    var found = false;
    // ตรวดสอบ Products ว่ามีข้อมูลใน this.carts ไหม ถ้ามีก็ให้เพี่ม QTY ของ ITEM ที่เราจะชือ Ex: QTY: 1 ถ้ากดอีกก็จะเป็น QTY: 1 + 1 = 2.
    for (var i = 0; i < this.carts.length; i++) {
      if (this.carts[i]._id == item._id) {
        found = true;
        item.qty_in_cart = this.carts[i].qty_in_cart + this.qty;
        this.carts[i] = item;
      }
    }

    // ตรวดสอบ Products ว่ามีข้อมูลใน this.carts ไหม ถ้ามไม่ีก็ให้ QTY ของ ITEM ที่เราจะชือ เป็น 1.
    if (!found) {
      // เพี่ม field qty_in_cart
      item.qty_in_cart = this.qty;

      // เพี่ม item ที่เรากด add to cart มาใส่ใน this.cart
      this.carts.push(item);
    }
    // เพี่มข้อมูลลงใน localstorage จาก This.carts
    localStorage.setItem("carts", JSON.stringify(this.carts));
    alert("Add Success");
    this.qty = 1
    this.onCalculate()
  }

  onChangeDataInOrdering(item) {
    console.log(item)
    var found = false;
    // ตรวดสอบ Products ว่ามีข้อมูลใน this.carts ไหม ถ้ามีก็ให้เพี่ม QTY ของ ITEM ที่เราจะชือ Ex: QTY: 1 ถ้ากดอีกก็จะเป็น QTY: 1 + 1 = 2.
    for (var i = 0; i < this.carts.length; i++) {
      if (this.carts[i]._id == item._id) {
        found = true;
        item.qty_in_cart = this.carts[i].qty_in_cart;
        this.carts[i] = item;
      }
    }

    localStorage.setItem("carts", JSON.stringify(this.carts));
    this.onCalculate()
  }
}
