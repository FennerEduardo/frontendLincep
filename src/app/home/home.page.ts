import { Component, OnInit } from '@angular/core';
import { UserModel } from '../auth/models/auth.models';
import { Subscription, finalize } from 'rxjs';
import { StorageService } from '../auth/services/storage.service';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { HomeService } from './home.service';
import { ALERT_DURATION } from '../shared/timeout.const';
import { EditUserModalComponent } from '../shared/components/edit-user-modal/edit-user-modal.component';
import { OpenNewUserModalComponent } from '../shared/components/open-new-user-modal/open-new-user-modal.component';
import { NewProjectModalComponent } from '../shared/components/new-project-modal/new-project-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  anonymous: boolean = true;
  currentUser: UserModel | null | undefined;
  subscriptions: Subscription[] = [];
  users: UserModel[] = [];
  private activeLoading: any = null;
  user_id: number = 0;

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    protected readonly loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.setup();
  }

  setup() {
    this.getCurrentUser();
    this.getUsers();
  }

  getCurrentUser() {
    this.storageService.get('currentUser')
      .then(currentUser => {
        this.currentUser = currentUser;
        this.user_id = Number(this.currentUser?.id);
        this.setLoading(false);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }


  getUsers() {
    const s$ = this.homeService
      .getAllUsers()
      .subscribe((data: any) => {
        this.users = data;
        this.setLoading(false);
      });
    this.subscriptions.push(s$);
  }


  async onOpenDeleteUserAlert(user: UserModel) {
    const alert = await this.alertController.create({
      subHeader: `¿Está seguro de eliminar al usuario "${user.email}"?`,

      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.onDeleteUserHandler(user);
          },
        },
      ],
    });

    await alert.present();
  }

  async onDeleteUserHandler(user: UserModel) {
    this.setLoading(true);
    this.homeService.deleteUser(user.id)
      .subscribe((res) => {
        this.presentToast(res.message, 'secondary');
        this.getUsers();
      });
  }

  async openEditModal(user: UserModel) {
    const modal = await this.modalController.create({
      component: EditUserModalComponent,
      componentProps: {
        user: user
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.event === true) {
        this.getUsers();
      }
    });
    return await modal.present();
  }

  async openNewModal() {
    const modal = await this.modalController.create({
      component: OpenNewUserModalComponent,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.event === true) {
        this.getUsers();
      }
    });
    return await modal.present();
  }

  async openNewProjectModal(user: UserModel) {
    const modal = await this.modalController.create({
      component: NewProjectModalComponent,
      componentProps: {
        user: user
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.event === true) {
        this.getUsers();
      }
    });
    return await modal.present();
  }

  public async setLoading(status: boolean) {
    if (this.activeLoading === null) {
      this.activeLoading = await this.loadingController.getTop();
    }
 
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
