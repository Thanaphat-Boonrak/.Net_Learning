import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Busy {
  busyRequest = signal(0);

  busy() {
    this.busyRequest.update((current) => current + 1);
  }

  idle() {
    this.busyRequest.update((current) => Math.max(0, current - 1));
  }
}
