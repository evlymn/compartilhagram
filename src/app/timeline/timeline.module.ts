import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './component/timeline/timeline.component';
import { HeaderComponent } from './component/timeline/header/header.component';
import { MessagesComponent } from './component/timeline/messages/messages.component';
import { FooterComponent } from './component/timeline/footer/footer.component';
import { MessageComponent } from './component/timeline/messages/message/message.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    TimelineComponent,
    HeaderComponent,
    MessagesComponent,
    FooterComponent,
    MessageComponent,


  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class TimelineModule { }
