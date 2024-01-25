import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '../modules/material.module';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
/** */
@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MaterialModule,
    MatToolbarModule
  ],
})
export class DashboardComponent {
  /** */
  mediaQuery = this.media.matchMedia('(max-width: 900px)')
  /** */
  constructor(
    public appService: AppService,
    public authService: AuthService,
    public media: MediaMatcher,
  ) { }
  /** */

}
