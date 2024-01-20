import { Injectable } from '@angular/core';
import { getStorage, ref, getMetadata, getDownloadURL, getBlob, getBytes } from 'firebase/storage';
import { FireService } from './fire.service';
/** Firebase Storage */
@Injectable({
  providedIn: 'root'
})
export class FileService {
  /** */
  storage = getStorage(this.fireService.app)
  /** */
  constructor(
    public fireService: FireService
  ) { }
  /** */
  ref(pathname: string) {
    return ref(this.storage, pathname)
  }
  /** */
  async getStorageURL(pathname: string) {
    const storageRef = this.ref(pathname)
    return getDownloadURL(storageRef)
  }
  /** */
  async getStorageInfo(pathname: string) {
    const storageRef = this.ref(pathname)
    const [url, metadata] = await Promise.all([
      getDownloadURL(storageRef),
      getMetadata(storageRef)
    ])
    return { url, metadata }
  }
  /** */
  async getStorageBytes(pathname: string) {
    const storageRef = this.ref(pathname)
    const [data, metadata] = await Promise.all([
      getBytes(storageRef),
      getMetadata(storageRef)
    ])
    return { data, metadata }
  }
  /** */
  async getStorageBlob(pathname: string) {
    const storageRef = this.ref(pathname)
    const [data, metadata] = await Promise.all([
      getBlob(storageRef),
      getMetadata(storageRef)
    ])
    return { data, metadata }
  }
}
