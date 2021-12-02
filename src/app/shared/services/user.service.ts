import { Injectable } from '@angular/core';
import {User} from "../types/user.type";
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {OptionsService} from "./options.service";
import {map} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _backendURL: any;

  /**
   * Constructor of User Service
   */
  constructor(private _http: HttpClient, private _optionsService : OptionsService) {
    this._backendURL = {};

    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }

    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);
  }

  /**
   * Send a HTTP request to create a user
   * @param value
   */
  public createUser(value: any): Observable<any> {
    let user = {
      "username": String(value.username),
      "email": String(value.email),
      "password": String(value.password)
    };
    return this._http.post<User>("http://localhost:3000/users", JSON.stringify(user), this._optionsService.httpOptions);
  }

  /**
   * Returns the user with the id in parameter
   * @param id id of the user
   */
  public getUserById(id: number): Observable<User> {
    return this._http.get<User>("http://localhost:3000/users/id/" + id, <Object>this._optionsService.httpOptions);
  }

  /**
   * Returns the user which username is parameter
   * @param username username of the user
   */
  public getUserByUsername(username: string): Observable<User>{
    return this._http.get<User>("http://localhost:3000/users/" + username, <Object>this._optionsService.httpOptions);
  }

  public getAllUsers() : Observable<User[]>{
    return this._http.get<User[]>("http://localhost:3000/users", <Object>this._optionsService.httpOptions);
  }

  /**
   * Add image to database and return an observable of its filename
   * @param file File to upload
   */
  public addImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post<string>("http://localhost:3000/uploads/media", formData);
  }

  /**
   * Deletes the connected user from the database and all its datas
   */
  public deleteUser(username : string): Observable<string> {
    console.log("Suppression d'un user");
    return this._http.delete("http://localhost:3000/users/"+ username, this._optionsService.httpOptions).pipe(
      map(() => username)
    );
  }

  public getProfilePicture(user : User) : string{
    return this._backendURL.public.replace(':media', user.profilePicture);
  }

  /**
   * Update the passwords of the connected user
   */
  public updatePassword(user : User, password: string): Observable<User> {
    let newPass = {
      "password" : password
    }
    return this._http.patch<User>("http://localhost:3000/users/"+user.username, JSON.stringify(newPass), <Object>this._optionsService.httpOptions);
  }

  /**
   * Return true if the user (username + password) exists
   * @param username username of the user
   * @param password password of the user
   */
  public connect(username: string, password: string): Observable<any> {
    return this._http.post("http://localhost:3000/auth/login", JSON.stringify({username, password}), this._optionsService.httpOptions);
  }

  /**
   * Update the connected user account
   * @param user user to change
   * @param username new username
   * @param email new email
   * @param description new description of the profile
   * @param profilePictureUrl new profile picture
   * @param isPrivate privacy of the account
   */
  public updateUser(user: User, username: string, email: string, description: string, profilePictureUrl: string, isPrivate: boolean): Observable<any> {
    let userUpdated = {
      "username": username,
      "email": email,
      "description": description,
      "profilePicture": profilePictureUrl,
      "isPrivate": isPrivate
    } as User;
    return this._http.patch<User>("http://localhost:3000/users/"+user.username, JSON.stringify(userUpdated), <Object>this._optionsService.httpOptions);
  }

}
