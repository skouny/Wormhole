import { Injectable } from '@angular/core';
import { formatCurrency, formatDate, formatNumber } from '@angular/common';
import firestore from 'firebase/firestore'
import * as moment from 'moment-timezone'
import { BehaviorSubject } from 'rxjs';
import { FireService } from './fire.service';
import { AppService, currency, locale } from './app.service';
/** Firestore Database */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  /** */
  constructor(
    public appService: AppService,
    public fireService: FireService
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
