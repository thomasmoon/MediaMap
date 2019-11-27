import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of, BehaviorSubject } from 'rxjs';

export interface MoocUser extends User {
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  providerId: string;
  isAdmin?: boolean;
  roles?: [];
}

@Injectable()
export class AuthService {

  public user: MoocUser;
  public user$: Observable<MoocUser>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    //console.log('Init auth service');

    // This asyc subscription is used by auth guards
    this.user$ = Observable.create(observer => {

      console.log('started new async process for user');

      // Get auth data, then firestore user document or null
      this.afAuth.authState.subscribe(user => {

        //console.log('User returned');
        //console.log(user);

        if (user) {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.updateUserData(user)
            .then(user => {         
                observer.next(this.user);
                observer.complete();
            })
          JSON.parse(localStorage.getItem('user'));
        } else {
          this.user = null;
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
          observer.next(this.user);
          observer.complete();
        }

      });
    });

    // subscribe to self to make sure it's run at least once
    this.user$.subscribe();
  }

  public getUser() {
    return this.user$;
  }

  public login(method:string) {
    //console.log(`Login method: ${method}`);

    let provider;

    switch (method) {
      case 'uni':
        alert('Sorry, this still needs to be figured out');
        break;
      case 'facebook':
        provider = new auth.FacebookAuthProvider;
        break;
      case 'google':
        provider = new auth.GoogleAuthProvider;
        break;
      case 'twitter':
        provider = new auth.GithubAuthProvider;
        break;
      case 'github':
          provider = new auth.GithubAuthProvider;
          break;
    }

    if (provider) {
      return this.oAuthLogin(provider)
        .catch((error)=>{
          alert(`
            Could not activate chosen login method,
            please check internet connection and contact
            support if the problem continues.
            `);
        })
    } else {
      return false;
    }
  }

  public facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  public googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  public loginReturn(result: any) {

    //console.log('Login return');

    if (result.user === null) {
      return result;
    }
    
    return this.updateUserData(result.user)
      .then(() => {
        // redirect to home
        return this.router.navigate(['/'], {
          queryParams: { login: true }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  public redirectResult() {

    // console.log('check for redirect');

    return this.afAuth.auth.getRedirectResult()
    .then(result => {
      return this.loginReturn(result);
    });
  }

  public signOut(): void {

    this.user = null;
    localStorage.setItem('user', null);

    this.afAuth.auth.signOut().then(() => {

      this.router.navigate(['/']);
    });
  }

  public redirectStart(): void {
    this.router.navigate(['/']);
  }

  public redirectLogin(): void {
    this.router.navigate(['/'], {
      queryParams: {
        login: 'true'
      }
    });
  }

  private oAuthLogin(provider: any) {
    
    // Prepare for redirect
    /*
    this.afAuth.auth.getRedirectResult()
      .then(this.loginReturn);*/

    return this.afAuth.auth.signInWithRedirect(provider)
      // if using signInWithPopup: .then(this.loginReturn);
      //return this.afAuth.auth.signInWithPopup(provider)
      .then(this.loginReturn);
  }

  // Helpers //
  private updateUserData(user: any) {

    //console.log('Update user data');
    //console.log(user);
    
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerData[0].providerId
    }

    return userRef.set(data, { merge: true })
      .then(() => {
        //console.log('User updated');

        /* Check for special roles set in db */
        return userRef.get().toPromise()
          .then((snap) => {
            this.user.roles = snap.data().roles;
            this.user.isAdmin = snap.data().isAdmin;

            //console.log("User roles updated");
            return this.user;
        });
        
      })
      .catch(error => {
        console.log(error);
        return error;
      }); 
      }

}
