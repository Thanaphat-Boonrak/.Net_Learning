import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Member } from '../../../type/members';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../type/pagination';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, MemberCard],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
  private MemberService = inject(MemberService);
  protected paginatedMember$: Observable<PaginatedResult<Member>>;

  constructor() {
    this.paginatedMember$ = this.MemberService.getMember();
  }
}
