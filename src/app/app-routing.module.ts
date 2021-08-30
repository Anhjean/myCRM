import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './pages/notfound/notfound.component'

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomeModule),
      data: { customBreadcrumb: "Home" }
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
      data: { customBreadcrumb: "Login" }
  },
  { path: "**", component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true,preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
