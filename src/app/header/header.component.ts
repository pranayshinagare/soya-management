import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../web.api.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public configApi: WebApiService) { }

  ngOnInit() {
  }

}
