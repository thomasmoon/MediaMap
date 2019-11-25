'use strict';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // ActivatedRouteSnapshot, RouterStateSnapshot,
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.user) {
      return true;
    }

    console.log('Must be logged in to view this content, redirecting...');

    this.router.navigate(['/'], {
      queryParams: {
        login: 'true'
      }
    });
    return false;
  }
}
