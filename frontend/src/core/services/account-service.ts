import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Logincreds, RegisterCreds, User } from '../../type/user';
import { tap } from 'rxjs';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikeService);
  private baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  register(cred: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', cred).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  login(cred: Logincreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', cred).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }

  logout() {
    localStorage.removeItem('user');
    this.likeService.clearLikeIds();
    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }
}
