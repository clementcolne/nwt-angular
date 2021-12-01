import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CreatePostComponent} from "../../create-post/create-post.component";
import {DeleteAccountComponent} from "../../delete-account/delete-account.component";
import {UpdatePasswordComponent} from "../../update-password/update-password.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  /**
   * Constructor of DialogService
   */
  constructor(private _dialog: MatDialog) { }

  /**
   * Open the dialog with CreatePostComponent as content
   */
  public openDialogCreatePost(): void {
    this._dialog.open(CreatePostComponent, {
      width: '100vh',
      height: '60vh',
    });
  }

  /**
   * Open the dialog with CreatePostComponent as content
   */
  public openDialogDeleteAccount(): void {
    this._dialog.open(DeleteAccountComponent, {
      width: '80vh',
      height: '35vh',
    });
  }

  /**
   * Open the dialog with UpdatePassword as content
   */
  public openDialogUpdatePassword(): void {
    this._dialog.open(UpdatePasswordComponent, {
      width: '80vh',
      height: '30vh',
    });
  }

  /**
   * Close the dialog
   */
  public closeDialogService(): void {
    this._dialog.closeAll();
  }
}
