import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Logger } from '../core/logger/logger.service';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginContext: FormGroup;
  constructor( private authen: AuthenticationService,
    private router:Router) {
    this.loginContext = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      rememberMe: new FormControl(true)
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    log.debug(this.loginContext.value)
    // Login and forward to HomePage
    this.authen.login({
      username: this.loginContext.get('username')?.value,
      password: this.loginContext.get('password')?.value,
      remember: this.loginContext.get('rememberMe')?.value}).subscribe(res =>
        {
          log.debug('just login')
          this.router.navigate(['/'], { replaceUrl: true });
        })
  }


}
