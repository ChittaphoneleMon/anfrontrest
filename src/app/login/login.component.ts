import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  dataCus: any = []
  constructor(public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("customer")) {
      this.router.navigate(['/menulist'])
    }
  }

  onlogin(form: NgForm) {
    form['id'] = Math.floor((Math.random() * 10000000000) + (Math.random() * 1000000000000))
    localStorage.setItem("customer", JSON.stringify(form));
    this.router.navigate(['/menulist'])
  }

}
