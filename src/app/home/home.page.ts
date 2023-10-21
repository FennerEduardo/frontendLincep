import { Component, OnInit } from '@angular/core';
import { UserModel } from '../auth/models/auth.models';
import { Subscription, finalize } from 'rxjs';
import { StorageService } from '../auth/services/storage.service';
import { AuthService } from '../auth/services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentUser!: UserModel;
  subscriptions: Subscription[] = [];
  private activeLoading: any = null;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    protected readonly loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.setup();
  }

  async setup() {
    await this.setCurrentUser();
    if (this.currentUser) {
      console.log(this.currentUser);
    }
  }
  async setCurrentUser() {
    this.setLoading(true);
    const subsctiption$ = this.authService.currentUser()
      .pipe(
        finalize(() => {
          this.setLoading(false);
        })
      )
      .subscribe(() => {
        this.storageService.get('currentUser')
          .then(currentUser => {
            this.currentUser = currentUser;
            this.setLoading(false);
          });
      });

    this.subscriptions.push(subsctiption$);
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
}
