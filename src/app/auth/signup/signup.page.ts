import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PasswordValidator } from 'src/app/shared/validators/password.validator';
import { AuthSignUpModel } from '../models/auth.models';
import { HttpErrorResponse } from '@angular/common/http';
import { ALERT_DURATION } from 'src/app/shared/timeout.const';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: UntypedFormGroup;
  matching_passwords_group: UntypedFormGroup;

  validation_messages = {
    username: [
      { type: 'required', message: 'Nombre de usuario es requerido.' }
    ],
    email: [
      { type: 'required', message: 'Email es requerido.' },
      { type: 'pattern', message: 'Ingresa un email válido.' },
    ],
    password: [
      { type: 'required', message: 'Contraseña es requerida.' },
      {
        type: 'minlength',
        message: 'La contraseña debe tener por lo menos 8 caracteres.',
      },
    ],
    confirm_password: [
      { type: 'required', message: 'Confirma Contraseña es requerido' },
    ],
    matching_passwords: [
      { type: 'areNotEqual', message: 'Las contraseñas no son iguales.' },
    ],
  };
  private subs$: Subscription[] = [];
  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    private authService: AuthService,
    protected readonly toastController: ToastController
  ) {

    this.matching_passwords_group = new UntypedFormGroup(
      {
        password: new UntypedFormControl(
          '',
          Validators.compose([Validators.minLength(8), Validators.required])
        ),
        confirm_password: new UntypedFormControl('', Validators.required),
      }
    );


    this.signupForm = new UntypedFormGroup({
      email: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      username: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required
        ])
      ),
      matching_passwords: this.matching_passwords_group,
    });
  }

  ngOnInit() {
  }


  // Disable side menu for this page
  async ionViewDidEnter() {
    await this.menu.enable(false);
  }

  async doSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    const data: AuthSignUpModel = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.matching_passwords.password,
      password_confirmation:
        this.signupForm.value.matching_passwords.confirm_password,
    };

    const sub$ = this.authService.signUp(data)
      .subscribe({
        next: (res: any) => {
          this.presentToast(res.message);
          this.router.navigate(['login']);
        },
        error: (error: HttpErrorResponse) => {
          this.presentToast(error.message, 'danger');
        },
      });
    this.subs$.push(sub$);
  }

  async presentToast(
    message: string,
    color:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'light'
      | 'medium'
      | 'dark' = 'secondary',
    duration: number = ALERT_DURATION,
    position: 'top' | 'bottom' | 'middle' = 'bottom',
    icon: string = 'checkmark'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration,
      position,
      icon,
      color,
    });

    await toast.present();
  }
}
