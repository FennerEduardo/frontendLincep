import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { ComponentsModule } from 'src/app/shared/components.module';
import { HttpClientModule } from '@angular/common/http';
import { MenuController } from '@ionic/angular';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    SignupPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [SignupPage],
  providers: [
    MenuController // Agrega MenuController como un proveedor aquí
  ]
})
export class SignupPageModule {}
