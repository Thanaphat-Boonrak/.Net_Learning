import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../type/members';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikeService } from '../../../core/services/like-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  private likeService = inject(LikeService);
  members = input.required<Member>();
  protected hasLike = computed(() =>
    this.likeService.likesId().includes(this.members().id)
  );

  toggleLike(event : Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.members().id).subscribe({
      next: () => {
        if (this.hasLike()) {
          this.likeService.likesId.set(
            this.likeService.likesId().filter((x) => x !== this.members().id)
          );
        } else {
          this.likeService.likesId.set([
            ...this.likeService.likesId(),
            this.members().id,
          ]);
        }
      }
    });
  }
}
