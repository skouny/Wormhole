import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import { firebaseConfig } from '../../../shared/firebase-config';
/** */
@Injectable({
  providedIn: 'root'
})
export class FireService {
  /** */
  app = firebase.initializeApp(firebaseConfig.options);
  /** */
  constructor() { }
}
