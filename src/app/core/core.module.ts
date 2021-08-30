import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../environments/environment';
import { ShellComponent } from './shell/shell.component';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import { HttpCacheService } from './http/http-cache.service';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { HttpService } from './http/http.service';
import { ProgressBarService } from './progressbar/progressbar.service';
import { ProgressInterceptor } from './progressbar/progressbar.interceptor';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { RouteReusableStrategy } from './route/route-reusable-strategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ContentComponent } from './shell/content/content.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NavContentComponent } from './shell/nav-content/nav-content.component';
import { AddToHomeScreenService } from './add-to-home-screen.service';
import { SnackBarService } from './alert/snack-bar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    ShellComponent,
    ContentComponent,
    NavContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    // Material Design
    MatToolbarModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    DragDropModule,
    MatSnackBarModule
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    AuthenticationInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    // I18nService,
    HttpCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    ProgressBarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    SnackBarService,
    AddToHomeScreenService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}

// AOT compilation support
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
