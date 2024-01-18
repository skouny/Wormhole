import { Injectable } from '@angular/core';
import { initializeApp, FirebaseOptions } from "firebase/app";
/** */
const firebaseConfig: FirebaseOptions = {
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
  app = initializeApp(firebaseConfig);
  /** */
  constructor() { }
}
