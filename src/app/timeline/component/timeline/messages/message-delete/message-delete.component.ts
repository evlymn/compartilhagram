import { Component, OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-message-delete',
  templateUrl: './message-delete.component.html',
  styleUrls: ['./message-delete.component.scss']
})
export class MessageDeleteComponent implements OnInit {

  constructor(private snackBarRefef: MatSnackBarRef<MessageComponent>) {
  }
  dismiss() {
    this.snackBarRefef.dismiss();
  }
  delete() {
    this.snackBarRefef.dismissWithAction();
  }

  ngOnInit(): void {
  }

}
