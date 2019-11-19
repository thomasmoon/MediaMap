import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { Dialog } from './dialog/dialog.component';
import { ToolsComponent } from './tools/tools.component';


const routes: Routes = 
  [{
    path: 'loc/:locIndex',
    component: CourseComponent
  },
  { path: 'dialog', component: Dialog },
  { path: '',   redirectTo: '/loc/1', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'ignore'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
