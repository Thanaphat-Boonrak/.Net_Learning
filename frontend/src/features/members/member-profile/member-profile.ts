import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditMember, Member } from '../../../type/members';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../type/user';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify(
    $event: BeforeUnloadEvent
  ) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  protected memberService = inject(MemberService);
  protected editMember: EditMember = {
    displayName: '',
    city: '',
    description: '',
    country: '',
  };

  ngOnInit(): void {
    this.editMember = {
      displayName: this.memberService.member()?.displayName || '',
      city: this.memberService.member()?.city || '',
      description: this.memberService.member()?.description || '',
      country: this.memberService.member()?.country || '',
    };
  }

  updateMember() {
    if (!this.memberService.member()) return;

    const updateMember = { ...this.memberService.member(), ...this.editMember };
    this.memberService.updateMember(this.editMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (
          currentUser &&
          updateMember.displayName !== currentUser?.displayName
        ) {
          currentUser.displayName = updateMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        this.toastService.success('Profile Update SuccessFully');
        this.memberService.member.set(updateMember as Member);
        this.memberService.editMode.set(false);
        this.editForm?.reset(updateMember);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
