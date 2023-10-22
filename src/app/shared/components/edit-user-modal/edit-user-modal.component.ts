import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription, tap } from 'rxjs';
import { UserModel } from 'src/app/auth/models/auth.models';
import { HomeService } from 'src/app/home/home.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent implements OnInit {
  @Input() user!: UserModel;

  userForm!: FormGroup;
  subs$: Subscription[] = [];

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    this.userForm = this.formBuilder.group({
      email: new FormControl(this.user?.email, [Validators.required, Validators.email]),
      username: new FormControl(this.user?.username, Validators.required),
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const sub$ = this.homeService
        .updateUser(this.user.id, formValue)
        .subscribe({
          next: () => {
            this.modalController.dismiss({ event: true });
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.log(error);
          },
        });

      this.subs$.push(sub$);
    }
  }
}
