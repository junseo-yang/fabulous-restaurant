import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountService} from "./services/account.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService) {
    }
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
            const user = this.accountService.userValue;
            if (user) {
                return true;
            }
            
            this.router.navigate(['/account/login'], {queryParams: { returnUrl: state.url}});
            alert("You need to login to use service.");
            return false;
    }
}
