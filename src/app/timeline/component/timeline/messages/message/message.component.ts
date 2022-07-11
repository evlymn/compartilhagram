import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { TimelineService } from '../../../../timeline.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message!: any;
  resizeObservable!: Observable<Event>
  resizeSubscription!: Subscription
  resizeObservable2!: Observable<Event>
  resizeSubscription2!: Subscription
  width = 'width:' + window.innerWidth + ' %';
  iconClass = 'material-symbols-outlined';
  totalFavByUser = 0;
  totalFav = 0;
  currentUid = '';
  constructor(private _service: TimelineService) {
    this.currentUid =   this._service.auth.user?.uid as string;
  //   console.log(this._service.auth.user)
  }


  getTotalFavoritesByUser() {
    this._service.getTotalFavoritesByUser(this.message.id).then(t => {
      this.totalFavByUser = t;
    });
  }

  getTotalFavorites() {
    this._service.getTotalFavorites(this.message.id).then(t => {
      this.totalFav = t;
    });
  }

  delete(id: string) {
    this._service.deletePost(id);
  }
  touchtime = 0;
  doubleClick(id: string) {
    if (this.touchtime === 0) {
      this.touchtime = new Date().getTime();
    } else {
      if (new Date().getTime() - this.touchtime < 400) {
        this.favorite(id);
        this.touchtime = 0;
      } else {
        this.touchtime = new Date().getTime();
      }
    }
  }

  favorite(id: string) {
    this._service.setFavorite(id).then(_ => {
      this.getTotalFavoritesByUser();
      this.getTotalFavorites();
    });
  }
  ngOnInit(): void {
    this.getTotalFavoritesByUser();
    this.getTotalFavorites();
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe((evt: any) => {
      this.width = 'width:' + evt.target?.innerWidth;
      console.log('event: ', evt.target?.innerWidth)
    })


  }
}
