import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OptionsService} from "./options.service";
import {AuthService} from "./auth.service";
import {Notification} from "src/app/shared/types/notification.type";
import {Observable} from "rxjs";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  /**
   * Constructor of Notification service
   * @param _http Http client to send http requests
   * @param _optionsService Options service to get http header
   * @param _authService Authentication service to get connected user information
   * @param _userService User service to get user information
   */
  constructor(private _http: HttpClient, private _optionsService : OptionsService, private _authService : AuthService, private _userService: UserService) {
  }

  /**
   * Create a new notification
   * @param recipient recipient of the notification
   * @param content id of the content of the notification (user or post)
   * @param type type of notification (like, comment or follow)
   */
  public sendNotification(recipient: number, content: string, type: string) {
    let payload = {
      recipient: recipient,
      author: this._authService.connectedUser.id,
      content: content,
      type: type,
      date: Date.now()
    }
    this._http.post<any>("http://localhost:3000/notifications", JSON.stringify(payload),
      <Object>this._optionsService.httpOptions).subscribe();
  }

  /**
   * Returns an Observable of all the notifications for a given user
   * @param id id of the user
   */
  public getNotificationsByUser(id: number) : Observable<Notification[]>{
    return this._http.get<Notification[]>("http://localhost:3000/notifications/"+id, <Object>this._optionsService.httpOptions);
  }

  /**
   * Update the read status of a given notification
   * @param id id of the notification
   */
  public updateNotification(id: number) : Observable<Notification>{
    let payload;
    return this._http.patch<Notification>("http://localhost:3000/notifications/"+id, payload, <Object>this._optionsService.httpOptions);
  }
}
