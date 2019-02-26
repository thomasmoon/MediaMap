import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapBoxComponent } from './map-box/map-box.component';
import { Dialog } from './dialog/dialog.component';


const routes: Routes = 
  [{
    path: 'loc/:locIndex',
   component: MapBoxComponent
  },
  { path: 'dialog', component: Dialog },
  { path: '',   redirectTo: '/loc/1', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
