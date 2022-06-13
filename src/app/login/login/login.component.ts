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
  profileUrl = 'background-image: url(\'https://material.angular.io/assets/img/examples/shiba2.jpg\')';
  submitText = 'Logar';
  changeButtonText = 'registre-se';
  isSignUp = false;
  cardOpen = false;
  constructor(public dialog: MatDialog) { }
  signInUp() {
    this.isSignUp = !this.isSignUp;
    this.submitText = this.cardOpen ? 'Registrar' : 'Logar';
    this.changeButtonText = this.cardOpen ? "fazer login" : "registre-se";
  }

  fileChangeEvent(event: any) {
    const dialogRef = this.dialog.open(ImageProfileDialogComponent, {
      // width: '50px',
      // height: '50px',
      panelClass: 'ImageProfileDialogComponent',
      data: event,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profileUrl = result ? `background-image: url(${result})` : this.profileUrl;
    });
  }


  ngOnInit(): void {
  }
}

