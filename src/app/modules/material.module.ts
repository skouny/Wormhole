import { NgModule } from '@angular/core'
// Material CDK
import { A11yModule } from '@angular/cdk/a11y'
import { CdkTreeModule } from '@angular/cdk/tree'
import { LayoutModule } from '@angular/cdk/layout'
import { PortalModule } from '@angular/cdk/portal'
import { CdkTableModule } from '@angular/cdk/table'
import { OverlayModule } from '@angular/cdk/overlay'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CdkStepperModule } from '@angular/cdk/stepper'
import { ScrollingModule } from '@angular/cdk/scrolling'
// Material Components
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatCardModule } from '@angular/material/card'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSortModule } from '@angular/material/sort'
import { MatTreeModule } from '@angular/material/tree'
import { MatRadioModule } from '@angular/material/radio'
import { MatChipsModule } from '@angular/material/chips'
import { MatBadgeModule } from '@angular/material/badge'
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSliderModule } from '@angular/material/slider'
import { MatSelectModule } from '@angular/material/select'
import { MatDialogModule } from '@angular/material/dialog'
import { MatStepperModule } from '@angular/material/stepper'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDividerModule } from '@angular/material/divider'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
import { DateAdapter, MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
// Material Moment Adapter (depends on moment.js)
import { MomentDateModule, MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
/** */
@NgModule({
  exports: [
    // Material CDK
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    LayoutModule,
    PortalModule,
    ScrollingModule,
    OverlayModule,
    DragDropModule,
    // Material Components
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    // Material Moment Adapter
    MomentDateModule,
    MatMomentDateModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: {
        useUtc: true
      }
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'dddd DD MMMM YYYY',
        },
        display: {
          dateInput: 'dddd DD MMMM YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'dddd DD MMMM YYYY',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 10000,
        //verticalPosition: 'top'
      }
    },
  ]
})
export class MaterialModule { }
