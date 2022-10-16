import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '../profile.service';

interface Profile {
  uid: string,
  photoURL: string,
  imageURL: string,
  displayName: string,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileId = '';
  profile!: Profile;
  posts: any;
  currentUserUid? : string;

  constructor(private _route: ActivatedRoute, private _service: ProfileService, private _router: Router,) {
    this.requestProfileId();
    this.currentUserUid = _service.auth.user?.uid;
    this._service.auth.authState.subscribe(() => {
      this.geProfileInfo();
      this.getProfilePosts();
    })
  }

  requestProfileId() {
    console.log(this.profile?.uid);
    this.profileId = this._route.snapshot.paramMap.get('profileId') as string;
  }

  logout() {
    this._service.auth.logoutMessage.next({from: 'logout'});
    this._service.auth.signOut();
  }

  getProfilePosts() {
    this.posts = this._service.getPosts(this.profileId);
  }

  geProfileInfo() {
    this._service.getProfile(this.profileId).then(p => {
      this.profile = p.val();
    })
  }

  ngOnInit(): void {
  }
}
