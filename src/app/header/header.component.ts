import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../web.api.services';
import { AuthenticationService } from '../../app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public configApi: WebApiService, private authenticationService: AuthenticationService, private router: Router,) { }
  currentUserName: any = '';
  userFullName: any = '';
  centerName: any = '';
  ngOnInit() {
    // const _lsUserData = JSON.parse(localStorage.getItem('currentUser'));
    const _lsUserData = JSON.parse(localStorage.getItem('loggedInUser'));
    this.currentUserName = _lsUserData.userName;
    this.userFullName = this.currentUserName;
    // this.userFullName = `${_lsUserData.firstName} ${_lsUserData.lastName}`;
    this.centerName = _lsUserData.center;
  }

  logout() {
    // this.authenticationService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
