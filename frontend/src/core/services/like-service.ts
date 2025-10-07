import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member, MemberLikeParams } from '../../type/members';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../type/pagination';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private baseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  likesId = signal<string[]>([]);

  toggleLike(targetId: string) {
    return this.httpClient.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLike(memberLikeParams: MemberLikeParams) {
    let params = new HttpParams();
    params = params.append('pageNumber', memberLikeParams.pageNumber);
    params = params.append('pageSize', memberLikeParams.pageSize);
    params = params.append('predicate', memberLikeParams.predicate);

    return this.httpClient
      .get<PaginatedResult<Member>>(`${this.baseUrl}likes`, {
        params: params,
      })
      .pipe(
        tap((data) => {
          console.log(data);
        })
      );
  }

  getLikeIds() {
    return this.httpClient
      .get<string[]>(`${this.baseUrl}likes/list`)
      .subscribe({
        next: (ids) => {
          this.likesId.set(ids);
        },
      });
  }

  clearLikeIds() {
    this.likesId.set([]);
  }
}
