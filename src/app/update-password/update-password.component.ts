import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../shared/validators/account-validator";
import {DialogService} from "../shared/services/dialog.service";
import {UserService} from "../shared/services/user.service";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  private readonly _form: FormGroup;
  private _hidePassword : boolean;

  constructor(private _dialogService: DialogService, private _userService: UserService, private _authService : AuthService) {
    this._form = this._buildForm();
    this._hidePassword = true;
  }

  /**
   * Tries to connect the user
   * @param value informations about the user (username + password)
   */
  public submit(value: any): void {
    this._authService.updateConnectedUserPassword(value.password).subscribe(
      value => this._dialogService.closeDialogService()
    );

  }

  public cancel(): void {
    this._dialogService.closeDialogService();
  }

  /**
   * Builds the FormGroup and returns its value
   */
  private _buildForm(): FormGroup {
    return new FormGroup({
        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_-])[A-Za-z\\d@$!%*?&]{8,}$')
        ])),
        passwordConfirmed: new FormControl('', Validators.compose([
          Validators.required,
        ]))
      },
      { validators: CustomValidators.matchPasswords('password', 'passwordConfirmed') }
    );
  }

  /**
   * Returns the value of _form
   */
  public get form(): FormGroup {
    return this._form;
  }


  get hidePassword(): boolean {
    return this._hidePassword;
  }

  set hidePassword(value: boolean) {
    this._hidePassword = value;
  }

  ngOnInit(): void {
  }

}
