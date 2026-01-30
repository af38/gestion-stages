import { inject } from '@angular/core';
import {CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const expectedRole = route.data['expectedRole'];
  const router = inject(Router);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if(!user){
  router.navigate(['/login']);
  return false;
  }
  if(user.role == expectedRole){
    return true;
  }

  router.navigate(['/missing']);

  return false;
};
