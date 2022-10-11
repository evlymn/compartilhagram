import { Component, OnInit } from '@angular/core';
import { TimelineService } from '../../../timeline.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  comments: any;
  id = '';
  post: any;

  constructor(private _service: TimelineService, private _route: ActivatedRoute) {
    this.id = this._route.snapshot.paramMap.get('id') as string;
    this.getComments();
    this.getPost();
  }

  async getPost() {
    this.post = await this._service.getPost(this.id);
    this._service.getPost(this.id).then(d=>{
  //    console.log(d)
    })
  }
  getComments() {
    this.comments = this._service.getComments(this.id);
  }

  ngOnInit(): void {
  }

}
