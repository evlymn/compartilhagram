import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'compartilhagram';

  constructor() {
    window.addEventListener('DOMContentLoaded', () => {

      // const appCheck = initializeAppCheck(app, {
      //   provider: new ReCaptchaV3Provider('abcdefghijklmnopqrstuvwxy-1234567890abcd'),

      //   // Optional argument. If true, the SDK automatically refreshes App Check
      //   // tokens as needed.
      //   isTokenAutoRefreshEnabled: true
      // });


    })
  }

}
