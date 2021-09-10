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
  ) {}

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
    // create indexeddb
    // create a reference to the notifications list in the bottom of the app; we will write database messages into this list by
    //appending list items on to the inner HTML of this variable - this is all the lines that say note.innerHTML += '<li>foo</li>';

    window.onload =  () => {
      let db: IDBDatabase ;

      // In the following line, you should include the prefixes of implementations you want to test.
      // window.indexedDB = window.indexedDB;
      // DON'T use "var indexedDB = ..." if you're not in a function.
      // Moreover, you may need references to some window.IDB* objects:
      window.IDBTransaction = window.IDBTransaction;
      window.IDBKeyRange = window.IDBKeyRange;
      // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

      // Let us open our database
      const DBOpenRequest = window.indexedDB.open('localdb', 1);

      // Gecko-only IndexedDB temp storage option:
      // var request = window.indexedDB.open("toDoList", {version: 4, storage: "temporary"});

      // these two event handlers act on the database being opened successfully, or not
      DBOpenRequest.onerror = (event:any) => {
        console.log(event);
      };

      DBOpenRequest.onsuccess = (event:any) =>{
        // store the result of opening the database in the db variable. This is used a lot below
        db = DBOpenRequest.result;
        console.log(event);
        // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
        // displayData();
      };

      // This event handles the event whereby a new version of the database needs to be created
      // Either one has not been created before, or a new version number has been submitted via the
      // window.indexedDB.open line above
      //it is only implemented in recent browsers
      DBOpenRequest.onupgradeneeded = function (event: any) {
        console.log("On Upgrade needed: ", event.target)
        const db = event.target.result;
        db.onerror = (event: any) => {
          console.log(event);
        };
      };


    };
  }
}
