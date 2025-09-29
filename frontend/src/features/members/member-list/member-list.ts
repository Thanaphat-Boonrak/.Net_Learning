import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member, MemberParams } from '../../../type/members';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../type/pagination';
import { Pagination } from '../../../shared/pagination/pagination';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Pagination, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private MemberService = inject(MemberService);
  protected paginatedMember = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  protected updateParams = new MemberParams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updateParams = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.MemberService.getMember(this.memberParams).subscribe({
      next: (res) => {
        this.paginatedMember.set(res);
      },
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadUser();
  }

  open() {
    this.modal.open();
  }

  onClose() {}

  onFilterChange(data: MemberParams) {
    this.memberParams = { ...data };
    this.updateParams = { ...data };

    this.loadUser();
  }

  resetFilter() {
    this.memberParams = new MemberParams();
    this.updateParams = new MemberParams();
    this.modal.resetFilter();
    this.loadUser();
  }

  get displayMessage(): string {
    const defaultParmas = new MemberParams();
    const filters: string[] = [];
    if (this.memberParams.gender) {
      filters.push(this.updateParams.gender + 's');
    } else {
      filters.push('Males', 'Females');
    }

    if (
      this.updateParams.minAge !== defaultParmas.minAge ||
      this.updateParams.maxAge !== defaultParmas.maxAge
    ) {
      filters.push(
        `age ${this.updateParams.minAge}-${this.updateParams.maxAge}`
      );
    }
    filters.push(
      this.updateParams.orderBy === 'lastActive'
        ? 'Recently active'
        : 'Newest members'
    );
    return filters.length > 0
      ? `Selected: ${filters.join(' | ')}`
      : 'All members';
  }
}
