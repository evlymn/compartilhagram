import { Injectable } from '@angular/core';
import { RealtimeService } from '../shared/services/firebase/database/realtime.service';
import { TimelineService } from '../timeline/timeline.service';
import { AuthenticationService } from '../shared/services/firebase/authentication/authentication.service';
import {DataSnapshot, QueryConstraint} from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private _realtime: RealtimeService, private _timeLineService: TimelineService, public auth: AuthenticationService) { }

  async getProfile(id: string) {
    return this._realtime.get('users/' + id);
  }


  get(path: string, ...queryConstraints: QueryConstraint[])  {
    return this._realtime.get(path,...queryConstraints)
  }

  getPostsByUserOnValue(path: string, callback: (snapshot: DataSnapshot) => unknown, ...queryConstraints: QueryConstraint[] ) {
    return this._realtime.onValue(path, callback, ...queryConstraints);
  }
  getPosts(id: string) {
    return this._timeLineService.getPostsByUser(id);
  }
}
