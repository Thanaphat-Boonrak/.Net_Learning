import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  protected registerMode = signal(false);

  isRegister() {
    this.registerMode.set(true);
  }
}
