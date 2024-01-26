import { Component, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { BehaviorSubject, combineLatest, of, switchMap, map, sampleTime } from 'rxjs'
import { MaterialModule } from '../../modules/material.module'
/** Get the text between 2 strings */
const stringBetween = (text: string, begin: string, end: string) => {
  const startIndex = text.indexOf(begin) + begin.length
  const endIndex = text.indexOf(end)
  return text.substring(startIndex, endIndex).trim()
}
/** Download string as a text file. e.g. CSV */
export const downloadText = (text: string, fileName = "Download.txt", fileType = "text/csv;charset=utf-8;") => {
  const blob = new Blob([text], { type: fileType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
/** Download two-dimentional string array as CSV file */
export const downloadCSV = (fields: string[][], separator = ";", fileName = "Download.csv", fileType = "text/csv;charset=utf-8;") => {
  const csv = fields.map(x => x.join(separator)).join("\r\n")
  downloadText(csv, fileName, fileType)
}
/** Table headers */
export interface Headers {
  [column: string]: string
}
/** Table row */
export interface Row {
  [column: string]: string | SafeHtml | Function | boolean | undefined
}
/** Table cell */
export interface Cell {
  /** */
  row: Row
  /** */
  col: string
}
/** Bottom Chips */
export interface BottomChipset {
  /** */
  header: string
  /** */
  chips: string[]
}
/** */
@Component({
  standalone: true,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class TableComponent {
  /** */
  @Input() columns: string[] = []
  /** */
  @Input() headers: Headers = {}
  /**  */
  @Input() data$ = new BehaviorSubject<Row[] | null>(null)
  get data() { return this.data$.value }
  @Input() set data(value) { this.data$.next(value) }
  /** */
  @Input() pageSize: number = 15
  /** show create? */
  @Input() create: boolean = false
  /** show refresh? */
  @Input() refresh: boolean = false
  /** show print? */
  @Input() print: boolean = false
  /** show filter? */
  @Input() filter: boolean = true
  /** show export? */
  @Input() export: boolean = false
  /** show pointer? */
  @Input() pointer: boolean = true
  /** show compact table */
  @Input() compact: boolean = false
  /** when true, show progress bar and disable buttons */
  @Input() loading: boolean = false
  /** show chips in the bottom of the table */
  @Input() bottomChips$ = new BehaviorSubject<BottomChipset[] | undefined>(undefined)
  get bottomChips() { return this.bottomChips$.value }
  @Input() set bottomChips(value) { this.bottomChips$.next(value) }
  /** */
  @Output() addDocument = new EventEmitter<void>()
  /** */
  @Output() doRefresh = new EventEmitter<void>()
  /** */
  @Output() printOut = new EventEmitter<void>()
  /** */
  @Output() cellClick = new EventEmitter<Cell>()
  /** */
  sort$ = new BehaviorSubject<MatSort | undefined>(undefined)
  get sort() { return this.sort$.value }
  @ViewChild(MatSort) set sort(value) { this.sort$.next(value) }
  /** */
  paginator$ = new BehaviorSubject<MatPaginator | undefined>(undefined)
  get paginator() { return this.paginator$.value }
  @ViewChild("paginator") set paginator(value) { this.paginator$.next(value) }
  /** */
  @ViewChild("divTable") divTable?: ElementRef<HTMLDivElement>
  /** */
  @ViewChild("divPaginator") divPaginator?: ElementRef<HTMLDivElement>
  /** */
  dataSource = new MatTableDataSource<Row>()
  /** */
  stream$ = combineLatest([
    this.sort$, this.paginator$
  ]).pipe(switchMap(([sort, paginator]) => {
    return combineLatest([this.data$, of(sort), of(paginator)])
  })).pipe(sampleTime(500)).pipe(map(([data, sort, paginator]) => {
    const filter = this.dataSource.filter
    const rows = data || []
    // Speedup! For some reason, first non-empty data source should be small.
    if (!this.dataSource.data.length && rows.length > 200) {
      this.dataSource = new MatTableDataSource<Row>(rows.slice(0, 200))
      // Ensure for the next emit
      setTimeout(() => { this.data$.next(this.data) }, 1000)
    } else {
      this.dataSource = new MatTableDataSource<Row>(rows)
    }
    //console.log(this.dataSource.data)
    this.dataSource.filter = filter
    if (paginator) this.dataSource.paginator = paginator
    if (sort) this.dataSource.sort = sort
    return true
  }))
  /** */
  constructor(
    public sanitizer: DomSanitizer
  ) { }
  /** */
  get csv() {
    const lines: string[] = []
    // Headers
    lines.push(
      this.columns.join(";")
    )
    // Data
    for (const row of (this.data || []).filter(x => !x["{disabled}"])) {
      lines.push(
        this.columns.map(x => {
          const value = row[x]
          if (typeof value === "string") return `${value}`
          if (typeof value === "boolean") return `${value}`
          if (typeof value === "function") return `${value()}`
          if (!value) return ""
          return (() => {
            const div = document.createElement(`div`)
            div.innerHTML = stringBetween(`${value}`, " [property]=binding: ", " (see ")
            return div.textContent || div.innerText
          })() || ""
        }).join(";")
      )
    }
    // Join lines
    return lines.join("\r\n")
  }
  /** */
  onAdd() {
    this.addDocument.emit()
  }
  /** */
  onRefresh() {
    this.doRefresh.emit()
  }
  /** */
  onPrint() {
    this.printOut.emit()
  }
  /** */
  onCell(row: Row, col: string) {
    this.cellClick.emit({ row, col })
  }
  /** */
  onExport() {
    downloadText(this.csv, "Download.csv")
  }
  /** */
  isFunction(value: any) {
    return (typeof value === `function`) ? true : false
  }
}
