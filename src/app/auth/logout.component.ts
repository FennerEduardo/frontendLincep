import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-logout',
  template: '<div></div>',
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.authService.logout();
  }
}
