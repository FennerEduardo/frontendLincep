import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription, tap } from 'rxjs';
import { UserModel } from 'src/app/auth/models/auth.models';
import { HomeService } from 'src/app/home/home.service';

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.scss'],
})
export class NewProjectModalComponent  implements OnInit {

  @Input() user!: UserModel;

  projectForm!: FormGroup;
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
    this.projectForm = this.formBuilder.group({
      user_id: new FormControl(this.user.id, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const sub$ = this.homeService
        .createProject(formValue)
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
