import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsAdminComponent } from './comments.component';

describe('CommentsComponent', () => {
  let component: CommentsAdminComponent;
  let fixture: ComponentFixture<CommentsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
