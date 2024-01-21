import { Component, Inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet'
import firestore from 'firebase/firestore'
import moment from 'moment-timezone'
import { timezone } from '../../services/app.service'
import { MaterialModule } from '../../modules/material.module'
/** */
@Component({
  standalone: true,
  selector: 'stringify',
  templateUrl: './stringify.component.html',
  styleUrls: ['./stringify.component.scss'],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class StringifyComponent implements OnInit {
  /** */
  json?: string
  /** */
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }
  /** */
  ngOnInit() {
    this.json = JSON.stringify(this.data, (key, value) => {
      // Format dates
      if (value && typeof value === `object`) {
        //
        if (value instanceof firestore.Timestamp) {
          return moment.tz(value.toDate(), timezone).toISOString(true)
        }
        //
        if (Object.keys(value).length === 2 && Number.isInteger(value.seconds) && Number.isInteger(value.nanoseconds)) {
          return moment.tz(
            new firestore.Timestamp(value.seconds, value.nanoseconds).toDate(), timezone
          ).toISOString(true)
        }
        //
        if (value instanceof Date) {
          return moment.tz(value, timezone).toISOString(true)
        }
        //
        if (moment.isMoment(value)) {
          return value.tz(timezone).toISOString(true)
        }
      }
      return value
    }, 2)
  }
}
