import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertService } from './core/alert/alert.service';
import { SnackBarService } from './core/alert/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myCRM';
  constructor(private alertService:AlertService,
              private notiService:SnackBarService,
              private update: SwUpdate,) {}

  ngOnInit(){
/** Init alert Service */
this.alertService.alertEvent.subscribe((alertEvent: any) => {
  this.notiService.open(
    alertEvent.message,

  );
});
/** Service Worker Service */
if (this.update.isEnabled) {
  this.update.available.subscribe(() => {
    if (confirm("New version available. Load New Version?")) {
      window.location.reload();
    }
  });
}

  }
}
