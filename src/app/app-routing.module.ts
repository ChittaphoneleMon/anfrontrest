import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenulistComponent } from './body/menulist/menulist.component';
import { BodyComponent } from './body/body.component';
import { OrderlistComponent } from './body/orderlist/orderlist.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { MyorderComponent } from './body/myorder/myorder.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: BodyComponent,
    children: [
      {
        path: "menulist",
        component: MenulistComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: "",
    component: BodyComponent,
    children: [
      {
        path: "orderlist",
        component: OrderlistComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: "",
    component: BodyComponent,
    children: [
      {
        path: "myorder",
        component: MyorderComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
