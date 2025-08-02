import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isUserLoggedIn: string;

  constructor(private authService: AuthenticationService, private router: Router) {
    this.authService.isUserLoggedIn.subscribe(val => {
      this.isUserLoggedIn = val;
    })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // && (this.authService.isUserAdmin())
    if ((this.isUserLoggedIn != null) && (this.isUserLoggedIn === true + "" )) {
      return true;
    } else {
      // Redirect to login page or any other unauthorized page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
