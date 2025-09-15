import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { HomePage } from '../features/home-page/home-page';
import { User } from '../type/user';
import { Busy } from '../core/services/busy';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],

  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected router = inject(Router);
  protected busyService = inject(Busy);
}
