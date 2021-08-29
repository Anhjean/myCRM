import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteService } from "../core/route/route.service";
import { HomeComponent } from "./home.component";

const routes: Routes = [
  RouteService.withShell([
    // {
    //   path: '',
    //   redirectTo: '/home',
    //   pathMatch: 'full'
    // },
    {
      path: '',
      component: HomeComponent,
       data: { customBreadcrumb: "Home" }
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
