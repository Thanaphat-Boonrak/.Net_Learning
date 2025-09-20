import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css',
})
export class StarButton {
  disable = input<boolean>(false);
  selected = input<boolean>(false);
  clickevent = output();

  onClick() {
    this.clickevent.emit();
  }
}
