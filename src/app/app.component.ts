import { Component, HostListener, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Action } from 'rxjs/internal/scheduler/Action';
import { AddToHomeScreenService } from './core/add-to-home-screen.service';
import { AlertService } from './core/alert/alert.service';
import { SnackBarService } from './core/alert/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'myCRM';
  @HostListener('window:beforeinstallprompt', ['$event'])
  onEventFire(e: any) {
    this.a2hs.deferredPrompt = e;
  }
  constructor(
    private alertService: AlertService,
    private notiService: SnackBarService,
    private update: SwUpdate,
    private a2hs: AddToHomeScreenService
  ) {


  }



  ngOnInit() {
    /** Init alert Service */
    this.alertService.alertEvent.subscribe((alertEvent: any) => {
      this.notiService.open(alertEvent.message);
    });
    /** Service Worker Service */

    if (this.update.isEnabled) {
      this.update.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
  }


}
