import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../shared/services/user.service";
import {CustomValidators} from "../shared/validators/account-validator";
import {User} from "../shared/types/user.type";
import {AuthService} from "../shared/services/auth.service";
import {NotificationsService} from "../shared/services/notifications.service";
import {ReloadFeedService} from "../shared/services/reload-feed.service";

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  // proprety to notice user if there is an error when he tried to connect
  private _errorExistingAccount: boolean;
  // private property to store form value
  private readonly _form: FormGroup;
  // private proprety to indicate if password and password_confirmed are same
  private _isPwdMatching: boolean;
  // passwords in the form
  private _password: string;
  private _password_confirmed: string;
  private _hide_password: boolean;

  /**
   * Constructor of Connection Component
   * @param _router Router
   * @param _userService UserService
   * @param _authService AuthService
   * @param _notifService
   * @param _reloadFeedService
   */
  constructor(private _router : Router, private _userService: UserService, private _authService: AuthService,
              private _notifService : NotificationsService, private _reloadFeedService : ReloadFeedService) {
    this._form = this._buildForm();
    this._errorExistingAccount = false;
    this._isPwdMatching = false;
    this._password = "";
    this._password_confirmed = "";
    this._hide_password = true;
  }

  /**
   * Returns the value of _form
   */
  public get form(): FormGroup {
    return this._form;
  }

  /**
   * Sets the value of hide_password
   */
  set hide_password(value: boolean) {
    this._hide_password = value;
  }

  /**
   * Returns the value of hide_password
   */
  get hide_password(): boolean {
    return this._hide_password;
  }


  /**
   * Builds the FormGroup and returns its value
   */
  private _buildForm(): FormGroup {
    //TODO : remettre les validators en place
    return new FormGroup({
      username: new FormControl('', Validators.compose([
        Validators.required,
        //Validators.minLength(4),
        Validators.maxLength(30),
        // letters, min or maj, numbers, and . _ - characters
        //Validators.pattern('^[a-zA-Z0-9._-]+$'),
        CustomValidators.forbiddenNameValidator(/Clement/i)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        ///Validators.minLength(8),
        Validators.maxLength(30),
        //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_-])[A-Za-z\\d@$!%*?&]{8,}$')
      ])),
        passwordConfirmed: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    },
      { validators: CustomValidators.matchPasswords('password', 'passwordConfirmed') }
    );
  }

  /**
   * Tries to connect the user
   * @param value
   */
  public submit(value: any): void {
    this._userService.createUser(value).subscribe(
      //If the username and email are unique, the user is connected
      data => {
        this._authService.connect(value.username, value.password).subscribe(
          data => {
            this._authService.saveToken(data);
            this._authService.saveUser(value);
            this._reloadFeedService.emitReloadNotifEvent();
            //this._notifService.loadNotifications(value.username);
            this._router.navigate([""]).then();
          }
        );
      },
      //Else, the error is shown
      err => {
        this._errorExistingAccount = true;
      }
    );
  }

  /**
   * Returns the value of _errorConnection
   */
  public existingAccount(): boolean {
    return this._errorExistingAccount;
  }

  ngOnInit(): void {
  }

}
