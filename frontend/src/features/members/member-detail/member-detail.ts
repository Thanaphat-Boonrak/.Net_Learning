import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../type/members';
import { AsyncPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css',
})
export class MemberDetail implements OnInit {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected member = signal<Member | undefined>(undefined);
  protected title = inject(Title);
  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.member.set(data['member']);
      },
    });
    this.title.setTitle(this.route.firstChild?.snapshot.title ?? 'No Title');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.title.setTitle(
            this.route.firstChild?.snapshot.title ?? 'No Title'
          );
        },
      });
  }

  loadMember() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    return this.memberService.getMemberById(id);
  }
}
