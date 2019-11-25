import { Component, OnInit } from '@angular/core';
import { CommentsService, Comment} from 'src/app/services/comments.service';
import { ListComponent } from '../../shared/list/list.component';
@Component({
  selector: 'app-comments-admin',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsAdminComponent implements OnInit {

  public displayedColumns: string[] = ['userName', 'videoId', 'typeDisplay', 'text'];
  public comments: any;

  constructor(
    private commentsService: CommentsService
  ) { }

  ngOnInit() {

    // subscribe to entire collection
    this.comments = this.commentsService.comments;
    this.commentsService.loadAll();
  }

}
