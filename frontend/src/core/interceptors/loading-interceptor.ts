import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Busy } from '../services/busy';
import { delay, finalize, of, tap } from 'rxjs';
const cache = new Map<string, any>();
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(Busy);

  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap((res) => cache.set(req.url, res)),
    finalize(() => {
      busyService.idle();
    })
  );
};
