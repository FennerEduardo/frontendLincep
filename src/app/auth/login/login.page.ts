import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { AccessTokenModel, AuthUserCredentials } from '../models/auth.models';
import { AuthService } from '../services/auth.service';
import { Subscription, concatMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ALERT_DURATION } from 'src/app/shared/timeout.const';
import { CONSTANTS } from 'src/app/shared/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: UntypedFormGroup;
  loginErrorMesssage: string = '';
  subs$: Subscription[] = [];

  validation_messages = {
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
  };

  constructor(
    public menu: MenuController,
    protected readonly toastController: ToastController,
    protected readonly loadingController: LoadingController,
    private authService: AuthService,
    public router: Router
  ) {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new UntypedFormControl(
        '',
        Validators.compose([Validators.minLength(8), Validators.required])
      ),
    });
  }

  ngOnInit() {
  }

  // Disable side menu for this page
  async ionViewWillEnter() {
    await this.menu.enable(false);
  }

  async doLogin() {
    if (this.loginForm.valid) {
      this.loginErrorMesssage = '';
      const formValue: AuthUserCredentials = this.loginForm.value;
      const sub$ = this.authService
        .login(formValue)
        .pipe(
          tap((userData: AccessTokenModel) => {
            Preferences.set({
              key: 'token',
              value: userData.token,
            });
          }),
          concatMap(() => {
            return this.authService.currentUser();
          })
        )
        .subscribe({
          next: () => {
            Preferences.get({
              key: 'showWelcomeMessage',
            }).then(result => {
              const value = result.value;
              this.router.navigate(['/home']);
              this.menu.enable(true);
              if (value !== 'false') {
                this.presentToast(CONSTANTS.WELCOME_MESSAGE);
              }
            });

          },
          error: (error) => {
            console.log(error);
            this.loginErrorMesssage = error?.message;
          },
        });

      this.subs$.push(sub$);
    }
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

  ionViewWillLeave() {
    this.subs$.forEach((sub$) => {
      sub$.unsubscribe();
    });
  }
}
