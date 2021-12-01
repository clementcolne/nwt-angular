import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {Observable} from "rxjs";
import {Message} from "../types/message.type";
import {HttpClient} from "@angular/common/http";
import {OptionsService} from "./options.service";
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private _socket: Socket, private _http: HttpClient, private _optionsService: OptionsService) {
  }
  sendChat(payload: Message): Observable<Message>{
    this._socket.emit('chat', payload);
    return this._http.post<Message>("http://localhost:3000/chats", payload, <Object>this._optionsService.httpOptions);
  }

  receiveChat(): Observable<Message>{
    return this._socket.fromEvent('chat');
  }

  public loadMessages(src: number, dst: number): Observable<Message[]> {
    return this._http.get<Message[]>("http://localhost:3000/chats/" + src + "/" + dst,
      <Object>this._optionsService.httpOptions);
  }

  public getOpenConversations(src: number): Observable<Message[]> {
    return this._http.get<Message[]>("http://localhost:3000/chats/" + src,
      <Object>this._optionsService.httpOptions);
  }
}
