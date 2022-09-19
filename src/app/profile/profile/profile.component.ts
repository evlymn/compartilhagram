import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import {orderBy} from "@angular/fire/firestore";
import {orderByKey} from "@angular/fire/database";

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
    this.service.auth.authState.subscribe(()=>{
      this.geProfile();
      this.getPosts();
     // this.getPosts2();
    })


  }



  logout() {
    this.service.auth.logoutMessage.next({ from: 'logout'});
    this.service.auth.signOut();
  }
  getPosts2() {


  }
  getPosts() {
    console.log('ddd');



    this.service.get('/timeline/messages_by_user/' + this.id).then(d=> {

      console.log(d.val());
    })


    this.posts = this.service.getPosts(this.id);

    this.service.getPosts(this.id).subscribe(d=>{

      console.log(d.values());
    })
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
