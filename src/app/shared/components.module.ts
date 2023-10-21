import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowHidePasswordComponent } from "./components/show-hide-password/show-hide-password.component";

@NgModule({
  imports: [CommonModule, FormsModule,  IonicModule, ReactiveFormsModule],
  declarations: [
    ShowHidePasswordComponent

  ],
  exports: [
    ShowHidePasswordComponent
  ],
})
export class ComponentsModule {}
