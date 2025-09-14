import { Component, inject } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../../type/members';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photo',
  imports: [AsyncPipe],
  templateUrl: './member-photo.html',
  styleUrl: './member-photo.css',
})
export class MemberPhoto {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos$?: Observable<Photo[]>;
  constructor() {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id) {
      console.log(id);

      this.photos$ = this.memberService.getMemberPhoto(id);
    }
  }
}
