import { ChangeDetectorRef, Component } from '@angular/core';
import { UserModel } from './auth/models/auth.models';
import { APP_ACCOUNT_PAGES } from './shared/constants';
import { StorageService } from './auth/services/storage.service';
import { LoadingController } from '@ionic/angular';
import { EventBusService, Events } from './auth/services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private subscriptions: Subscription[] = [];
  private _eventBusSub!: Subscription;
  private activeLoading: any = null;
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
  ];
  accountPages = APP_ACCOUNT_PAGES;
  public labels = [];
  currentUser!: UserModel;

  constructor(
    private storageService: StorageService,
    protected readonly loadingController: LoadingController,
    private eventBusService: EventBusService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ionViewDidEnter() {
    this.setup();
  }

  setup() {
    this._eventBusSub = this.eventBusService.on(
      Events.CurrentUserFetched,
      async () => {
        await this.getCurrentUser();
        this.changeDetector.detectChanges();
      }
    );
  }

  async getCurrentUser() {
    this.storageService.get('currentUser')
      .then(currentUser => {
        this.currentUser = currentUser;
        console.log(this.currentUser);

        this.setLoading(false);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  public async setLoading(status: boolean) {
    if (this.activeLoading === null) {
      this.activeLoading = await this.loadingController.getTop();
    }
    // If should activate and there's an instance showing
    if (status && this.activeLoading) {
      return;
    }

    if (!status) {
      if (!this.activeLoading) {
        this.activeLoading = await this.loadingController.getTop();
      }
      this.activeLoading?.dismiss();
      this.activeLoading = null;
      return;
    }

    this.activeLoading = await this.loadingController.create();

    this.activeLoading.present();
  }

  ionViewWillLeave(): void {
    if (this._eventBusSub) {
      this._eventBusSub.unsubscribe();
    }
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
