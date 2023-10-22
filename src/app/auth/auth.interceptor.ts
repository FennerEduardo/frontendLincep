import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { lastValueFrom, from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { EmitEvent, EventBusService, Events } from './services/event-bus.service';
import { ToastController } from '@ionic/angular';
import { CONSTANTS } from '../shared/constants';
import { ALERT_DURATION } from '../shared/timeout.const';




@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  public backendUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventBusService: EventBusService,
    private toastController: ToastController
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handle(req, next));
  }

  async handle(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {

    if (req.url.startsWith(this.backendUrl)) {

      let isAnonymous = CONSTANTS.ANONYMOUS_ENDPOINTS.find((url) =>
        req.url.includes(url)
      );

      if (isAnonymous) {
        return lastValueFrom(next.handle(req));
      }

      let headers = new HttpHeaders();
      for (const key in req.headers.keys()) {
        const value = req.headers.get(key);
        if (value !== null) {
          headers = headers.set(key, value);
        }
      }


      const token = await Preferences.get({ key: 'token' });
      headers = headers.set('Authorization', `Bearer ${token.value}`);

      const request = req.clone({ headers });

      return lastValueFrom(
        next.handle(request).pipe(
          tap({
            error: this.handleError.bind(this),
          })
        )
      );
    } else {
      return lastValueFrom(next.handle(req));
    }
  }


  async handleError(err: any) {
    if (err instanceof HttpErrorResponse) {
      let errorMessage: string;

      switch (err.status) {
        case 401:
          this.authService.closeAnyPageOverInstance();
          this.eventBusService.emit(new EmitEvent(Events.CurrentUserFetched, null));

          Preferences.get({ key: 'token' })
            .then(storedToken => {
              if (storedToken.value) {
                this.authService.doLogout();
              } else if (this.router.url !== '/login') {
                this.router.navigate(['/login']);
              }
            })
            .catch(error => {
              errorMessage = error;
              console.error(error);
            });
          errorMessage = 'Unauthorized';
          break;
        case 400:
          errorMessage = 'Bad request. Please check your input and try again.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          this.router.navigate(['/']);
          break;
        case 404:
          errorMessage = 'Resource not found. Please check the URL and try again.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again later.';
      }

      this.presentToast(errorMessage, 'secondary');

    } else {
      console.error(err);
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

}
