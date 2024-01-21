import { Injectable } from '@angular/core';
import { formatCurrency, formatDate, formatNumber } from '@angular/common';
import firestore from 'firebase/firestore';
import moment from 'moment-timezone';
import { Observable, map, sampleTime } from 'rxjs';
import { FireService } from './fire.service';
import { AppService, currency, locale } from './app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
//#region Default config
/** Default emit time interval for observables */
const emitTime = 200
/** Hide firestore error if no user logged in or no rights */
let hideErrors = false
//#endregion
//#region Common Functions
/** Split an array to parts */
export const arraySplit = <T>(array: T[], size: number): T[][] => {
  const items = [...array] // Copy
  const result: T[][] = []
  while (items.length) {
    const part = items.splice(0, size)
    result.push(part)
  }
  return result
}
/** Join a parted array */
export const arrayJoin = <T>(parts: T[][]) => {
  let result: T[] = []
  for (const part of parts) {
    result = result.concat(part)
  }
  return result
}
/** */
export const arrayToDict = <T>(items: (T & { UID: string })[]) => {
  return Object.assign({}, ...items.map(item => ({ [item.UID]: item }))) as { [UID: string]: T & { UID: string } }
}
/** */
export const arrayToDict2 = <T>(items: (T & { UID: string })[]) => {
  const dict = arrayToDict(items) as { [UID: string]: T & { UID?: string } }
  for (let value of Object.values(dict)) {
    delete value.UID
  }
  return dict as { [UID: string]: T }
}
//#endregion
//#region General Functions [Firestore]
/** */
export const fireDoc$ = <T>(doc: firestore.DocumentReference, snackBar: MatSnackBar, duration = emitTime) => {
  return new Observable<T>(subscriber => {
    firestore.onSnapshot(doc, observer => {
      const data = observer.data() as T
      subscriber.next(data)
    }, (error: { message: any }) => {
      if (hideErrors) return
      snackBar.open(`Error: ${error?.message}, Document: ${doc?.path}`, `X`, { duration: 0 })
    }, () => {
      subscriber.unsubscribe()
    })
  }).pipe(sampleTime(duration))
}
/** */
export const fireDocUID$ = <T>(doc: firestore.DocumentReference, snackBar: MatSnackBar, duration = emitTime) => {
  return new Observable<(T & { UID: string })>(subscriber => {
    firestore.onSnapshot(doc, observer => {
      const data = observer.data() as T
      const value = (data) ? { ...data, UID: observer.id } : undefined
      subscriber.next(value)
    }, (error: { message: any }) => {
      if (hideErrors) return
      snackBar.open(`Error: ${error?.message}, Document: ${doc?.path}`, `X`, { duration: 0 })
    }, () => {
      subscriber.unsubscribe()
    })
  }).pipe(sampleTime(duration))
}
/** */
export const fireDocs$ = <T>(query: firestore.CollectionReference | firestore.Query, snackBar: MatSnackBar, duration = emitTime) => {
  return new Observable<(T & { UID: string })[]>(subscriber => {
    firestore.onSnapshot(query, (observer: { docs: any[] }) => {
      const data = observer.docs?.map(doc => {
        return { ...(doc.data() as T), UID: doc.id }
      })
      subscriber.next(data)
    }, (error: { message: any }) => {
      if (hideErrors) return
      console.error(error?.message, query) // IMPORTANT!! => to create composite indexes
      snackBar.open(`Query Error: ${error?.message}`, `X`, { duration: 0 })
    }, () => {
      subscriber.unsubscribe()
    })
  }).pipe(sampleTime(duration)) // <= PROBLEM with throttleTime SOS!!! (does not always emits latest value! bug?)
}
/** */
export const fireDict$ = <T>(query: firestore.CollectionReference | firestore.Query, snackBar: MatSnackBar, duration = emitTime) => {
  return fireDocs$<T>(query, snackBar, duration).pipe(map(items => arrayToDict(items)))
}
//#endregion
//#region General Classes [Firestore]
/** */
export abstract class GeneralDocument {
  /** Disabled documents does not take part in the application. Used instead of delete or to enable/disable features. */
  Disabled?: boolean
  /** Who provider owns this document */
  ProviderUID?: string
  /** Who operator created the document (e-mail address) */
  Operator?: string
  /** Document creation timestamp */
  Created?: firestore.Timestamp | firestore.FieldValue
  /** Document modification timestamp */
  Modified?: firestore.Timestamp | firestore.FieldValue
}
/** */
export abstract class GeneralCollection<T> {
  /** */
  abstract readonly name: string
  /** https://firebase.google.com/docs/reference/js/v8/firebase.firestore.Settings */
  constructor(
    public dataService: DataService
  ) { }
  /** */
  get collection() {
    return firestore.collection(this.dataService.firestore, this.name)
  }
  /** */
  doc(documentPath: string) {
    return firestore.doc(this.dataService.firestore, documentPath)
  }
  /** Cast queries to document type */
  cast(doc: firestore.QueryDocumentSnapshot): T & { UID: string } {
    return { ...doc.data(), UID: doc.id } as T & { UID: string }
  }
  //#region Streams
  /** */
  read$(UID: string): Observable<T> {
    return fireDoc$<T>(this.doc(UID), this.dataService.snackBar)
  }
  //#endregion
}
//#endregion
/** Firestore Database */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  /** */
  firestore = firestore.initializeFirestore(this.fireService.app, {
    ignoreUndefinedProperties: true
  })
  /** */
  constructor(
    public appService: AppService,
    public fireService: FireService,
    public snackBar: MatSnackBar,
  ) { }
  //#region Labels
  /** */
  labelTimestamp(
    date?: string | number | Date | moment.Moment | firestore.Timestamp | firestore.FieldValue | null,
    format = "yyyy-MM-dd HH:mm:ss"
  ) {
    if (!date || date instanceof firestore.FieldValue) return ""
    if (date instanceof firestore.Timestamp) {
      return formatDate(date.toDate(), format, locale)
    }
    if (moment.isMoment(date)) {
      return formatDate(date.toDate(), format, locale)
    }
    return formatDate(date, format, locale)
  }
  /** */
  labelDate(
    date?: string | number | Date | moment.Moment | firestore.Timestamp | firestore.FieldValue | null,
    format = "yyyy-MM-dd"
  ) {
    return this.labelTimestamp(date, format)
  }
  /** */
  labelNumber(value?: number | firestore.FieldValue | null, showZero = false) {
    if (value instanceof firestore.FieldValue) return ""
    if (showZero) {
      return formatNumber(value || 0, locale)
    }
    return (value) ? formatNumber(value, locale) : ""
  }
  /** */
  labelCurrency(value?: number | firestore.FieldValue | null, showZero = false) {
    if (value instanceof firestore.FieldValue) return ""
    if (showZero) {
      return formatCurrency(value || 0, locale, currency)
    }
    return (value) ? formatCurrency(value, locale, currency) : ""
  }
  /** Convert file size in bytes to human readable format */
  labelBytes(length: number) {
    if (length < 1024) return `${formatNumber(length, 'el-GR', '1.0-2')} bytes`
    if (length < 1024 * 1024) return `${formatNumber(length / 1024, 'el-GR', '1.0-2')}KB`
    if (length < 1024 * 1024 * 1024) return `${formatNumber(length / (1024 * 1024), 'el-GR', '1.0-2')} MB`
    return `${formatNumber(length / (1024 * 1024 * 1024), 'el-GR', '1.0-2')} GB`
  }
  /** */
  labelChecked(value?: boolean) {
    return (value) ? "✔" : ""
  }
  /** */
  labelDisabled(value?: string, disabled?: boolean) {
    if (disabled) {
      return this.appService.safeHtml(`<span style="color:lightgray;">${value ?? ""}</span>&nbsp;<span style="color:red;">✘</span>`)
    }
    return value ?? ""
  }
  /** */
  labelColor(value?: string, color: "green" | "red" | "black" = "green") {
    if (!value) return ""
    return this.appService.safeHtml(`<b style="color:${color}">${value}</b>`)
  }
  /** */
  labelColorNumber(
    value?: number | firestore.FieldValue | null,
    plus: "green" | "red" | "black" = "green",
    minus: "green" | "red" | "black" = "red",
    zero: "green" | "red" | "black" = "black"
  ) {
    if (typeof value !== `number`) return ""
    const text = formatNumber(value, locale)
    if (value > 0) {
      return this.appService.safeHtml(`<b style="color:${plus}">${text}</b>`)
    }
    if (value < 0) {
      return this.appService.safeHtml(`<b style="color:${minus}">${text}</b>`)
    }
    return this.appService.safeHtml(`<b style="color:${zero}">${text}</b>`)
  }
  /** */
  labelColorCurrency(
    value?: number | firestore.FieldValue | null,
    plus: "green" | "red" | "black" = "green",
    minus: "green" | "red" | "black" = "red",
    zero: "green" | "red" | "black" = "black"
  ) {
    if (typeof value !== `number`) return ""
    const text = formatCurrency(value, locale, currency)
    if (value > 0) {
      return this.appService.safeHtml(`<b style="color:${plus}">${text}</b>`)
    }
    if (value < 0) {
      return this.appService.safeHtml(`<b style="color:${minus}">${text}</b>`)
    }
    return this.appService.safeHtml(`<b style="color:${zero}">${text}</b>`)
  }
  //#endregion
}
