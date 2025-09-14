import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../type/user';
import { environment } from '../../environments/environment.development';
import { Member, Photo } from '../../type/members';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;

  getMember() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMemberById(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }

  getMemberPhoto(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + `members/${id}/photos`);
  }
}
