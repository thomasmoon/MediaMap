import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {

    if (this.auth.user && this.auth.user.isAdmin) {
      return true;
    }

    console.log('No rights to view admin content, redirecting...');

    this.router.navigate(['/'], {
      queryParams: {
        login: 'true'
      }
    });
    return false;
  }
}
