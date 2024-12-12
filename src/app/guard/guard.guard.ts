import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  const = authService = inject(AuthServiceService);
  const = router = inject(Router)

  if(authService.isLoggedIn()){
    return true;
  } else {
    return router.createUrlTree(['/login'])
  }  
};
