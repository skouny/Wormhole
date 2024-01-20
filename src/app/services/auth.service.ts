import { Injectable } from '@angular/core';
import { getAuth, IdTokenResult, User } from "firebase/auth";
import * as firebaseui from 'firebaseui';
import { BehaviorSubject, map } from 'rxjs';
import { FireService } from './fire.service';
/** Firebase Authentication */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** */
  auth = getAuth(this.fireService.app);
  /** */
  ui = new firebaseui.auth.AuthUI(this.auth);
  /** User: Signed in, null: Not signed in, undefined: loading */
  user$ = new BehaviorSubject<User | null | undefined>(undefined)
  /** */
  token$ = new BehaviorSubject<IdTokenResult | null | undefined>(undefined)
  /** */
  constructor(
    public fireService: FireService
  ) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        user.getIdTokenResult().then(result => {
          this.token$.next(result)
        })
        console.log(`Hi ${user.email}!`)
      } else {
        this.token$.next(null)
        console.log(`Please sign in`)
      }
      this.user$.next(user)
    })
  }
  /** Signs out the current user. */
  signOut() {
    this.auth.signOut()
  }
}
