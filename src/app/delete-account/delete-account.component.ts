import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {DialogService} from "../shared/services/dialog.service";
import {Router} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  /**
   * Constructor of DeleteAccount component
   * @param _userService User service
   * @param _dialogService Dialog service to open dialog
   * @param _router Router
   * @param _authService Authentication service to get information of the connected user
   */
  constructor(private _userService: UserService, private _dialogService: DialogService, private _router: Router, private _authService : AuthService) { }

  /**
   * Confirm the deletion of the account
   */
  public confirm(): void {
    this._userService.deleteUser(this._authService.connectedUser.username).subscribe();
    this._authService.deconnexion();
    this._router.navigate(['/connexion']).then();
    this._dialogService.closeDialogService();
  }

  /**
   * Cancel the deletion of the account
   */
  public cancel(): void {
    this._dialogService.closeDialogService();
  }

  ngOnInit(): void {
  }

}
