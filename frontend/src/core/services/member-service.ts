import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../type/user';
import { environment } from '../../environments/environment.development';
import { EditMember, Member, MemberParams, Photo } from '../../type/members';
import { tap } from 'rxjs';
import { AccountService } from './account-service';
import { PaginatedResult } from '../../type/pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  editMode = signal<boolean>(false);
  private accountService = inject(AccountService);
  private baseUrl = environment.apiUrl;
  member = signal<Member | null>(null);

  getMember(membeParams: MemberParams) {
    let params = new HttpParams();
    params = params.append('pageNumber', membeParams.pageNumber);
    params = params.append('pageSize', membeParams.pageSize);
    params = params.append('minAge', membeParams.minAge);
    params = params.append('maxAge', membeParams.maxAge);
    params = params.append('orderBy', membeParams.orderBy);
    if (membeParams.gender)
      params = params.append('gender', membeParams.gender);

    return this.http
      .get<PaginatedResult<Member>>(this.baseUrl + 'members', {
        params: params,
      })
      .pipe(
        tap(() => {
          localStorage.setItem('filters', JSON.stringify(membeParams));
        })
      );
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

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }
}
