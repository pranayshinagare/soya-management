import { Component } from '@angular/core';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'soya-management';
  showHead: boolean = false;
  currentUser: User;
  constructor(private router: Router, private authenticationService: AuthenticationService) {
    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'].includes('login') || event['url'].includes('page-not-found')) {
          this.showHead = false;
        } else {
          this.showHead = true;
        }
      }
    });
    // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    // this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
