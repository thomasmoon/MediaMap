import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './course/map/map.component';
import { Dialog } from './dialog/dialog.component';

import { MapService } from './services/map.service';
import { SidenavService } from './services/sidenav.service';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';

import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule } from '@angular/material/list';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatTableModule,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTabsModule,
  MatCheckboxModule
} from '@angular/material';
import { MediaToolsComponent } from './media-tools/media-tools.component';
import { ContentComponent } from './course/content/content.component';
import { ToolsComponent } from './course/tools/tools.component';
import { CourseComponent } from './course/course.component';
import { VideoComponent } from './course/video/video.component';
import { CommentsComponent } from './course/comments/comments.component';
import { VideosComponent } from './admin/videos/videos.component';
import { CommentsAdminComponent } from './admin/comments/comments.component';
import { TableComponent } from './shared/table/table.component';
import { PrivacyComponent } from './privacy/privacy.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    Dialog,
    MediaToolsComponent,
    ContentComponent,
    ToolsComponent,
    CourseComponent,
    VideoComponent,
    CommentsComponent,
    VideosComponent,
    CommentsAdminComponent,
    TableComponent,
    PrivacyComponent
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule
  ],
  entryComponents: [
    Dialog
  ],
  providers: [
    AuthService,
    MapService,
    SidenavService,
    AngularFirestore,
    AuthGuard,
    AdminGuard,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
