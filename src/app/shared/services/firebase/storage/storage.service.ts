import { Injectable } from '@angular/core';
import {
  Storage,
  ref,
  deleteObject,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
  UploadMetadata,
  StringFormat,
  UploadTask,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }


  percentage(task: UploadTask) {
    return percentage(task);
  }

  uploadBytes(path: string, file: any, metadata?: UploadMetadata) {
    const storageRef = ref(this.storage, path);
    return uploadBytes(storageRef, file, metadata);
  }

  uploadString(path: string, file: string, format: StringFormat, metadata?: UploadMetadata) {
    const storageRef = ref(this.storage, path);
    return uploadString(storageRef, file, format, metadata);
  }

  uploadBytesResumable(path: string, file: any, metadata?: UploadMetadata) {
    const storageRef = ref(this.storage, path);
    return uploadBytesResumable(storageRef, file, metadata);
  }

  getDownloadURL(path: string) {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }

  delete(path: string) {
    const storageRef = ref(this.storage, path);
    return deleteObject(storageRef);
  }

  fileToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async base64ToFile(base64: string, fileName: string, options: any) {
    return fetch(base64).then(res =>
      res.blob().then(blob => new File([blob], fileName, options))
    );
  }
}
