import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../type/errors';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError {
  private router = inject(Router);
  protected error: ApiError;
  protected showdetails = signal(false);

  constructor() {
    const navigation = this.router.getCurrentNavigation();

    this.error = navigation?.extras?.state?.['error'];
  }

  detailsToggle() {
    this.showdetails.set(!this.showdetails());
  }
}
