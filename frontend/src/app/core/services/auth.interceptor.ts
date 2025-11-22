import { HttpInterceptorFn } from '@angular/common/http';

function safeGetToken(): string | null {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('he.jwt');
    }
  } catch {}
  return null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Do not attach token on auth endpoints (relative or absolute)
  const url = req.url || '';
  if (url.startsWith('/api/auth') || url.includes('/api/auth/')) {
    return next(req);
  }
  const token = safeGetToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
