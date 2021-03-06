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

  /**
   * Constructor of Chat service
   * @param _socket Socket to create chat canals
   * @param _http Http client to send http requests
   * @param _optionsService Options service to get http header
   */
  constructor(private _socket: Socket, private _http: HttpClient, private _optionsService: OptionsService) {
  }

  /**
   * Create a new conversation
   * @param payload message to send
   */
  sendChat(payload: Message): Observable<Message>{
    this._socket.emit('chat', payload);
    return this._http.post<Message>("http://localhost:3000/chats", payload, <Object>this._optionsService.httpOptions);
  }

  /**
   * Handle the message receiving event
   */
  receiveChat(): Observable<Message>{
    return this._socket.fromEvent('chat');
  }

  /**
   * Load the messages for a given conversation
   * @param src id of the sender
   * @param dst id of the recipient
   */
  public loadMessages(src: number, dst: number): Observable<Message[]> {
    return this._http.get<Message[]>("http://localhost:3000/chats/" + src + "/" + dst,
      <Object>this._optionsService.httpOptions);
  }

  /**
   * Load the messages of an existing conversation
   * @param src id of the sender
   */
  public getOpenConversations(src: number): Observable<Message[]> {
    return this._http.get<Message[]>("http://localhost:3000/chats/" + src,
      <Object>this._optionsService.httpOptions);
  }
}
