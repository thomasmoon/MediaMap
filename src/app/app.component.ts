import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: [
    "node_modules/primeicons/primeicons.css",
    "node_modules/primeng/resources/themes/nova-light/theme.css",
    "node_modules/primeng/resources/primeng.min.css"
  ]
})
export class AppComponent implements OnInit {
  title = 'Online Course in Tropical Forestry';

  user: any;

  constructor(
    private router: Router,
    public auth: AuthService
    ) {

      this.user = auth.user;
  }

  ngOnInit() {
  }
}
