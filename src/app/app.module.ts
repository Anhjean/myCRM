import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotfoundComponent } from './pages/notfound/notfound.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    // App module
    CoreModule,

    // App routing must be last
    AppRoutingModule,

    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
