import { bootstrapApplication } from '@angular/platform-browser';
import '@angular/common/locales/global/el'
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
/** */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
