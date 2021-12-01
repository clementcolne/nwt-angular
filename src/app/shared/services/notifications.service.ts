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

  private _notifsLoaded : Notification[];
  private _authorsNotifs : Map<Notification, string>;
  private _unreadNotifs: number;

  constructor(private _http: HttpClient, private _optionsService : OptionsService, private _authService : AuthService, private _userService: UserService) {
    this._notifsLoaded = [];
    this._authorsNotifs = new Map<Notification, string>();
    this._unreadNotifs = 0;
  }

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

  public getNotificationsByUser(id: number) : Observable<Notification[]>{
    return this._http.get<Notification[]>("http://localhost:3000/notifications/"+id, <Object>this._optionsService.httpOptions);
  }

  public updateNotification(id: number) : Observable<Notification>{
    let payload;
    this._unreadNotifs--;
    return this._http.patch<Notification>("http://localhost:3000/notifications/"+id, payload, <Object>this._optionsService.httpOptions);
  }

  public getNbUnreadNotifs(){
    let cpt = 0;
    this._notifsLoaded.map(n => {
      cpt += !n.isRead ? 1 : 0
    });
    return cpt;
  }

  public loadNotifications(username : string) : void {
    this._userService.getUserByUsername(username).subscribe(
      user => {
        this.getNotificationsByUser(user.id).subscribe(
          value => {
            if (value) {
              this._notifsLoaded = value
              this._notifsLoaded.map(notif => {
                this._userService.getUserById(notif.author).subscribe(
                  user => this._authorsNotifs.set(notif, user.username)
                )
              })
            } else {
              this._notifsLoaded = [];
            }
          }
        )
      }
    );
  }

  public get notifsLoaded() : Notification[]{
    return this._notifsLoaded
  }

  public getAuthorName(not : Notification) : string | undefined{
    return this._authorsNotifs.get(not);
  }
}
