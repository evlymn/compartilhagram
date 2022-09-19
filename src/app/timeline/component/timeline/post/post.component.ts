import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { TimelineService } from '../../../timeline.service';
import { Router } from '@angular/router';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  imageUrl = '/assets/images/background-post.svg';
  postText = '';
  file!: File;
  progress = 0;
  send = false;
  progressMode: ProgressBarMode = 'indeterminate';
  constructor(private _service: TimelineService, private _router: Router) {
    this._service.fileMessage.subscribe(async f => {
      this.file = f;
      this.imageUrl = await this._service.fileToBase64(f) as string;
    })
  }



 async savePost() {
    if (!this.send) {
      this.send = true;
      const task = await this._service.savePost(this.file, this.postText);
      const subs = task.subscribe(sub => {
        this.progress = sub.progress;
        if (sub.progress == 0) {
          this.progressMode = 'determinate';
          sub.snapshot.task.then(_ => {
            subs.unsubscribe();
            this.send = false;
            this._service.postMessage.next(true);
            this._router.navigate(['/timeline']).catch(reason => console.log(reason));
          })
        }
      });
    }
  }

  ngOnInit(): void {
  }
}
