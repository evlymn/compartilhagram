import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './component/timeline/timeline.component';
import { HeaderComponent } from './component/timeline/header/header.component';
import { MessagesComponent } from './component/timeline/messages/messages.component';
import { FooterComponent } from './component/timeline/comments/footer/footer.component';
import { MessageComponent } from './component/timeline/messages/message/message.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { ImageCropperModule } from 'ngx-image-cropper';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PostComponent } from './component/timeline/post/post.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';

import {MatDividerModule} from '@angular/material/divider';
import { CommentsComponent } from './component/timeline/comments/comments.component';
import { CommentComponent } from './component/timeline/comments/comment/comment.component';

@NgModule({
  declarations: [
    TimelineComponent,
    HeaderComponent,
    MessagesComponent,
    FooterComponent,
    MessageComponent,
     PostComponent,
    CommentsComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule,
    ImageCropperModule,
    MatToolbarModule,
    AppRoutingModule,
    FormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatRippleModule,
    MatDividerModule
  ]
})
export class TimelineModule { }
