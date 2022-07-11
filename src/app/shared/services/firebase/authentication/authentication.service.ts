import { Injectable, NgZone } from '@angular/core';
import {
  Auth, signOut, user, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, sendEmailVerification, sendPasswordResetEmail, User, authState, onAuthStateChanged,
  ActionCodeSettings,
  getAdditionalUserInfo,
  UserCredential,
  UserInfo,

  // OAuthProvider,
  // linkWithPopup,
  // unlink,
  // updateEmail,
  // updatePassword,
  // reauthenticateWithPopup,
  // signInWithPopup,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { onIdTokenChanged } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _route = '';
  user!: User | null;
  userCredentials!: UserCredential;

  constructor(private auth: Auth, private router: Router,
    private ngZone: NgZone) {
    this.onAuthStateChanged();
  }

  getAdditionalUserInfo(userCredential: UserCredential) {
    return getAdditionalUserInfo(userCredential);
  }

  setActiveRoute(url: string) {
    this._route = url;
  }

  public get authState() {
    return authState(this.auth);
  }

  public get userAsync() {
    return user(this.auth);
  }


  onIdTokenChanged() {
    onIdTokenChanged(this.auth, async usr => {
      const tokenResult = await usr?.getIdTokenResult();
      console.log('IdToken', tokenResult?.authTime);
    })
  }

  private onAuthStateChanged() {
    onAuthStateChanged(this.auth, usr => {
      this.user = usr;
      if (usr) {
        this.ngZone.run(() => {
          this.router.navigate(['/timeline']).catch(reason => console.log(reason));
        });
      } else {
        this.ngZone.run(() => {
          this.router.navigate(['']).catch(reason => console.log(reason));
        });
      }
    });
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    this.userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
    return this.userCredentials;
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    this.userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
    return this.userCredentials;
  }

  updateProfile(data: any) {
    return updateProfile(this.auth.currentUser as User, data)
  }

  sendEmailVerification(actionCodeSettings?: ActionCodeSettings) {
    return sendEmailVerification(this.auth.currentUser as User, actionCodeSettings);
  }

  sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings) {
    return sendPasswordResetEmail(this.auth, email, actionCodeSettings);
  }

  signOut() {
    signOut(this.auth);
  }
}
