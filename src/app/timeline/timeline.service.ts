import {Injectable} from '@angular/core';
import {DataSnapshot, QueryConstraint} from 'firebase/database';
import {Subject} from 'rxjs';
import {RealtimeService} from '../shared/services/firebase/database/realtime.service';
import {StorageService} from '../shared/services/firebase/storage/storage.service';
import {AuthenticationService} from '../shared/services/firebase/authentication/authentication.service';
import {equalTo, orderByChild,} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  public fileMessage = new Subject<File>();
  public postMessage = new Subject<boolean>();

  constructor(private _realtime: RealtimeService,
              private _storage: StorageService,
              public auth: AuthenticationService) {
  }

  async getPost(id: string): Promise<any> {
    const post = await this._realtime.get(`timeline/messages/${id}`);
    if (post.exists())
      return post.val()
  }

  getMessages(callback: (snapshot: DataSnapshot) => unknown, ...queryConstraints: QueryConstraint[]) {
    return this._realtime.onValue('timeline/messages/', callback, ...queryConstraints)
  }

  getComments(id: string) {
    return this._realtime.onValueChanges('timeline/comments/' + id);
  }

  async fileToBase64(file: File) {
    return this._storage.fileToBase64(file);
  }

  getMessagesAsync() {
    return this._realtime.onValueChanges('timeline/messages/', 'id', orderByChild('bad_word'),
      equalTo(true));
  }

  async setFavorite(id: string) {
    const path = `timeline/favorites/messages/${id}/${this.auth.user?.uid}`;
    const snapshot = await this._realtime.get(path);
    if (!snapshot.exists()) {
      return this.createFavorite(id).then(() => this.createFavoriteLookAhead(id, path)
      );
    } else {
      return this.removeFavorite(id).then(() => this.removeFavoriteLookAhead(id));
    }
  }

  async createFavorite(id: string) {
    return this._realtime.set(`timeline/favorites/messages/${id}/${this.auth.user?.uid}`, {
      uid: this.auth.user?.uid, displayName: this.auth.user?.displayName, time: new Date().valueOf()
    })
  }

  async createFavoriteLookAhead(postId: string, path: string) {
    return this._realtime.add(`timeline/look-ahead/favorites/timeline/${this.auth.user?.uid}`, {
      postId, path
    })
  }

  async removeFavorite(id: string) {
    return this._realtime.delete(`timeline/favorites/messages/${id}/${this.auth.user?.uid}`);
  }

  async removeFavoriteLookAhead(postId: string) {
    this._realtime.get(`timeline/look-ahead/favorites/timeline/${this.auth.user?.uid}`,
      orderByChild('postId'), equalTo(postId)).then(datasnapshot => {
      datasnapshot.forEach(child => {
        const location = child.ref.toString().substring(child.ref.root.toString().length)
        this._realtime.delete(location);
        return;
      })
    })
  }

  async getTotalFavorites(id: string) {
    const total = await this._realtime.get(`timeline/favorites/messages/${id}`);
    return total.size;
  }

  async getTotalFavoritesByUser(id: string) {
    const total = await this._realtime.get(`timeline/favorites/messages/${id}/${this.auth.user?.uid}`);
    return total.size;
  }

  async setCommentFavorite(postId: string, commentId: string) {
    const path = `timeline/favorites/comments/${postId}/${commentId}/${this.auth.user?.uid}`;
    const snapshot = await this._realtime.get(path);
    if (!snapshot.exists()) {
      return this.createFavoriteComment(postId, commentId).then(() =>
        this.createCommentFavoriteLookAhead(postId, commentId, path)
      )
    } else {
      return this.removeCommentFavorite(postId, commentId).then(() =>
        this.removeCommentFavoriteLookAhead(postId, commentId, path)
      )
    }
  }

  async createCommentFavoriteLookAhead(postId: string, commentId: string, path: string) {
    return this._realtime.add(`timeline/look-ahead/favorites/comments/${this.auth.user?.uid}`, {
      postId,
      commentId,
      path
    });
  }

  async removeCommentFavoriteLookAhead(postId: string, commentId: string, path: string) {
    this._realtime.get(`timeline/look-ahead/favorites/comments/${this.auth.user?.uid}`,
      orderByChild('commentId'), equalTo(commentId)).then(datasnapshot => {
      datasnapshot.forEach(child => {
        const location = child.ref.toString().substring(child.ref.root.toString().length);
        this._realtime.delete(location);
      })
    })
  }

  async createFavoriteComment(postId: string, commentId: string) {
    return this._realtime.set(`timeline/favorites/comments/${postId}/${commentId}/${this.auth.user?.uid}`, {
      uid: this.auth.user?.uid, displayName: this.auth.user?.displayName, time: new Date().valueOf()
    })
  }

  async removeCommentFavorite(postId: string, commentId: string) {
    return this._realtime.delete(`timeline/favorites/comments/${postId}/${commentId}/${this.auth.user?.uid}`);
  }

  async getTotalCommentFavorites(postId: string, commentId: string) {
    const total = await this._realtime.get(`timeline/favorites/comments/${postId}/${commentId}/`);
    return total.size;
  }

  async getTotalCommentFavoritesByUser(postId: string, commentId: string) {
    const total = await this._realtime.get(`timeline/favorites/comments/${postId}/${commentId}/${this.auth.user?.uid}`);
    return total.size;
  }

  createComment(postId: string, comment: string) {
    const commentId = this._realtime.createId();
    const path = `timeline/comments/${postId}/${commentId}`;
    return this._realtime.set(path, {
      comment,
      time: new Date().valueOf(),
      displayName: this.auth.user?.displayName,
      id: postId,
      uid: this.auth.user?.uid,
      photoURL: this.auth.user?.photoURL,
    }).then(() => this.createCommentLookAhead(postId, commentId!, path))
  }

  async createCommentLookAhead(postId: string, commentId: string, path: string) {
    return this._realtime.add(`timeline/look-ahead/comments/${this.auth.user?.uid}`, {
      postId,
      commentId,
      path
    })
  }


  deleteComment(postId: string, commentId: string) {
    return this._realtime.delete(`timeline/comments/${postId}/${commentId}/`).then(() => this.removeCommentLookAhead(commentId));
  }

  async removeCommentLookAhead(commentId: string) {
    this._realtime.get(`timeline/look-ahead/comments/${this.auth.user?.uid}`,
      orderByChild('commentId'), equalTo(commentId)).then(datasnapshot => {
      datasnapshot.forEach(child => {
        const location = child.ref.toString().substring(child.ref.root.toString().length);
        this._realtime.delete(location);
      })
    })
  }


  async getTotalComments(id: string) {
    const total = await this._realtime.get(`timeline/comments/${id}`);
    return total.size;
  }

  getPostsByUser(id: string) {
    return this._realtime.onValueChanges('/timeline/messages_by_user/' + id);
  }


  async editPost(id: string, data: any) {
    data.bad_word = false;
    return this._realtime.update('timeline/messages/' + id, data);
  }

  async savePost(file: File, postText: string) {
    const uid = this.auth.user?.uid;
    const displayName = this.auth.user?.displayName;
    const id = this._realtime.createId();
    const local = `timeline/${uid}/${id}`;
    const objectName = `${local}/${file.name}`;
    const objectId = `compartilhagram-com.appspot.com/${objectName}`
    console.log(uid);
    await this._realtime.set('timeline/messages/' + id, {
      uid,
      displayName: displayName!,
      photoURL: this.auth.user?.photoURL,
      objectName,
      objectId,
      postText: postText,
      dateTime: new Date().getTime()
    });

    const updloadTask = this._storage.uploadBytesResumable(objectName, file,
      {
        cacheControl: 'public, max-age=31536000', customMetadata: {
          uid: uid!,
          displayName: displayName as string,
          fileName: file.name,
          id: id as string
        }
      }
    )
    updloadTask.then(async (snapshot: { ref: { fullPath: string; }; }) => {
      const url = await this._storage.getDownloadURL(snapshot.ref.fullPath);
      await this._realtime.update('timeline/messages/' + id, {
        imageURL: url,
      });
    })
    return this._storage.percentage(updloadTask)
  }

  deletePost(id: string) {
    return this._realtime.delete('timeline/messages/' + id);
  }

}
