import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../core/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../core/material.module';




@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule,
    //Material
    MaterialModule,
  ],
  providers: [
    // {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'always'}}
  ]
})
export class HomeModule { }
