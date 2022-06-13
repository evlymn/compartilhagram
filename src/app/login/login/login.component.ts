import { Component, OnInit, } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ImageProfileDialogComponent } from './image-profile-dialog/image-profile-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  animations: [
    trigger('openCloseAvatar', [
      state('open',
        style({
          opacity: 1,
          height: '100px',
          width: '100px'
        })
      ),
      state('closed', style({
        opacity: 0,
        height: '0px',
        width: '0px'
      })),
      transition('open => closed', [
        animate('.5s',
        ),

      ]),
      transition('closed => open', [
        animate('.5s',
        ),
      ]),
    ]),
    trigger('openCloseFields', [
      state('open',
        style({
          opacity: 1,
        })
      ),
      state('closed', style({
        opacity: 0,
        height: '0px',
        width: '0px'
      })),
      transition('open => closed', [
        animate('.6s'),

      ]),
      transition('closed => open', [
        animate('.6s',
        ),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  imageUrl = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
  avatarStyle = `background-image: url(${this.imageUrl})`;
  submitText = 'Logar';
  changeButtonText = 'registre-se';
  isSignUp = false;
  constructor(public dialog: MatDialog) { }
  signInUp() {
    this.isSignUp = !this.isSignUp;
    if (!this.isSignUp)
      this.changeAvatarStyle(this.imageUrl);
  }

  changeAvatarStyle(imageUrl: string) {
    this.avatarStyle = imageUrl ? `background-image: url(${imageUrl})` : this.avatarStyle;
  }

  fileChangeEvent(event: any) {
    const dialogRef = this.dialog.open(ImageProfileDialogComponent, {
      panelClass: 'ImageProfileDialogComponent',
      data: event,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeAvatarStyle(result)
      }
    });
  }


  ngOnInit(): void {
  }
}

