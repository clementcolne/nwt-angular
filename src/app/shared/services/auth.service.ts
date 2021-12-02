import { Injectable } from '@angular/core';
import {User} from "../types/user.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {CookieService} from "ngx-cookie-service";
import {OptionsService} from "./options.service";
import {Like} from "../types/like.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _connectedUser: User;

  /**
   * Constructor of Authentication service
   * @param _http Http Client to send http requests
   * @param _userService User service to get user information
   * @param _cookies Cookie service to update cookies
   * @param _optionsService Options service to get http header
   */
  constructor(private _http: HttpClient, private _userService : UserService, private _cookies : CookieService, private _optionsService : OptionsService) {
    this._connectedUser = localStorage.getItem('userConnected') ? JSON.parse(<string>localStorage.getItem('userConnected')) : {};
  }

  /**
   * Return the Observable of the post request to get a user
   * @param username username of the user
   * @param password password of the user
   */
  public connect(username: string, password: string): Observable<any> {
    return this._http.post("http://localhost:3000/auth/login", JSON.stringify({username, password}), this._optionsService.httpOptions);
  }

  /**
   * Save the JWS Token in the cookie 'Authorization'
   * Add the header 'Authorization' in http options
   * Update User service http options
   * @param token JWS Token
   */
  public saveToken(token: any): void {
    //Cookie handle
    this._cookies.delete("Authorization");
    this._cookies.set("Authorization", token.access_token);
  }

  /**
   * Save the the connected user
   * Get user from database by his username
   * @param user data username + password of the user
   */
  public saveUser(user: any): void {
    this._userService.getUserByUsername(user.username).subscribe(
      user => {
        let userString = JSON.stringify(user);
        localStorage.setItem('userConnected', userString);
        this._connectedUser = user;
      }
    );
  }

  /**
   * Return the connected user
   */
  get connectedUser(): User {
    return this._connectedUser;
  }

  /**
   * Disconnect user
   * Delete 'Authorization' cookie
   */
  public deconnexion(): void {
    this._cookies.delete('Authorization');
    localStorage.removeItem('userConnected');
  }

  /**
   * Return true if user is logged
   */
  isLoggedIn() : boolean {
    return this._cookies.check("Authorization");
  }

  /**
   * Return all liked posts of the user
   */
  public getLikedPosts(): Observable<Like[]> {
    return this._http.get<Like[]>("http://localhost:3000/likes/" + this._connectedUser.id, <Object>this._optionsService.httpOptions);
  }

  /**
   * Update the connected user account
   * @param username new username
   * @param email new email
   * @param description new description of the profile
   * @param profilePictureUrl new profile picture
   * @param isPrivate new private status
   */
  public updateConnectedUser(username: string, email: string, description: string, profilePictureUrl: string, isPrivate: boolean): Observable<User> {
    return this._userService.updateUser(this._connectedUser, username, email, description, profilePictureUrl, isPrivate);
  }

  /**
   * Update the connected user password
   * @param password new password
   */
  updateConnectedUserPassword(password : string) : Observable<User> {
    return this._userService.updatePassword(this.connectedUser, password);
  }
}
