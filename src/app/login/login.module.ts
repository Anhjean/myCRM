import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';


/**
 * This module we don't use Shared Module
 * Because we online use tailwindcss and html here
 */
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
