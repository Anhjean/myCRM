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

  private device: DeviceDto = new DeviceDto();
  private credential:Credentials ;

  public subscription$ = this.swPush.subscription;
  public isEnabled = this.swPush.isEnabled;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private swPush: SwPush,
    private alertService: AlertService,
    private http: HttpClient
  ) {
    this.credential = JSON.parse(localStorage.getItem("Credentials")|| sessionStorage.getItem("Credentials")||"{}");
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
  ngOnInit() {
    if (this.credential){

    this.http
      .disableApiPrefix()
      .get(environment.NotiGatewayURL+'/publicSigningKeyBase64')
      .subscribe(
        (res: any) => {
          if (res.result) {
            this.VAPID_PUBLIC_KEY = res.result;
          }
          console.log('deviceID:',navigator.mediaDevices.getSupportedConstraints.toString());
        },
        (e) => console.log('error: ', e),
        () => this.requestPermission()
      );
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
    console.log('Request Key: ', this.VAPID_PUBLIC_KEY);

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      });
      // TODO: Send to server.

      // const subJSON = sub.toJSON();

      this.device.username = this.credential.username;
      this.device.officeName = this.credential.officeName;
      this.device.subscription = sub.toJSON();
      const subJSON = JSON.parse(JSON.stringify(this.device));

      // if (subJSON.expirationTime === undefined) {
      //   subJSON.expirationTime = null;
      // }
      console.log('subJson', subJSON);
      await this.http
        .post(environment.NotiGatewayURL+'/deviceSubscribe', subJSON)
        .subscribe((res) => console.log('subscribe result:', res));
      return this.alertService.alert({
        type: 'Notification',
        message: 'You are subscribed now!',
      });
    } catch (err) {
      console.error('Could not subscribe due to:', err);
      this.alertService.alert({
        type: 'Notification',
        message: 'Subscription fail',
      });
    }
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
