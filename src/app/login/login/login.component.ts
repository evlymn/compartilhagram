import { Component, OnInit, } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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
  submitText = 'Logar';
  changeButtonText = 'registre-se';
  isSignUp = false;
  cardOpen = false;
  constructor() { }
  signInUp() {
    this.isSignUp = !this.isSignUp;
    this.submitText = this.cardOpen ? 'Registrar' : 'Logar';
    this.changeButtonText =  this.cardOpen ? "fazer login": "registre-se" ;
  }
  ngOnInit(): void {
  }
}

