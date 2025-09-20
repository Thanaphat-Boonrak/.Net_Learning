import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../type/user';
import { environment } from '../../environments/environment.development';
import { EditMember, Member, Photo } from '../../type/members';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  editMode = signal<boolean>(false);
  private baseUrl = environment.apiUrl;
  member = signal<Member | null>(null);

  getMember() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMemberById(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap((member) => {
        this.member.set(member);
      })
    );
  }

  getMemberPhoto(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + `members/${id}/photos`);
  }

  updateMember(member: EditMember) {
    return this.http.put(this.baseUrl + `members`, member);
  }

  uploadPhoto(file: File) {
    const formDate = new FormData();
    formDate.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formDate);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(
      this.baseUrl + 'members/set-main-photo/' + photo.id,
      {}
    );
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId)
  }
}
