import { Injectable } from '@angular/core';
import firebase from "firebase/app";
/** Firebase Initialize */
export const firebaseConfig: firebase.FirebaseOptions = {
  apiKey: "AIzaSyAjEX2Q14aNBRiLPudb72OiiMXfEZC5oHg",
  authDomain: "skouny-da713.firebaseapp.com",
  projectId: "skouny",
  storageBucket: "skouny.appspot.com",
  messagingSenderId: "153886109135",
  appId: "1:153886109135:web:5e7148a13dcf3ffe3cb6ba",
}
/** */
@Injectable({
  providedIn: 'root'
})
export class FireService {
  /** */
  app = firebase.initializeApp(firebaseConfig);
  /** */
  constructor() { }
}
