'use strict';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; // ActivatedRouteSnapshot, RouterStateSnapshot,
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {


    return true;

    /*
    return this.auth.user.pipe(
      take(1)).pipe(
      map((user: any) => !!user)).pipe(
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          // console.log('access denied');
          this.router.navigate(['/welcome']);
        }
      }));*/
  }
}
