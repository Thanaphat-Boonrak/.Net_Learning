import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member, Photo } from '../../../type/members';
import { AsyncPipe } from '@angular/common';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../type/user';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photo',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photo.html',
  styleUrl: './member-photo.css',
})
export class MemberPhoto implements OnInit, OnDestroy {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected isLoading = signal<boolean>(false);
  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id) {
      this.memberService.getMemberPhoto(id).subscribe({
        next: (res) => this.photos.set(res),
      });
    }
  }
  ngOnDestroy(): void {
    this.memberService.editMode.set(false);
  }

  onUploadFile(file: File) {
    this.isLoading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (res) => {
        this.memberService.editMode.set(false);
        this.isLoading.set(false);
        this.photos.update((photo) => [...photo, res]);
        if (this.memberService.member()?.imageUrl === null) {
          this.SetmainPhotoLocal(res);
        }
      },
      error: (err) => {
        console.log('errror Upload image', err);

        this.isLoading.set(false);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const user = this.accountService.currentUser();
        if (user) user.imageUrl = photo.url;
        this.accountService.setCurrentUser(user as User);
        this.memberService.member.update(
          (member) =>
            ({
              ...member,
              imageUrl: photo.url,
            } as Member)
        );
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((p) => p.id !== photoId));
      },
    });
  }

  private SetmainPhotoLocal(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(
      (member) =>
        ({
          ...member,
          imageUrl: photo.url,
        } as Member)
    );
  }
}
