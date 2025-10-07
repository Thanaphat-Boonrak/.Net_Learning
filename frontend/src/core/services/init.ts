import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root',
})
export class Init {
  private accountService = inject(AccountService);
  private likeService = inject(LikeService);
  init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.likeService.getLikeIds();

    return of(null);
  }
}
