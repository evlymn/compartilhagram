import { Component, OnInit, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageProfileDialogComponent } from './image-profile-dialog/image-profile-dialog.component';
import { AbstractControl, FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { LoginAnimations } from '../../animations/login.animations'
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
  form;

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

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: new FormControl({ value: '', disabled: true }, [Validators.required],),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rPassword: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }
  setSignInUp(formDirective: FormGroupDirective) {
    this.isSignUp = !this.isSignUp;
    this.resetForm(formDirective);
    this.img64 = '';
    this.submited = false
    this.changeAvatarStyle(this.imageUrl);
  }

  resetForm(formDirective: FormGroupDirective) {
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

  }
  changeAvatarStyle(imageUrl: string) {
    this.avatarStyle = imageUrl ? `background-image: url(${imageUrl})` : this.avatarStyle;
  }

  fileChangeEvent(event: any) {
    if (event.target.files[0]) {
      const dialogRef = this.dialog.open(ImageProfileDialogComponent, {
        panelClass: 'ImageProfileDialogComponent',
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

  submit() {
    this.submited = true;
    if (!this.isSignUp && this.form.valid) {
        console.log('valid login');
    } else if (this.isSignUp && this.img64 && this.form.valid) {
        console.log('valid signUp');
    }
  }

  ngOnInit(): void {
  }
}

