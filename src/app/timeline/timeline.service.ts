import { Injectable } from '@angular/core';
import { DataSnapshot, QueryConstraint } from 'firebase/database';
import { RealtimeService } from '../shared/services/firebase/database/realtime.service';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private _realtime: RealtimeService) { }

  getMessages( callback: (snapshot: DataSnapshot) => unknown, ...queryConstraints: QueryConstraint[]) {
   return this._realtime.onValue('timeline', callback,...queryConstraints)
  }

  getMessagesAsync() {
    return this._realtime.onValueChanges('user');
  }
}
