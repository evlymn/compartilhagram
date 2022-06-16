import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageProfileDialogComponent } from './image-profile-dialog/image-profile-dialog.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { LoginAnimations } from '../../animations/login.animations'
import { LoginService } from '../../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: LoginAnimations,

})
export class LoginComponent implements OnInit {
  submited = false;
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
  @ViewChild('file') file!: ElementRef;

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
    this.submited = false
    this.changeAvatarStyle(this.imageUrl);
    this.name?.setValue('');
    this.name?.markAsUntouched();
    this.name?.markAsPristine();
    this.email?.setValue('');
    this.email?.markAsUntouched();
    this.email?.markAsPristine();
    this.password?.setValue('');
    this.password?.markAsUntouched();
    this.password?.markAsPristine();
    this.rPassword?.setValue('');
    this.rPassword?.markAsUntouched();
    this.rPassword?.markAsPristine();
    this.isSignUp ? this.form.get('name')?.enable() : this.form.get('name')?.disable();
    this.isSignUp ? this.form.get('rPassword')?.enable() : this.form.get('rPassword')?.disable();
    formDirective.resetForm();
    this.progress = 0;
    this.progressMode = 'indeterminate';

  }
  changeAvatarStyle(imageUrl: string) {
    this.avatarStyle = imageUrl ? `background-image: url(${imageUrl})` : this.avatarStyle;
  }

  fileChangeEvent(event: any) {
    console.log(event.target.files[0]);
    if (event.target.files[0]) {
      const dialogRef = this.dialog.open(ImageProfileDialogComponent, {
        panelClass: 'ImageProfileDialogComponent',
        width: '350px',
        data: event,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.img64 = result;
          this.changeAvatarStyle(this.img64)
        }
      });
    }
  }

  async submit(formDirective: FormGroupDirective) {
    this.submited = true;
    if (!this.isSignUp && this.form.valid) {
      this._service.login(this.email?.value, this.password?.value);
    } else if (this.isSignUp && this.img64 && this.form.valid) {
      const task = await this._service.signUp(this.email?.value, this.password?.value, this.name?.value, this.img64);
      const subs = task.subscribe(snapshopt => {
        this.progressMode = 'determinate';
        this.progress = Number.parseInt(snapshopt.progress.toFixed(0));
        if (this.progress == 100) {
          subs.unsubscribe();
          this._snackBar.open(`Usuário ${this.name?.value} criado!`, 'ok', {
            duration: 2000,
          });
          this.resetForm(formDirective);
        }
      });
    }
  }


  ngOnInit(): void {
  }
}

