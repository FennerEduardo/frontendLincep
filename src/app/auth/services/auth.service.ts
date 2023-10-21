import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/auth.models';
import { EmitEvent, EventBusService, Events } from './event-bus.service';
import { StorageService } from './storage.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = environment.backendUrl;

  constructor(
    private http: HttpClient,
    private eventBusService: EventBusService,
    private storageService: StorageService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/auth/login`, credentials);
  }

  currentUser(): Observable<any> {
    return this.http.post(`${this.backendUrl}/api/current-user`, null)
    .pipe(
      switchMap((data) => {
        const currentUser = new UserModel();
        Object.assign(currentUser, data);
        return from(this.setCurrentUser(currentUser));
      }),
      catchError((err) => {
        return throwError(() => err.error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.backendUrl}/auth/logout`, {});
  }

  private async setCurrentUser(
    currentUser: UserModel
  ): Promise<UserModel> {
    await this.storageService.set('currentUser', currentUser);
    this.eventBusService.emit(
      new EmitEvent(Events.CurrentUserFetched, currentUser)
    );
    return currentUser;
  }

  public async closeAnyPageOverInstance() {
    const modal = await this.modalController.getTop();

    if (modal) {
      modal.dismiss();
    }

    const loading = await this.loadingController.getTop();

    if (loading) {
      loading.dismiss();
    }

    if (modal || loading) {
      this.closeAnyPageOverInstance();
    }
  }

  public async doLogout() {
    await Preferences.remove({
      key: 'token',
    });
    await this.storageService.remove('currentUser');
    this.router.navigate(['login'], {
      replaceUrl: true,
    });
  }
}
