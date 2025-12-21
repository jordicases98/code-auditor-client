import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedAuthUrls = ['/auth/ott/generate', '/auth/login/ott', '/api/user'];
  const shouldExcludeUrls = excludedAuthUrls.some((url) => req.url.includes(url));
  if (shouldExcludeUrls) {
    return next(req);
  }
  return next(req.clone({ withCredentials: true }));
};
