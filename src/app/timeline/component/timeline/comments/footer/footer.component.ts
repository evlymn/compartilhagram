import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimelineService } from '../../../../timeline.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  commentText = '';
  id = '';
  constructor(private _route: ActivatedRoute, private _service: TimelineService) {
    this.id = this._route.snapshot.paramMap.get('id') as string;
  }


  saveComent() {
    this._service.createComment(this.id, this.commentText);
  }


  ngOnInit(): void {
  }
}
