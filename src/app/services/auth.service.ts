import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';

/*
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  isAdmin?: boolean;
  providerId?: string;
}*/

@Injectable()
export class AuthService {

  // public authState: any = null;
  user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    // Get auth data, then firestore user document or null
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
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

    // console.log('Login return');

    if (result.user === null) {
      return result;
    }

    return null;
    
    /*
    return this.updateUserData(result.user)
      .then(() => {
        // redirect to home
        return this.router.navigate(['/']);
      })
      .catch(err => {
        console.log(err);
      });*/
  }

  public redirectResult() {

    // console.log('check for redirect');

    return this.afAuth.auth.getRedirectResult()
    .then(result => {
      return this.loginReturn(result);
    });
  }

  public signOut(): void {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  public redirectStart(): void {
    this.router.navigate(['/']);
  }

  private oAuthLogin(provider: any) {
/*
    // Prepare for redirect
    this.afAuth.auth.getRedirectResult()
      .then(this.loginReturn);*/

    return this.afAuth.auth.signInWithRedirect(provider);
      // if using signInWithPopup: .then(this.loginReturn);
  }

  // Helpers //
  private updateUserData(user: any) {

    console.log('update user data');

    console.log(user);
    /*
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerData[0].providerId
    };

    return userRef.set(data, { merge: true })
    .catch(error => console.log(error));

    */

    }

}
