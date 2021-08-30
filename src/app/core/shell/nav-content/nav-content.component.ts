import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {

  constructor(private authen: AuthenticationService,
              private router:Router) { }

  ngOnInit(): void {
  }

  logout(){
    this.authen.logout().subscribe((e:Boolean) => {
      if (e === true){

          this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

}
