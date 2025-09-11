import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected creds: any = {};
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (res) => {
        this.creds = {};
        this.toast.success('Login Success');
        this.router.navigateByUrl('/members');
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      },
      complete: () => console.log('Sucess'),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
