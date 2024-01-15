import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/** */
@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    RouterOutlet
  ],
})
export class DashboardComponent {

}
