import { Component, inject, OnInit, signal } from '@angular/core';
import { Member, MemberLikeParams } from '../../type/members';
import { LikeService } from '../../core/services/like-service';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../type/pagination';
import { Pagination } from '../../shared/pagination/pagination';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Pagination],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  protected paginatedMember = signal<PaginatedResult<Member> | null>(null);
  private likeService = inject(LikeService);
  protected predicate = signal<MemberLikeParams>(new MemberLikeParams());
  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' },
  ];

  ngOnInit() {
    this.loadlike();
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.predicate().pageSize = event.pageSize;
    this.predicate().pageNumber = event.pageNumber;
    this.loadlike();
  }

  setpredicate(predicate: string) {
    if (predicate !== this.predicate().predicate) {
      this.predicate().predicate = predicate;
      this.loadlike();
    }
  }

  loadlike() {
    this.likeService.getLike(this.predicate()).subscribe({
      next: (member) => this.paginatedMember.set(member),
    });
  }
}
