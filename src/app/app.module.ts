import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { Dialog } from './dialog/dialog.component';
import { DialogDialog } from './dialog/dialog.component';

import { MapService } from './services/map.service';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AuthService } from './services/auth.service';

import { AngularFirestore } from '@angular/fire/firestore';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTabsModule,
  MatCheckboxModule
} from '@angular/material';
import { MediaToolsComponent } from './media-tools/media-tools.component';
import { ContentComponent } from './content/content.component';
import { ToolsComponent } from './tools/tools.component';
import { CourseComponent } from './course/course.component';
import { VideoComponent } from './video/video.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    Dialog,
    DialogDialog,
    MediaToolsComponent,
    ContentComponent,
    ToolsComponent,
    CourseComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule
  ],
  entryComponents: [
    DialogDialog
  ],
  providers: [
    AuthService,
    MapService,
    AngularFirestore,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
