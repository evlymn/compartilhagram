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
import { FormControl, NgForm, Validators } from '@angular/forms';

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
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  rPassword = new FormControl('', [Validators.required]);
  submited =false;
  img64 ='';
  imageUrl = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
  avatarStyle = `background-image: url(${this.imageUrl})`;
  submitText = 'Logar';
  changeButtonText = 'registre-se';
  isSignUp = false;
  constructor(public dialog: MatDialog) { }
  signInUp() {
    this.isSignUp = !this.isSignUp;
    this.img64 ='';
    this.submited =false
    this.changeAvatarStyle(this.imageUrl);
    if (!this.isSignUp){

    }
  }

  changeAvatarStyle(imageUrl: string) {
    this.avatarStyle = imageUrl ? `background-image: url(${imageUrl})` : this.avatarStyle;
  }

  fileChangeEvent(event: any) {
    if (event.target.files[0]) {
      const dialogRef = this.dialog.open(ImageProfileDialogComponent, {
        panelClass: 'ImageProfileDialogComponent',
        data: event,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.img64 = result;

          this.changeAvatarStyle( this.img64)
        }
      });
    }
  }

  submit(f: NgForm) {
    this.submited =true;
    if(f.invalid)
      console.log('dd');
  }
  debugErros(erros: any) {
    console.log(JSON.stringify(erros));
  }

  ngOnInit(): void {
  }
}

