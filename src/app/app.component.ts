import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './services/sidenav.service';


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

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  title = 'Online Course in Tropical Forestry';

  pageParams: any;
  sidenavOpened: boolean;

  user:any;

  loginItems:any = [
    {
      id: 'google',
      icon: 'email',
      text: 'Google',
      route: '/'
    },
    {
      id: 'facebook',
      icon: 'thumb_up',
      text: 'Facebook',
      route: '/'
    },
    {
      id: 'twitter',
      icon: 'chat',
      text: 'Twitter',
      route: '/'
    },
    {
      id: 'github',
      icon: 'people',
      text: 'Github',
      route: '/'
    },
    {
      id: 'uni',
      icon: 'school',
      text: 'University of Helsinki',
      info: '(coming soon)',
      route: '/'
    },
  ];


  menuItems:any = [
    {
      icon: 'menu_book',
      text: 'Course Content',
      route: '/'
    }
  ]

  adminMenuItems:any = [
    {
      icon: 'video_library',
      text: 'Videos',
      route: '/admin/videos'
    },
    {
      icon: 'chat',
      text: 'Comments',
      route: '/admin/comments'
    },
    {
      icon: 'person',
      text: 'Users',
      route: '/admin/users'
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    public sidenavService: SidenavService
  ) {
      this.user = auth.user;
  }

  ngOnInit() {

    console.log('Sidenav info');
    console.log(this.sidenav);

    this.sidenavService.setSidenav(this.sidenav);

    this.pageParams = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.sidenavOpened = params['login'] || false;
    });
  }
}
