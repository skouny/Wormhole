import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';
import { EmailAuthProvider, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider, PhoneAuthProvider } from "firebase/auth";
import { MaterialModule } from '../modules/material.module';
import { AuthService } from '../services/auth.service';
/** */
@Component({
  standalone: true,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
})
export class AuthComponent {
  /** */
  constructor(
    public authService: AuthService,
  ) { }
  /** */
  divUI$ = new BehaviorSubject<ElementRef<HTMLDivElement> | undefined>(undefined)
  get divUI() { return this.divUI$.value }
  @ViewChild("uiContainer") set divUI(value) { this.divUI$.next(value) }
  /** */
  loadUI$ = this.divUI$.pipe(map(elementRef => {
    if (!elementRef?.nativeElement) return
    this.authService.ui.start(elementRef.nativeElement, {
      /** */
      callbacks: {
        /** User successfully signed in. */
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // Return type determines whether we continue the redirect automatically or whether we leave that to developer to handle.
          return true;
        },
        /** The widget is rendered. */
        uiShown: () => {
          // Hide the loader.
          //document.getElementById('loader').style.display = 'none';
        }
      },
      /** Will use popup for IDP Providers sign-in flow instead of the default, redirect. */
      signInFlow: 'redirect',
      /** URL to redirect to on success */
      signInSuccessUrl: '<url-to-redirect-to-on-success>',
      /** Leave the lines as is for the providers you want to offer your users. */
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
        FacebookAuthProvider.PROVIDER_ID,
        TwitterAuthProvider.PROVIDER_ID,
        GithubAuthProvider.PROVIDER_ID,
        PhoneAuthProvider.PROVIDER_ID
      ],
      /** Terms of service url. */
      tosUrl: '<your-tos-url>',
      /** Privacy policy url. */
      privacyPolicyUrl: '<your-privacy-policy-url>'
    })
  }))
}
