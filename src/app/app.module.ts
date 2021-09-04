import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { CheckUpdateService } from './service-worker/check-update.service';
import { HandleUnrecoverableStateService } from './service-worker/handle-unrecoverable-state.service';
import { LogUpdateService } from './service-worker/log-update.service';
import { PromptUpdateService } from './service-worker/prompt-update.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // scope:"./",
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    CoreModule,

  ],
  providers: [PromptUpdateService,LogUpdateService,HandleUnrecoverableStateService,CheckUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
