import { Component, Input, OnInit, Inject, forwardRef } from '@angular/core';
import { CourseComponent } from '../course.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @Input() videoId: string;
  @Input() title: string;
  @Input() content: string;
  @Input() topics: string[];
  @Input() methods: string[];
  @Input() keywords: string[];

  course: any;

  constructor(

    @Inject(forwardRef(() => CourseComponent)) course

  ) { 
    this.course = course;
  }

  ngOnInit() {
  }

}
