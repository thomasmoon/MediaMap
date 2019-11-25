import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';

<<<<<<< HEAD
export interface MoocUser extends User {
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
  providerId: string;
  isAdmin?: boolean;
  roles?: [];
}
=======
/*
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  isAdmin?: boolean;
  providerId?: string;
}*/
>>>>>>> 6fb4883fd01385bd908561bfa8e40b0789103df2

@Injectable()
export class AuthService {

<<<<<<< HEAD
  public user: MoocUser;
=======
  // public authState: any = null;
  user: User;
>>>>>>> 6fb4883fd01385bd908561bfa8e40b0789103df2

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    // Get auth data, then firestore user document or null
    this.afAuth.authState.subscribe(user => {
<<<<<<< HEAD

      console.log('User info');
      console.log(user);

      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updateUserData(user);
        JSON.parse(localStorage.getItem('user'));
      } else {
        this.user = null;
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }

    });
  }

  public login(method:string) {
    console.log(method);

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

=======
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

>>>>>>> 6fb4883fd01385bd908561bfa8e40b0789103df2
  public facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  public googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  public loginReturn(result: any) {

<<<<<<< HEAD
    console.log('Login return');
=======
    // console.log('Login return');
>>>>>>> 6fb4883fd01385bd908561bfa8e40b0789103df2

    if (result.user === null) {
      return result;
    }
<<<<<<< HEAD
    
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
=======

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
>>>>>>> 6fb4883fd01385bd908561bfa8e40b0789103df2
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
      console.log('User updated');

      /* Check for special roles set in db */
      userRef.get().subscribe((snap) => {
        this.user.roles = snap.data().roles;
        this.user.isAdmin = snap.data().isAdmin;
      });
    })
    .catch(error => console.log(error));
    }

}
