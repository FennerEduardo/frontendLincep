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
import { AccessTokenModel, UserModel } from './models/auth.models';
import { AuthService } from './services/auth.service';
import { EmitEvent, EventBusService, Events } from './services/event-bus.service';
import { StorageService } from './services/storage.service';
import { ToastController } from '@ionic/angular';
import { CONSTANTS } from '../shared/constants';
import { ALERT_DURATION } from '../shared/timeout.const';




@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private tokenInterval: any;
  private currentUser!: UserModel;
  private checkSessionTimeout = 0;
  public backendUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private eventBusService: EventBusService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {

  }

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
        case 419:
          errorMessage = 'Su api key está vencida, renueve su plan o consulte al servicio tecnico';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again later.';
      }

      this.presentToast(errorMessage, 'secondary');

      if (err.status === 401) {
        this.authService.closeAnyPageOverInstance();
        this.eventBusService.emit(new EmitEvent(Events.CurrentUserFetched, null));

        Preferences.get({ key: 'access_token' })
          .then(storedToken => {
            if (storedToken.value) {
              this.authService.doLogout();
            } else if (this.router.url !== '/login') {
              this.router.navigate(['/login']);
            }
          })
          .catch(error => {
            console.error(error);
            // Consider adding error logging here.
          });
      }
    } else {
      // This is not an HTTP error. Handle it accordingly.
      console.error(err);
      // Consider adding error logging here.
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
