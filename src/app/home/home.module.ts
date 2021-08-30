import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../core/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';




@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
