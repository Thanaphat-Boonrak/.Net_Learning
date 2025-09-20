import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.css',
})
export class DeleteButton {
  disable = input<boolean>(false);
  clickevent = output();

  onClick() {
    this.clickevent.emit();
  }
}
