import { CommonModule, formatNumber } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, map } from 'rxjs';
import { MaterialModule } from 'src/app/modules/material.module';
import { AppService } from 'src/app/services/app.service';
import { DataService, behaviorStream } from 'src/app/services/data.service';
import { FuncService } from 'src/app/services/func.service';
import { BottomChipset, Cell, Row, TableComponent, downloadCSV } from 'src/app/tools/table/table.component';
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
  columns = ["Id", "Time", "Price", "Columns", "Numbers", "Tzoker", "Winners", "Jackpot"]
  /** */
  dataSource: Row[] = []
  /** */
  bottomChips: BottomChipset[] = []
  /** */
  loading = false
  /** Tzoker gameId  */
  gameId = 5104
  /** */
  draws$ = behaviorStream(this.dataService.opapDraws.readAll$("drawId", "desc").pipe(map(draws => {
    //
    const listDict: { [number: string]: number } = {}
    const bonusDict: { [number: string]: number } = {}
    //
    this.dataSource = draws.map(x => {
      for (const num of x.winningNumbers.list) {
        const key = formatNumber(num, "el-GR", "2.0-0")
        if (!(key in listDict)) listDict[key] = 0
        listDict[key] += 1
      }
      for (const bonus of x.winningNumbers.bonus) {
        const key = formatNumber(bonus, "el-GR", "2.0-0")
        if (!(key in bonusDict)) bonusDict[key] = 0
        bonusDict[key] += 1
      }
      return {
        "UID": x.UID,
        "Id": x.drawId,
        "Time": () => this.dataService.labelTimestamp(x.drawTime),
        "Price": this.dataService.labelCurrency(x.pricePoints.amount),
        "Columns": this.dataService.labelNumber(x.wagerStatistics.columns),
        "Numbers": x.winningNumbers.list.join(", "),
        "Tzoker": x.winningNumbers.bonus.join(", "),
        "Winners": x.prizeCategories[0].winners || "",
        "Jackpot": this.dataService.labelCurrency(x.prizeCategories[0].jackpot),
      } as Row
    })
    //
    const countList = Object.keys(listDict).map(x => ({ num: x, count: listDict[x] })).sort((a, b) => a.count > b.count ? 1 : -1)
    const countBonus = Object.keys(bonusDict).map(x => ({ num: x, count: listDict[x] })).sort((a, b) => a.count > b.count ? 1 : -1)
    this.bottomChips = [
      {
        header: "Numbers: ",
        chips: countList.map(x => `${x.num}: ${x.count}`)
      },
      {
        header: "Tzoker: ",
        chips: countBonus.map(x => `${x.num}: ${x.count}`)
      }
    ]
    //
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
  /** */
  onExport() {
    const fields: string[][] = []
    fields.push([`Index`, `Number1`, `Number2`, `Number3`, `Number4`, `Number5`, `Number6`])
    const draws = (this.draws$.value ?? []).sort((a, b) => a.drawId > b.drawId ? 1 : -1)
    for (const draw of draws) {
      const line = [draw.drawId]
      line.push(...draw.winningNumbers.list)
      line.push(...draw.winningNumbers.bonus)
      fields.push(line.map(x => formatNumber(x, "el-GR", "2.0-0")))
    }
    downloadCSV(fields, ";", "Numbers.csv")
  }
}
