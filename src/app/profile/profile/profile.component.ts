import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id = '';
  profile: any;
  posts: any;
  constructor(private _route: ActivatedRoute, public service: ProfileService, private _router: Router,) {
    this.id = this._route.snapshot.paramMap.get('id') as string;
    this.geProfile();
    this.getPosts();
  }


  logout() {
    this.service.auth.signOut();
  }
  getPosts() {
    this.posts = this.service.getPosts(this.id);
  }

  showPost(id: string) {
    this._router.navigateByUrl('timeline/#' + id).catch(reason => console.log(reason));
  }
  geProfile() {
    this.service.getProfile(this.id).then(p => {
      this.profile = p.val();
    })
  }
  ngOnInit(): void {
    this.geProfile();
  }

}
