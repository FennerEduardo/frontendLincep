import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription, tap } from 'rxjs';
import { UserModel } from 'src/app/auth/models/auth.models';
import { HomeService } from 'src/app/home/home.service';


@Component({
  selector: 'app-open-new-user-modal',
  templateUrl: './open-new-user-modal.component.html',
  styleUrls: ['./open-new-user-modal.component.scss'],
})
export class OpenNewUserModalComponent implements OnInit {

  userForm!: FormGroup;
  subs$: Subscription[] = [];
  matching_passwords_group!: FormControl;

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
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(8), Validators.required])
      ),
      confirm_password: new FormControl('', Validators.required),
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const sub$ = this.homeService
        .createUser(formValue)
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
