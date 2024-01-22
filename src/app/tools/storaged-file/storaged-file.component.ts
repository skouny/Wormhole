import { AfterViewInit, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import * as storage from 'firebase/storage'
import { AppService } from '../../services/app.service'
import { DataService } from '../../services/data.service'
import { MaterialModule } from '../../modules/material.module'
import { FileService } from '../../services/file.service'
/** https://firebase.google.com/docs/storage/web/start */
@Component({
  standalone: true,
  selector: 'storaged-file',
  templateUrl: './storaged-file.component.html',
  styleUrls: ['./storaged-file.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class StoragedFileComponent implements AfterViewInit {
  //#region Init
  /** File path under default bucket */
  @Input() filePath!: string
  /** file name without extention */
  @Input() fileName!: string
  /** Acepted Extentions e.g.: ".jpg, .png, .pdf" */
  @Input() extentions: string = ""
  /** Maximum accepted file size */
  @Input() fileSizeLimit = 0
  /** */
  storageRef!: storage.StorageReference
  /** Upload progress */
  progress = 0
  /** */
  fileURL?: string
  /** */
  metadata?: storage.FullMetadata
  /** */
  constructor(
    public appService: AppService,
    public fileService: FileService,
    public dataService: DataService
  ) { }
  /** */
  ngAfterViewInit() {
    this.storageRef = storage.ref(this.fileService.storage, `${this.filePath}/${this.fileName}`)
    this.fileLoad()
  }
  //#endregion
  //#region Methods
  /** */
  onFileSelected(event: Event) {
    if (!event.target) return
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files?.length) return
    // Select file
    const file = files[0]
    // Validate
    if (this.fileSizeLimit && file.size > this.fileSizeLimit) {
      this.appService.showMessage("This file is too large")
      return
    }
    // Upload
    this.fileUpload(file)
  }
  /** */
  fileUpload(file: File) {
    //
    const uploadTask = storage.uploadBytesResumable(this.storageRef, file)
    //
    uploadTask.on('state_changed',
      // Observe the upload progress
      (snapshot) => {
        this.progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      // Handle upload errors
      (error) => {
        this.appService.showError(error)
      },
      // Upload completed successfully
      () => {
        this.fileLoad()
      }
    )
  }
  /** */
  async fileLoad() {
    try {
      const [fileURL, metadata] = await Promise.all([
        storage.getDownloadURL(this.storageRef),
        storage.getMetadata(this.storageRef)
      ])
      this.fileURL = fileURL
      this.metadata = metadata
    } catch {
      this.fileURL = undefined
      this.metadata = undefined
    }
  }
  /** */
  async fileDelete() {
    try {
      await storage.deleteObject(this.storageRef)
      await this.fileLoad()
    } catch (e) {
      this.appService.showError(e)
    }
  }
  //#endregion
  //#region Labels
  /** */
  labelInput() {
    return (this.metadata?.size)
      ? `${this.dataService.labelBytes(this.metadata.size)} (${this.metadata.contentType})`
      : ``
  }
  /** */
  labelHint() {
    return (this.fileSizeLimit)
      ? `Maximum file size ${this.dataService.labelBytes(this.fileSizeLimit)}`
      : ``
  }
  //#endregion
  /** */
  get downloadFileName() {
    switch (this.metadata?.contentType) {
      case "text/plain":
        return `${this.fileName}.txt`
      case "application/pdf":
        return `${this.fileName}.pdf`
      default:
        return `${this.fileName}`
    }
  }
}
