import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

export const ownerGuard: CanActivateFn = () => {
  const roles = inject(RoleService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  // During SSR, skip guard to avoid redirect based on default CUSTOMER role
  if (!isPlatformBrowser(platformId)) return true;
  if (roles.role === 'OWNER') return true;
  router.navigateByUrl('/');
  return false;
};
