import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {MessageDeleteComponent} from "../../message-delete/message-delete.component";
import {TimelineService} from "../../../../../timeline.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-message-menu',
  templateUrl: './message-menu.component.html',
  styleUrls: ['./message-menu.component.scss']
})
export class MessageMenuComponent implements OnInit {
  @Input() id!: string;
  @Output() onEdit = new EventEmitter<boolean>();
  constructor(private _service: TimelineService, private _snackBar: MatSnackBar) {
  }

  edit() {
    this.onEdit.emit(true);
  }

  delete() {
    const d = this._snackBar.openFromComponent(MessageDeleteComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'snackBar'
    })

    d.afterDismissed().subscribe(dismiss => {
      if (dismiss.dismissedByAction) {
        this._service.deletePost(this.id).catch();
      }
    })
  }

  ngOnInit(): void {
  }

}
