import {Injectable} from '@angular/core';
import {AuthenticationService} from '../shared/services/firebase/authentication/authentication.service';
import {StorageService} from '../shared/services/firebase/storage/storage.service';
import {RealtimeService} from '../shared/services/firebase/database/realtime.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public auth: AuthenticationService,
              private storage: StorageService,
              private database: RealtimeService,
              private router: Router) {
  }

  async login(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  async signUp(email: string, password: string, displayName: string, image: string) {
    const credentials = await this.auth.createUserWithEmailAndPassword(email, password);
    const file = await this.storage.base64ToFile(image, credentials.user.uid, {
      type: 'image/jpeg',
    });
    const uploadTask = this.storage.uploadBytesResumable(`imagens/user/avatar/${credentials.user.uid}.jpeg`, file,
      {
        cacheControl: 'public, max-age=31536000', customMetadata: {
          uid: credentials.user.uid,
          displayName,
        }
      }
    )

    uploadTask.then(async snap => {
      const url = await this.storage.getDownloadURL(snap.ref.fullPath)
      await this.auth.updateProfile({
        displayName,
        photoURL: url
      })
      await this.logUser('users/' + credentials.user.uid, {
        displayName,
        photoURL: url,
        dateTime: new Date().getTime(),
        provider: credentials.providerId,
        uid: credentials.user.uid
      });
      this.router.navigate(['timeline']).then(() => null);
    });

    return this.storage.percentage(uploadTask)
  }

  async logUser(path: string, data: any) {
    return this.database.set(path, data);
  }
}


