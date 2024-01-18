import { Injectable } from '@angular/core';
import { getAuth } from "firebase/auth";
import * as firebaseui from 'firebaseui';
import { BehaviorSubject, map } from 'rxjs';
import { FireService } from './fire.service';
/** Authentication */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** */
  auth = getAuth(this.fireService.app);
  /** */
  ui = new firebaseui.auth.AuthUI(this.auth);
  /** */
  constructor(
    public fireService: FireService
  ) { }
}
