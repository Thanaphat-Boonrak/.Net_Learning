import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Busy } from '../services/busy';
import { delay, finalize, of, tap } from 'rxjs';
const cache = new Map<string, any>();
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  
  const generateChacheKey = (request: string, param: HttpParams) => {
    const paramString = param
      .keys()
      .map((key) => `${key}=${param.get(key)}`)
      .join('&');
    return paramString ? `${request}?${paramString}` : request;
  };

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
        console.log(`Cache invalidated for: ${key}`);
      }
    }
  };

  const cacheKey = generateChacheKey(req.url, req.params);
  const busyService = inject(Busy);

  if (req.method.includes('POST') && req.url.includes('/likes')) {
    invalidateCache('/likes');
  }

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap((res) => cache.set(cacheKey, res)),
    finalize(() => {
      console.log(cache);

      busyService.idle();
    })
  );
};
