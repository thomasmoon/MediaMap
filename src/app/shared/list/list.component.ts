import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  @Input() rows: any;
  @Input() displayedColumns: any;

  constructor() { }

  ngOnInit() {

    console.log('output rows');
    console.log(this.rows);
  }

}
