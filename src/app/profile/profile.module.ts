import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { HeaderModule } from '../header/header.module';
 import {MatRippleModule} from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    ProfileComponent,
   ],
  imports: [
    CommonModule,
    HeaderModule,
    MatRippleModule, RouterModule, MatButtonModule
  ]
})
export class ProfileModule { }
