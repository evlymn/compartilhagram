import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimelineService } from '../../../timeline.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  fragment = '';
  constructor(public service: TimelineService, private _route: ActivatedRoute) {
    this.getMessages();
  }
  items: any;

  getMessages() {
    this.items = this.service.getMessagesAsync();
  }

  getTimeline() {

    this.service.getMessages(d => {
      d.forEach(c => {
        this.items.set(c.key?.toString(), c.val());
      })
     // console.log(this.items);
    })
  }

  ngOnInit(): void {
    this._route.fragment.subscribe(fragment => { this.fragment = fragment as string; });
  }

  ngAfterViewChecked(): void {
    try {
        if(this.fragment) {
              document.querySelector('#' + this.fragment)?.scrollIntoView({behavior: "smooth"});
        }
    } catch (e) { }
  }
}
