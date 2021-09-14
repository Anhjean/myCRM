import { Component, HostListener, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { AddToHomeScreenService } from './core/add-to-home-screen.service';
import { AlertService } from './core/alert/alert.service';
import { SnackBarService } from './core/alert/snack-bar.service';
import { PouchdbService } from './core/pouchdb/pouchdb.service';
// import { IndexedDBService } from './core/idb/idb.service';
// import { ObjectStoreMeta, ObjectStoreSchema } from './core/idb/idb_meta';


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
    private a2hs: AddToHomeScreenService,
    // private idb: IndexedDBService
    private pdb:PouchdbService
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

    // this.pdb.init();

    /** IndexedDB Init*/

    // const storeSchema: ObjectStoreMeta = {
    //   store: 'Jean',
    //   storeConfig: { keyPath: 'id', autoIncrement: true },
    //   storeSchema: [
    //     { name: 'name', keypath: 'name', options: { unique: false } },
    //     { name: 'email', keypath: 'email', options: { unique: false } }
    //   ]
    //   }

    // this.idb.isStoreExist('Jean').then((result:Boolean) => {
    //   console.log("Resutl: ",result);
    //   if (!result){
    //   this.idb.createObjectStore(storeSchema)
    //   } else{
    //     console.log("Resutl: this DB is existed.");
    //   }
    // })
    // this.idb
    //   .add('people', {
    //     name: `Bruce Wayne`,
    //     email: `bruce@wayne.com`,
    //   })
    //   .subscribe((key) => {
    //     console.log('key: ', key);
    //   });


    }
}
