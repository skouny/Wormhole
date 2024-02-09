import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth from "firebase/auth";
import * as firebaseui from 'firebaseui';
import { BehaviorSubject, map } from 'rxjs';
import { FireService } from './fire.service';
import { RightsGlobal } from 'shared/data-types';
import { MatSnackBar } from '@angular/material/snack-bar';
/** Firebase Authentication */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** */
  auth = auth.getAuth(this.fireService.app);
  /** */
  ui = new firebaseui.auth.AuthUI(this.auth);
  /** User: Signed in, null: Not signed in, undefined: loading */
  user$ = new BehaviorSubject<auth.User | null | undefined>(undefined)
  get user() { return this.user$.value }
  /** */
  token$ = new BehaviorSubject<auth.IdTokenResult | null | undefined>(undefined)
  get token() { return this.token$.value }
  /** */
  claims$ = (() => {
    const data$ = new BehaviorSubject<RightsGlobal | null | undefined>(undefined)
    const stream$ = this.token$.pipe(map(token => {
      if (token === undefined) return undefined
      if (token === null) return null
      return token.claims as RightsGlobal
    }))
    stream$.subscribe(data$)
    return data$
  })()
  get claims() { return this.claims$.value }
  /** */
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public fireService: FireService,
  ) {
    this.auth.onAuthStateChanged(async user => {
      // Is sign out?
      if (this.user$.value !== user && user === null && this.user$.value !== undefined) {
        location.reload()
      }
      // Is fully authenticated?
      if (user?.email && user.emailVerified) {
        this.user$.next(user)
        this.token$.next(await user.getIdTokenResult())
      } else {
        this.user$.next(null)
        this.token$.next(null)
      }
      // Send verification email?
      if (user?.email && !user.emailVerified) {
        await auth.sendEmailVerification(user)
        this.snackBar.open('An e-mail for your account verification has been send. Please verify your account to login.', 'X')
        await this.auth.signOut()
      }
    })
  }
  /** */
  login() {
    return this.router.navigate(["/auth"])
  }
  /** Signs out the current user. */
  logout() {
    return this.auth.signOut()
  }
}
