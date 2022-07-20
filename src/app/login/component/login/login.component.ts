import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageProfileDialogComponent } from './image-profile-dialog/image-profile-dialog.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { LoginAnimations } from '../../animations/login.animations'
import { LoginService } from '../../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ErrorMessage } from '../../error-message/error-message';
import { ErrorMessageDialogComponent } from './error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: LoginAnimations,

})
export class LoginComponent implements OnInit {

  @ViewChild('file') file!: ElementRef;

  public get name(): AbstractControl | null {
    return this.form.get("name");
  }

  public get email(): AbstractControl | null {
    return this.form.get("email");
  }

  public get password(): AbstractControl | null {
    return this.form.get("password");
  }

  public get rPassword(): AbstractControl | null {
    return this.form.get("rPassword");
  }

  submitted = false;
  img64 = '';
  imageUrl = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
  avatarStyle = `background-image: url(${this.imageUrl})`;
  submitText = 'Logar';
  changeButtonText = 'registre-se';
  isSignUp = false;
  form!: FormGroup;
  fileName = '';
  progress = 0;
  progressMode: ProgressBarMode = 'indeterminate';
  hintMessage = 'Cadastrando usuária(o)...';

  constructor(public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _service: LoginService,
    private _snackBar: MatSnackBar) {
    this.createForm();
  }

  createForm() {
    this.form = this._formBuilder.group({
      name: new FormControl({ value: '', disabled: true }, [Validators.required],),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rPassword: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }
  setSignInUp(formDirective: FormGroupDirective) {
    this.isSignUp = !this.isSignUp;
    this.resetForm(formDirective);
  }

  resetForm(formDirective: FormGroupDirective) {
    this.img64 = '';
    this.submitted = false
    this.changeAvatarStyle(this.imageUrl);
    this.isSignUp ? this.name?.enable() : this.name?.disable();
    this.isSignUp ?this.rPassword?.enable() : this.rPassword?.disable();
    formDirective.resetForm();
    this.progress = 0;
    this.progressMode = 'indeterminate';

  }
  changeAvatarStyle(imageUrl: string) {
    this.avatarStyle = imageUrl ? `background-image: url(${imageUrl})` : this.avatarStyle;
  }

  fileChangeEvent(event: any) {
    if (event.target.files[0]) {
      const dialogRef = this.dialog.open(ImageProfileDialogComponent, {
        panelClass: 'ImageProfileDialogComponent',
        width: '350px',
        data: event,
      });

      dialogRef.afterClosed().subscribe(result => {
        this.file.nativeElement.value = null;
        if (result) {
          this.submitted = false;
          this.img64 = result;
          this.changeAvatarStyle(this.img64)
        }
      });
    }
  }

  async submit(formDirective: FormGroupDirective) {
    console.log('submit');
    this.submitted = true;
    try {
      if (!this.isSignUp && this.form.valid) {
        await this._service.login(this.email?.value, this.password?.value);
      } else if (this.isSignUp && this.img64 && this.form.valid) {
        const uploadTaskSnapshot = await this._service.signUp(this.email?.value, this.password?.value, this.name?.value, this.img64);
        const subs = uploadTaskSnapshot.subscribe(snapshot => {
          if (snapshot.progress == 0) {
            this.progressMode = 'determinate';
            snapshot.snapshot.task.then(_ => {
              subs.unsubscribe();
              this.hintMessage = 'redirecionando...';
              this.progress = 0;
            })
          }
          this.progress = Number.parseInt(snapshot.progress.toFixed(0));
        })
      }
    } catch (error: any) {
      this.submitted = false;

      const erroDialog = this.dialog.open(ErrorMessageDialogComponent, {
        panelClass: 'ErrorMessageDialogComponent',
        width: '350px',

        data: ErrorMessage[error.code],
      });

      if (!this.isSignUp)
        formDirective.resetForm();
    }
  }

  openSnackBar() {
    this._snackBar.open('Sinto Muito, vc foi desconetada(o)!', undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
     // panelClass: 'snackBar'
    });
  }

  ngOnInit(): void {
    this._service.auth.logoutMessage.subscribe(b=>{
      if(b){
        this.openSnackBar();
      }
    })
  }
}

