import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { Dialog } from './dialog/dialog.component';
import { VideosComponent } from './admin/videos/videos.component';

// Guards
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { CommentsAdminComponent } from './admin/comments/comments.component';
import { PrivacyComponent } from './privacy/privacy.component';


const routes: Routes = [
  {
    path: 'loc/:locIndex',
    component: CourseComponent
  },
  {
    path: 'topic/:topicIndex',
    component: CourseComponent
  },
  {
    path: 'topic/:topicIndex/loc/:locIndex',
    component: CourseComponent
  },
  {
    path: 'method/:methodIndex',
    component: CourseComponent
  },
  {
    path: 'method/:methodIndex/loc/:locIndex',
    component: CourseComponent
  },
  { path: 'dialog', component: Dialog },
  { path: 'admin/videos', component: VideosComponent, canActivate: [AdminGuard] },
  { path: 'admin/comments', component: CommentsAdminComponent, canActivate: [AdminGuard] },
  { path: 'privacy', component: PrivacyComponent },
  { path: '', redirectTo: 'loc/1', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'ignore'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
