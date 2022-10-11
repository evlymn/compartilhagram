import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TimelineService } from '../timeline/timeline.service';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('file') file!: ElementRef;
  isNotTimeline = true;
  constructor(public service: TimelineService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar) {
    this.isNotTimeline = !this._route.snapshot.url[0]?.path.includes('timeline');
    this.service.postMessage.subscribe(_ => {
      this.openSnackBar();
    })
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent,{
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3560,
      panelClass: 'snackBar'
    })
  }
  chooseImage() {
    this.file.nativeElement.value = null;
    this.file.nativeElement.click();
  }
  fileChangeEvent(e: any) {
    this._router.navigate(['/post']).catch(reason => console.log(reason));
    if (this._route.snapshot.url[0]?.path.includes('timeline')) {
     // console.log('timeline')
      setTimeout(() => {
        this.service.fileMessage.next(e.target.files[0]);
      }, 140);
    } else {
      this.service.fileMessage.next(e.target.files[0]);
    }
  }

  logOut() {
    this.service.auth.signOut();
  }
  ngOnInit(): void {
  }
}
