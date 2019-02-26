import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { Dialog } from './dialog/dialog.component';
import { DialogDialog } from './dialog/dialog.component';

import { MapService } from './services/map.service';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthService } from './services/auth.service';

import { AngularFirestore } from '@angular/fire/firestore';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatTabsModule
} from '@angular/material';
import { MediaToolsComponent } from './media-tools/media-tools.component';


@NgModule({
  declarations: [
    AppComponent,
    MapBoxComponent,
    Dialog,
    DialogDialog,
    MediaToolsComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatTabsModule
  ],
  entryComponents: [
    DialogDialog
  ],
  providers: [AuthService, MapService, AngularFirestore
    , { provide: MatDialogRef, useValue: {} }
    , { provide: MAT_DIALOG_DATA, useValue: [] }],
  bootstrap: [AppComponent]
})
export class AppModule { }
