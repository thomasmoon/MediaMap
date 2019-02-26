import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as $ from 'jquery';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'dialog-block',
  templateUrl: 'dialog.html',
  styleUrls: ['dialog-dialog.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class Dialog {

  dialogOpen = false;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {

    this.dialogOpen = true;

    const dialogRef = this.dialog.open(DialogDialog, {
      width: '320px',
      height: '180px',
      data: {
        },
      panelClass: 'custom-dialog'
    });

    dialogRef.beforeClose().subscribe(result => {
      $('.camera').html($('.videoWrapper'));
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;
    });


    $('.mat-dialog-container').html($('.videoWrapper'));
    
  }


  // window resize
  onResize(event){

    // Close the dialog if resizing the screen to be bigger than
    if (this.dialogOpen && event.target.innerWidth >= 640) {
      this.dialog.closeAll();
    }
  }
}

@Component({
  selector: 'dialog-dialog',
  templateUrl: 'dialog-dialog.html',
})
export class DialogDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {

    this.dialogRef.close();
  }

}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */