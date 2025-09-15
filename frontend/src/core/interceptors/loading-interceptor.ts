import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Busy } from '../services/busy';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(Busy);

  busyService.busy();

  return next(req).pipe(
    delay(500),
    finalize(() => {
      busyService.idle();
    })
  );
};
