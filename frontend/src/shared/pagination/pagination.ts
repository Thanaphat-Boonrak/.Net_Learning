import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  pageNumber = model(1);
  pageSize = model(10);
  totalCount = input(0);
  pageSizeOption = input([5, 10, 20, 30, 40, 50]);

  pageChange = output<{ pageNumber: number; pageSize: number }>();
  lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount());
  });
  onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage) this.pageNumber.set(newPage);
    if (pageSize) {
      const size = Number((pageSize as HTMLSelectElement).value);
      this.pageSize.set(size);
    }

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    });
  }
}
