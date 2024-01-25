import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, map } from 'rxjs';
import { MaterialModule } from 'src/app/modules/material.module';
import { AppService } from 'src/app/services/app.service';
import { DataService, behaviorStream } from 'src/app/services/data.service';
import { FuncService } from 'src/app/services/func.service';
import { Cell, Row, TableComponent } from 'src/app/tools/table/table.component';
/** */
@Component({
  standalone: true,
  selector: 'form-tzoker',
  templateUrl: './tzoker.component.html',
  styleUrl: './tzoker.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    TableComponent,
  ],
})
export class FormTzokerComponent implements OnDestroy {
  /** */
  destroy$ = new Subject<void>()
  /** */
  columns = ["Id", "Time", "Price", "Wagers", "Numbers", "Tzoker", "Winnings1", "Winnings2"]
  /** */
  dataSource: Row[] = []
  /** */
  loading = false
  /** Tzoker gameId  */
  gameId = 5104
  /** */
  draws$ = behaviorStream(this.dataService.opapDraws.readAll$().pipe(map(draws => {
    console.log(draws)
    this.dataSource = draws.map(x => {
      return {
        "UID": x.UID,
        "Id": x.drawId
      } as Row
    })
    return draws
  })), this.destroy$)
  /** */
  constructor(
    public appService: AppService,
    public dataService: DataService,
    public funcService: FuncService,
  ) { }
  /** */
  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.destroy$.unsubscribe()
  }
  /** */
  async updateQuick() {
    try {
      this.loading = true
      const ret = await this.funcService.updateOpapQuickV3(this.gameId)
      console.log(ret)
    } catch { }
    finally {
      this.loading = false
    }
  }
  /** */
  async updateAll() {
    try {
      this.loading = true
      const ret = await this.funcService.updateOpapAllV3(this.gameId)
      console.log(ret)
    } catch { }
    finally {
      this.loading = false
    }
  }
  /** */
  async updateDraw(drawId: number) {
    try {
      this.loading = true
      const ret = await this.funcService.updateOpapV3(this.gameId, drawId)
      console.log(ret)
    } catch { }
    finally {
      this.loading = false
    }
  }
  /** */
  onTableCell(event: Cell) {
    const column = event.col as string
    const UID = event.row[`UID`] as string
    switch (column) {
      default:
        // this.appService.dialogOpen(TableDialogBucketComponent, {
        //     UID: UID
        // })
        break
    }
  }
}
