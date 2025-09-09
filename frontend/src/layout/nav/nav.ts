import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected creds: any = {};
  protected accountService = inject(AccountService);
  protected loginStatus = signal(false);


  login() {
    this.accountService.login(this.creds).subscribe({
      next: (res) => {
        console.log(res);
        this.loginStatus.set(true);
      },
      error: (err) => console.log(err),
      complete: () => console.log('Sucess'),
    });
  }

  logout() {
    this.loginStatus.set(false);
  }
}
