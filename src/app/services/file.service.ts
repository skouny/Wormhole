import { Injectable } from '@angular/core';
import storage from 'firebase/storage';
import { FireService } from './fire.service';
/** Firebase Storage */
@Injectable({
  providedIn: 'root'
})
export class FileService {
  /** */
  storage = storage.getStorage(this.fireService.app)
  /** */
  constructor(
    public fireService: FireService
  ) { }
  /** */
  ref(pathname: string) {
    return storage.ref(this.storage, pathname)
  }
  /** */
  async getStorageURL(pathname: string) {
    const storageRef = this.ref(pathname)
    return storage.getDownloadURL(storageRef)
  }
  /** */
  async getStorageInfo(pathname: string) {
    const storageRef = this.ref(pathname)
    const [url, metadata] = await Promise.all([
      storage.getDownloadURL(storageRef),
      storage.getMetadata(storageRef)
    ])
    return { url, metadata }
  }
  /** */
  async getStorageBytes(pathname: string) {
    const storageRef = this.ref(pathname)
    const [data, metadata] = await Promise.all([
      storage.getBytes(storageRef),
      storage.getMetadata(storageRef)
    ])
    return { data, metadata }
  }
  /** */
  async getStorageBlob(pathname: string) {
    const storageRef = this.ref(pathname)
    const [data, metadata] = await Promise.all([
      storage.getBlob(storageRef),
      storage.getMetadata(storageRef)
    ])
    return { data, metadata }
  }
}
