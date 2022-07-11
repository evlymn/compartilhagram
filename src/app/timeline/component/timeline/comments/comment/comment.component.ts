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
  id = '';
  totalFavByUser = 0;
  constructor(private _service: TimelineService, private _route: ActivatedRoute) {
    this.id = this._route.snapshot.paramMap.get('id') as string;
  }

  favorite() {
    this._service.setCommentFavorite(this.id, this.comment.id).then(_ => {
      this.getTotalFavoritesByuser();
      this.getTotalFavorites();
    });
  }

  async getTotalFavoritesByuser() {
    this.totalFavByUser = await this._service.getTotalCommentFavoritesByUser(this.id, this.comment.id);
  }

  async getTotalFavorites() {
    this.totalFav = await this._service.getTotalCommentFavorites(this.id, this.comment.id);
  }
  ngOnInit(): void {
    this.getTotalFavoritesByuser();
    this.getTotalFavorites();
  }

}
