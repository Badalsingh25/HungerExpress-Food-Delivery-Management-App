import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  // Check if user has a valid token
  if (auth.token) {
    return true;
  }
  
  // Redirect to login page if not logged in
  router.navigateByUrl('/login');
  return false;
};
