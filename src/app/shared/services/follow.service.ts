import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OptionsService} from "./options.service";
import {AuthService} from "./auth.service";
import {Follow} from "../types/follow.type";
import {Observable} from "rxjs";
import {User} from "../types/user.type";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  /**
   * Constructor of Follow service
   * @param _http Http client to send http requests
   * @param _optionsService Options service to get http header
   * @param _authService Authentication service to get connected user information
   */
  constructor(private _http: HttpClient, private _optionsService : OptionsService, private _authService: AuthService) { }

  /**
   * Follow the specified user in parameter
   * @param followedUser user to follow
   */
  public follow(followedUser: User): Observable<User> {
    let payloadFollow = {
      idFollower: this._authService.connectedUser.id,
      idFollowed: followedUser.id
    }
    // add follow on db
    this._http.post<any>("http://localhost:3000/follows", payloadFollow, <Object>this._optionsService.httpOptions).subscribe();
    // increment number of followed by connected user
    let payloadIncFollower = {
      nbFollow: this._authService.connectedUser.nbFollow + 1
    }
    this._http.patch<User>("http://localhost:3000/users/" + this._authService.connectedUser.username, payloadIncFollower,
      <Object>this._optionsService.httpOptions).subscribe(value => this._authService.saveUser(value));

    // increment number of followers of followed user
    let payloadIncFollowed = {
      nbFollowers: followedUser.nbFollowers + 1
    }
    return this._http.patch<User>("http://localhost:3000/users/" + followedUser.username, payloadIncFollowed,
      <Object>this._optionsService.httpOptions);
  }

  /**
   * Unfollow the specified user in parameter
   * @param unfollowedUser user to unfollow
   */
  public unFollow(unfollowedUser: User): Observable<User> {
    let payload = {
      idFollower: this._authService.connectedUser.id,
      idFollowed: unfollowedUser.id
    }
    // remove follow on db
    this._http.delete<any>("http://localhost:3000/follows", { headers: this._optionsService.httpOptions.headers,
      body: JSON.stringify(payload) }).subscribe();
    // decrement number of followed by connected user
    let payloadIncFollower = {
      nbFollow: this._authService.connectedUser.nbFollow - 1
    }
    this._http.patch<User>("http://localhost:3000/users/" + this._authService.connectedUser.username, payloadIncFollower,
      <Object>this._optionsService.httpOptions).subscribe(value => this._authService.saveUser(value));
    // decrement number of followers of followed user
    let payloadIncFollowed = {
      nbFollowers: unfollowedUser.nbFollowers - 1
    }
    return this._http.patch<User>("http://localhost:3000/users/" + unfollowedUser.username, payloadIncFollowed,
      <Object>this._optionsService.httpOptions);
  }

  /**
   * Return the list of all the follows of the user which id is parameter
   * @param id id of the user
   */
  public getFollowers(id: number): Observable<Follow[]> {
    return this._http.get<Follow[]>("http://localhost:3000/follows/" + id, <Object>this._optionsService.httpOptions);
  }
}
