import { CommonModule } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet'
import { MaterialModule } from '../../modules/material.module'
import { AppService } from '../../services/app.service'
/** */
export interface ConfirmData {
  message: string
  action: () => Promise<void>
}
/** */
@Component({
  standalone: true,
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ConfirmComponent implements OnInit {
  /** */
  loading = false
  /** */
  constructor(
    private sheet: MatBottomSheetRef<any>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ConfirmData,
    public appService: AppService
  ) { }
  /** */
  ngOnInit() {
  }
  /** */
  async onOK() {
    try {
      this.loading = true
      await this.data.action()
      this.sheet.dismiss()
    } catch (e) {
      this.appService.showError(e)
    } finally {
      this.loading = false
    }
  }
  /** */
  onCancel() {
    this.sheet.dismiss()
  }
}
