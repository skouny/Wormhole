import { Injectable } from '@angular/core';
import { FireService } from './fire.service';
/** Firebase Functions */
@Injectable({
  providedIn: 'root'
})
export class FuncService {
  /** */
  constructor(
    public fireService: FireService
  ) { }
}
