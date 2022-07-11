import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TimelineService } from '../../../timeline.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('file') file!: ElementRef;
  constructor(private _service: TimelineService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar) {
    this._service.postMessage.subscribe(_ => {
      this.openSnackBar();
    })
  }

  openSnackBar() {
    this._snackBar.open('On The Liiiine!!', undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000,
      panelClass: 'snackBar'
    });
  }
  chooseImage() {
    this.file.nativeElement.value = null;
    this.file.nativeElement.click();
  }
  fileChangeEvent(e: any) {
    this._router.navigate(['/post']).catch(reason => console.log(reason));
    if (this._route.snapshot.url[0]?.path.includes('timeline')) {
      console.log('timeline')
      setTimeout(() => {
        this._service.fileMessage.next(e.target.files[0]);
      }, 140);
    } else {
      this._service.fileMessage.next(e.target.files[0]);
    }
  }
  ngOnInit(): void {
  }
}
