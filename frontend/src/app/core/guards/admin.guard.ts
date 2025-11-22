import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

export const adminGuard: CanActivateFn = () => {
  const roles = inject(RoleService);
  const router = inject(Router);
  if (roles.role === 'ADMIN') return true;
  router.navigateByUrl('/');
  return false;
};
