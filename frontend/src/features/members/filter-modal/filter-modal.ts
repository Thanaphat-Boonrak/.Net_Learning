import {
  Component,
  effect,
  ElementRef,
  input,
  model,
  output,
  ViewChild,
} from '@angular/core';
import { MemberParams } from '../../../type/members';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  @ViewChild('filterModal') modelRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParam = model(new MemberParams());

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParam.set(JSON.parse(filters));
    }
  }

  open() {
    this.modelRef.nativeElement.showModal();
  }

  close() {
    this.modelRef.nativeElement.close();
    this.closeModal.emit();
  }

  resetFilter() {
    this.memberParam.set(new MemberParams());
  }

  submit() {
    this.submitData.emit(this.memberParam());
    this.close();
  }

  onMinAge() {
    if (this.memberParam().minAge < 18) this.memberParam().minAge = 18;
  }

  onMaxAge() {
    if (this.memberParam().maxAge < this.memberParam().minAge)
      this.memberParam().maxAge = this.memberParam().minAge;
  }
}
