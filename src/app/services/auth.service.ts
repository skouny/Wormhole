import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth from "firebase/auth";
import * as firebaseui from 'firebaseui';
import { BehaviorSubject, map } from 'rxjs';
import { FireService } from './fire.service';
import { RightsGlobal } from 'shared/data-types';
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
    public fireService: FireService,
    public router: Router,
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
  /** */
  login() {
    return this.router.navigate(["/auth"])
  }
  /** Signs out the current user. */
  logout() {
    return this.auth.signOut()
  }
}
