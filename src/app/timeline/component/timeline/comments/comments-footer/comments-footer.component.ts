import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimelineService } from '../../../../timeline.service';
@Component({
  selector: 'app-comments-footer',
  templateUrl: './comments-footer.component.html',
  styleUrls: ['./comments-footer.component.scss']
})
export class CommentsFooterComponent implements OnInit {

  commentText = '';
  id = '';
  constructor(private _route: ActivatedRoute, private _service: TimelineService) {
    this.id = this._route.snapshot.paramMap.get('id') as string;
  }


  saveComent() {
    this._service.createComment(this.id, this.commentText).then(_ => {
      this.commentText = '';
    });
  }


  ngOnInit(): void {
  }
}
