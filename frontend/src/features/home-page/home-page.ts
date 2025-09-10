import { Component, input, signal } from '@angular/core';
import { App } from '../../app/app';
import { Register } from '../register/register';

@Component({
  selector: 'app-home-page',
  imports: [Register],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  protected registerMode = signal(false);
  memberFromApp = input.required();

  isRegister(event: boolean) {
    this.registerMode.set(event);
  }
}
