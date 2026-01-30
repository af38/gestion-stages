import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { finalize } from 'rxjs';

export const spinnerInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerSrv = inject(SpinnerService);

  spinnerSrv.show();
  return next(req).pipe(
    finalize(() => spinnerSrv.hide())
  );
};
