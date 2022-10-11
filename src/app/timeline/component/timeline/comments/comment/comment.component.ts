import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimelineService } from '../../../../timeline.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!: any;
  iconClass = 'material-symbols-outlined';
  totalFav = 0;
  postId = '';
  totalFavByUser = 0;
  constructor(private _service: TimelineService, private _route: ActivatedRoute) {
    this.postId = this._route.snapshot.paramMap.get('id') as string;
  }

  delete() {
 //   console.log(this.postId, this.comment.id)
    this._service.deleteComment(this.postId, this.comment.id);
  }
  favorite() {
    this._service.setCommentFavorite(this.postId, this.comment.id).then(_ => {
      this.getTotalFavoritesByuser();
      this.getTotalFavorites();
    });
  }

  async getTotalFavoritesByuser() {
    this.totalFavByUser = await this._service.getTotalCommentFavoritesByUser(this.postId, this.comment.id);
  }

  async getTotalFavorites() {
    this.totalFav = await this._service.getTotalCommentFavorites(this.postId, this.comment.id);
  }
  ngOnInit(): void {
    this.getTotalFavoritesByuser();
    this.getTotalFavorites();
  }

}
