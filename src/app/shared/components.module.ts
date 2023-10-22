import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowHidePasswordComponent } from "./components/show-hide-password/show-hide-password.component";
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { OpenNewUserModalComponent } from './components/open-new-user-modal/open-new-user-modal.component';
import { NewProjectModalComponent } from './components/new-project-modal/new-project-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule,  IonicModule, ReactiveFormsModule],
  declarations: [
    ShowHidePasswordComponent,
    EditUserModalComponent,
    OpenNewUserModalComponent,
    NewProjectModalComponent

  ],
  exports: [
    ShowHidePasswordComponent,
    EditUserModalComponent,
    OpenNewUserModalComponent
  ],
})
export class ComponentsModule {}
