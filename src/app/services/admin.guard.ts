import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

import { map, take } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {

    console.log('Can activate');

    console.log(this.auth.user);

    return true;
    /*
    return this.auth.user.pipe(
      take(1)).pipe(
        map((user: any) => {

          if (!user.isAdmin) {
            console.log('access denied');
            this.router.navigate(['/']);
          }

          return user.isAdmin;
        }));*/
    }
}
