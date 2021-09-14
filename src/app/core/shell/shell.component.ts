import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  MediaMatcher,
} from '@angular/cdk/layout';
import { SwPush } from '@angular/service-worker';
import { AlertService } from '../alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Credentials } from '../authentication/authentication.model';
import { PouchdbService } from '../pouchdb/pouchdb.service';

class DeviceDto {
  username: String | undefined;
  officeName: String | undefined;
  deviceIP: String | undefined;
  deviceAgent: String | undefined;
  subscription: any;
}

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  // {"publicKey":"BIrfWb0FxhpnQ8FUj5LdB1p0Za38C2CptrGqD8-tPqebVXoeyPByIz9e1Kqu0eRYhgIHXkeFuR3451RpMoKpSi8",
  // "privateKey":"dr0VMYN0iUDch_v42nGaCk3eQ_ehZhcfRXg8b18thqo"}
  private VAPID_PUBLIC_KEY = '';
  private NOTI_SERVER_KEY = 'noti-server-key';

  private device: DeviceDto = new DeviceDto();
  private credential: Credentials;

  public subscription$ = this.swPush.subscription;
  public isEnabled = this.swPush.isEnabled;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private swPush: SwPush,
    private alertService: AlertService,
    private http: HttpClient,
    private pdb: PouchdbService
  ) {
    this.credential = JSON.parse(
      localStorage.getItem('Credentials') ||
        sessionStorage.getItem('Credentials') ||
        '{}'
    );
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    /**
     * log info abou SW
     * and use SW to listen to push message
     */
    console.log('SW in navigator: ', 'serviceWorker' in navigator);
    console.log('SwPush is Enable:: ', this.swPush.isEnabled);
    this.swPush.messages.subscribe((msg) => this.handlePushMessage(msg));
    this.swPush.notificationClicks.subscribe((options) =>
      this.handlePushNotificationClick(options)
    );
  }
  async ngOnInit() {
    let notiServerKey = await this.pdb.getItem(this.NOTI_SERVER_KEY, true)
    console.log(this.NOTI_SERVER_KEY+" lalal: ", notiServerKey);
    if (notiServerKey !== null) {
      this.VAPID_PUBLIC_KEY = notiServerKey.result;
      await this.requestPermission();
    } else {
      // this.http
      //   .disableApiPrefix()
      //   .get(environment.notiGatewayURL + '/publicSigningKeyBase64')
      //   .subscribe(
      //     async (res: any) => {
      //       notiServerKey = res;
      //       console.log('notiServerKey- not in pdb', notiServerKey);
      //       this.VAPID_PUBLIC_KEY = notiServerKey;
      //       await this.pdb.upsertItem(
      //         this.NOTI_SERVER_KEY,
      //         notiServerKey,
      //         true
      //       );
      //     },
      //     (err) => console.log('Get notiServerKey error: ', err),
      //     () => this.requestPermission()
      //   );
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  /** sw Message Push function */
  handlePushNotificationClick(options: {
    action: string;
    notification: NotificationOptions & { title: string };
  }): void {
    switch (options.action) {
      case 'open': {
        // this.router.navigate(['notes', notification.data.noteID, { queryParams: { pushNotification: true } }]);
        this.alertService.alert({ type: ' Thông báo ', message: 'open' });
        break;
      }
      case 'cancel': {
        this.alertService.alert({ type: ' Thông báo ', message: 'cancel' });
        break;
      }
      default: {
        // this.router.navigate(['notes', notification.data.noteID, { queryParams: { pushNotification: true } }]);
        this.alertService.alert({ type: ' Thông báo ', message: 'default' });
        break;
      }
    }
  }

  handlePushMessage({ notification }: any): void {
    console.log(notification);
    this.alertService.alert({
      type: `Push notification title: ${notification.title}`,
      message: `Message: ${notification.body}`,
    });
  }

  async requestPermission() {
    console.log('Request starting...');
    console.log('request: ', this.VAPID_PUBLIC_KEY);
    // if(environment.production){
    try {

      const sub = await this.swPush.requestSubscription({serverPublicKey: this.VAPID_PUBLIC_KEY});
      // TODO: Send to server.
      if (sub) {
        this.device.username = this.credential.username;
        this.device.officeName = this.credential.officeName;
        this.device.subscription = sub.toJSON();
        const subJSON = JSON.parse(JSON.stringify(this.device));
        // if (subJSON.expirationTime === undefined) {
        //   subJSON.expirationTime = null;
        // }

        console.log('subJson', subJSON);
        this.http
          .post(environment.notiGatewayURL + '/deviceSubscribe', subJSON)
          .subscribe(
            (res) => console.log('subscribe result:', res),
            (err) => console.log('Error', err),
            () => {
              return this.alertService.alert({
                type: 'Notification',
                message: 'You are subscribed now!',
              });
            }
          );
      } else{
        console.info('sub have problem:', sub)
      }
    } catch (err) {
      console.error('Could not subscribe due to:', err);
      this.alertService.alert({
        type: 'Notification',
        message: 'Subscription fail',
      });
    }
  // } else{
  //   console.log('Not on production mode.')
  // }
  }
  requestUnsubscribe() {
    this.swPush
      .unsubscribe()
      .then(() => {
        this.alertService.alert({
          type: 'Thông báo',
          message: 'You are unsubscribed',
        });
      })
      .catch((e) => {
        console.error(e);
        this.alertService.alert({
          type: 'Thông báo',
          message: 'unsubscribe failed',
        });
      });
  }
}
