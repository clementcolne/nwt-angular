import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {User} from "../shared/types/user.type";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../shared/validators/account-validator";
import {Router} from "@angular/router";
import {DialogService} from "../shared/services/dialog.service";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

  private readonly _form: FormGroup;
  private _imgUrl: string;
  private _errorExistingAccount : boolean;
  private _usernameControl = new FormControl();
  private _emailControl = new FormControl();
  private _descriptionControl = new FormControl();
  private _dataChanged : boolean;
  private _pictureChanged : boolean;
  private _file: File;
  private _privacyChanged;

  /**
   * Constructor of ParametersComponent
   */
  constructor(private _userService: UserService, private _router: Router, private _dialogService: DialogService, private _authService : AuthService) {
    this._form = this._buildForm();
    this._imgUrl = "";
    this._errorExistingAccount = false;
    this._dataChanged = false;
    this._pictureChanged = false;
    this._file = {} as File;
    this._privacyChanged = false;
  }

  /**
   * Returns the connected user
   */
  public get user(): User {
    return this._authService.connectedUser;
  }

  /**
   * Returns 'privé' if the account is private, otherwise 'public'
   */
  public privacyMessage(): string {
    return this._authService.connectedUser.isPrivate ? "privé" : "public";
  }

  /**
   * Change the privacy of the user account
   */
  public changePrivacy(): void {
    this._authService.connectedUser.isPrivate = !this._authService.connectedUser.isPrivate;
    this._privacyChanged = !this._privacyChanged;
  }

  /**
   * Return true if the account is private, otherwise false
   */
  public isPrivate(): boolean {
    return this._authService.connectedUser.isPrivate;
  }

  public get privacyChanged(): boolean {
    return this._privacyChanged;
  }

  /**
   * Open a dialog to update password
   */
  public updatePassword(): void {
    this._dialogService.openDialogUpdatePassword();
  }

  /**
   * Open a dialog as a confirmation of account deletion
   */
  public deleteAccount(): void {
    this._dialogService.openDialogDeleteAccount();
  }

  /**
   * Tries to connect the user
   * @param value informations about the user (username + password)
   */
  public submit(value: any): void {
    if(this._pictureChanged) {
      this._userService.addImage(this._file).subscribe(
        _ => {},
        response => {
          this._authService.updateConnectedUser(value.username, value.email, value.description, response.error.text,
          this._authService.connectedUser.isPrivate).subscribe(
            user => {
              this._errorExistingAccount = false;
              this._authService.saveUser(user);
              this._dataChanged = true;
              this._pictureChanged = false;
            },
          );
        });
    }else{
      this._authService.updateConnectedUser(value.username, value.email, value.description,
        this._authService.connectedUser.profilePicture, this._authService.connectedUser.isPrivate).subscribe(
        user => {
          this._errorExistingAccount = false;
          this._authService.saveUser(user);
          this._dataChanged = true;
          this._pictureChanged = false;
        },
      );
    }

  }

  get dataChanged(): boolean {
    return this._dataChanged;
  }

  get pictureChanged(): boolean {
    return this._pictureChanged;
  }

  get errorExistingAccount(): boolean {
    return this._errorExistingAccount;
  }

  /**
   * Return the URl of the profile picture
   */
  public get profilePictureUrl(): string {
    return this._imgUrl;
  }

  /**
   * When the user uploads image, it loads its url
   * @param event $event
   */
  public onChangeProfilePicture(event: any): void {
    if (event.target.files) {
      if(event.target.files[0].type === "image/jpeg") {
        this._file = <File>event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this._imgUrl = event.target.result;
          this._pictureChanged = true;
        }
      }
    }
  }

  /**
   * Builds the FormGroup and returns its value
   */
  private _buildForm(): FormGroup {
    return new FormGroup({
        username: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          // letters, min or maj, numbers, and . _ - characters
          Validators.pattern('^[a-zA-Z0-9._-]+$'),
          CustomValidators.forbiddenNameValidator(/^Clement$/i)
        ])),
        email: new FormControl('', Validators.compose([
          Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')
        ])),
        description: new FormControl('', Validators.compose([
          Validators.maxLength(512),
        ]))
      },
    );
  }

  /**
   * Returns the value of _form
   */
  public get form(): FormGroup {
    return this._form;
  }

  get usernameControl(): FormControl {
    return this._usernameControl;
  }

  get emailControl(): FormControl {
    return this._emailControl;
  }

  get descriptionControl(): FormControl {
    return this._descriptionControl;
  }

  ngOnInit(): void {
    // fill the form
    this._form.patchValue(this._authService.connectedUser);
    this._imgUrl = this._userService.getProfilePicture(this._authService.connectedUser);
  }

}
