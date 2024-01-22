import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from 'src/app/modules/material.module';
import { AppService } from '../services/app.service';
/** */
@Component({
  standalone: true,
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    MatToolbarModule
  ]
})
export class IndexComponent {
  /** */
  appVersion = this.appService.appVersion
  /** */
  constructor(
    public appService: AppService
  ) { }
}
