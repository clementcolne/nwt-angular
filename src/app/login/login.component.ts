import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {NotificationsService} from "../shared/services/notifications.service";
import {ReloadFeedService} from "../shared/services/reload-feed.service";

@Component({
  selector: 'app-connection',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private readonly _form: FormGroup;
  // true if there is an error at the connexion
  private _errorConnection: boolean;
  private _errorStatusCode: number;
  private _hidePassword: boolean;

  /**
   * Constructor of Connection Component
   * @param _router Router
   * @param _authService Authentication service to get information of the connected user
   * @param _notifService Notification service to fetch the notifications of the connected user
   * @param _reloadFeedService Reload service to trigger the notification load event
   */
  constructor(private _router : Router, private _authService: AuthService, private _notifService : NotificationsService, private _reloadFeedService: ReloadFeedService) {
    this._form = this._buildForm();
    this._errorConnection = false;
    this._errorStatusCode = 0;
    this._hidePassword = true;
  }

  /**
   * Returns the value of _form
   */
  public get form(): FormGroup {
    return this._form;
  }

  /**
   * Builds the FormGroup and returns its value
   */
  private _buildForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    });
  }

  /**
   * Tries to connect the user
   * @param value informations about the user (username + password)
   */
  public submit(value: any): void {
    this._authService.connect(value.username, value.password).subscribe(
      //If the username and password are correct, user is connected
      data => {
        this._authService.saveToken(data);
        this._authService.saveUser(value);
        this._reloadFeedService.emitReloadNotifEvent();
        this._router.navigate([""]).then();
      },
      //Else, the error is handled as per the status code
      err => {
        this._errorStatusCode = err.error.statusCode;
        this._errorConnection = true;
      }
    );
  }

  /**
   * Returns the value of _errorConnection
   */
  public errorConnection(): boolean {
    return this._errorConnection;
  }

  /**
   * Return the value of _hidePassword
   */
  public get hidePassword(): boolean {
    return this._hidePassword;
  }

  /**
   * Set the value of _hidePassword
   */
  public set hidePassword(value: boolean) {
    this._hidePassword = value;
  }

  ngOnInit(): void {
  }

}
