import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './component/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatRippleModule} from '@angular/material/core';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatDialogModule} from '@angular/material/dialog';
import {ImageProfileDialogComponent} from './component/login/image-profile-dialog/image-profile-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CompareToDirective} from './directives/compare-to/compare-to.directive';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ErrorMessageDialogComponent} from './component/login/error-message-dialog/error-message-dialog.component';


@NgModule({
  declarations: [
    LoginComponent,
    ImageProfileDialogComponent,
    CompareToDirective,
    ErrorMessageDialogComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatRippleModule,
    ImageCropperModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class LoginModule {
}
