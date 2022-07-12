import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/component/login/login.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { TimelineComponent } from './timeline/component/timeline/timeline.component';
import { PostComponent } from './timeline/component/timeline/post/post.component';
import { CommentsComponent } from './timeline/component/timeline/comments/comments.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'timeline/:id', component: TimelineComponent },
  { path: 'post', component: PostComponent },
  { path: 'comments/:id', component: CommentsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
