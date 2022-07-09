import { Component, OnInit } from '@angular/core';
import { TimelineService } from '../../../timeline.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(public service: TimelineService) {
    this.getMessages();
  }
  items: any;
  getMessages() {
    this.items = this.service.getMessagesAsync();
    this.service.getMessagesAsync().subscribe(d => {
      console.log(d);
    })
  }

  getTimeline() {

    this.service.getMessages(d => {
      d.forEach(c => {
        this.items.set(c.key?.toString(), c.val());
      })
      console.log(this.items);
    })
  }

  ngOnInit(): void {
  }

}
