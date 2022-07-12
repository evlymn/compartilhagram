import { Injectable } from '@angular/core';
import { RealtimeService } from '../shared/services/firebase/database/realtime.service';
import { TimelineService } from '../timeline/timeline.service';
import { AuthenticationService } from '../shared/services/firebase/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private _realtime: RealtimeService, private _timeLineService: TimelineService, public auth: AuthenticationService) { }

  async getProfile(id: string) {
    return this._realtime.get('user/' + id);
  }

  getPosts(id: string) {
    return this._timeLineService.getPostsByUser(id);
  }
}
