import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  validationErrors = signal<string[]>([]);

  get404Error() {
    this.http.get(this.baseurl + 'buggy/not-found').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
  }

  get400Error() {
    this.http.get(this.baseurl + 'buggy/bad-request').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
  }

  get500Error() {
    this.http.get(this.baseurl + 'buggy/server-error').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
  }

  get401Error() {
    this.http.get(this.baseurl + 'buggy/auth').subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
  }

  get400ValidationError() {
    this.http.post(this.baseurl + 'account/register', {}).subscribe({
      next: (res) => console.log(res),
      error: (err) => {
        this.validationErrors.set(err);
        console.log(err);
      },
    });
  }
}
