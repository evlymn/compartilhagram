import { Injectable } from '@angular/core';
import { AuthenticationService } from '../shared/services/firebase/authentication/authentication.service';
import { StorageService } from '../shared/services/firebase/storage/storage.service';
import { RealtimeService } from '../shared/services/firebase/database/realtime.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: AuthenticationService, private storage: StorageService, private database: RealtimeService) { }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(c => {
      console.log(c);
    });
  }

  async signUp(email: string, password: string, displayName: string, imagem: string) {
    const credentials = await this.auth.createUserWithEmailAndPassword(email, password);
    const file = await this.storage.base64ToFile(imagem, credentials.user.uid, {
      type: 'image/jpeg',
    });
    const updloadTask = this.storage.uploadBytesResumable(`imagens/user/avatar/${credentials.user.uid}.jpeg`, file,
      {
        cacheControl: 'public, max-age=31536000', customMetadata: {
          uid: credentials.user.uid,
          displayName,
        }
      }
    )


    updloadTask.then(async snap => {
      const url = await this.storage.getDownloadURL(snap.ref.fullPath)
      this.auth.updateProfile({
        displayName,
        photoURL: url
      })
      this.logUser('user/' + credentials.user.uid, {
        displayName,
        photoURL: url,
        dateTime: new Date().getTime(),
        provider: credentials.providerId,
      })
    });

    return this.storage.percentage(updloadTask)
  }

  logUser(path: string, data: any) {
    this.database.set(path, data);
  }
}


