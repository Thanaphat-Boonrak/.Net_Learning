import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { HomePage } from "../features/home-page/home-page";

@Component({
  selector: 'app-root',
  imports: [Nav, HomePage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }
  ngOnInit(): void {
    this.http.get('https://localhost:8080/api/members').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
      complete: () => console.log('Success+'),
    });
    this.setCurrentUser();
  }
}
