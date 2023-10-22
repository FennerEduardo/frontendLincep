import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EventBusService } from './auth/services/event-bus.service';
import { StorageService } from './auth/services/storage.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'auth/logout',
    loadComponent: () =>
      import('./auth/logout.component').then((x) => x.LogoutComponent),
  },
  {
    path: 'auth/signup',
    loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    EventBusService,
    StorageService
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
