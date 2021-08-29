// import { Injectable } from '@angular/core';
/** Angular Imports */
import { Route as ngRoute, Routes } from '@angular/router';
import { AuthenticationGuard } from '../authentication/authentication.guard';

/** Custom Components */
import { ShellComponent } from '../shell/shell.component';

// @Injectable({
//   providedIn: 'root'
// })
export class RouteService {

  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return {Route} The new route using shell as the base.
   */
   static withShell(routes: Routes): ngRoute {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
