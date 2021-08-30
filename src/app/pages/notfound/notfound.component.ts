import { Component, OnInit } from '@angular/core';
declare var particlesJS: any;

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    particlesJS.load('particles-js', '/assets/particles.json');
  }

}
