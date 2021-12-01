import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from "../shared/services/chat.service";
import {AuthService} from "../shared/services/auth.service";
import {Message} from "../shared/types/message.type";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../shared/services/user.service";
import {Post} from "../shared/types/post.type";

@Component({
  selector: 'app-chat',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  public message: string = '';
  public messages: Message[] = [];
  private _dst: number = 0;
  private _mateName: string = '';

  constructor(private _chatService: ChatService, private _authService: AuthService, private _route: ActivatedRoute,
              private _userService: UserService){
  }

  @Input()
  public set id(dst: number) {
    this._dst = dst;
    // we get all old messages
    this._chatService.loadMessages(this._dst, this._authService.connectedUser.id).subscribe(value => {
      if(value)
        this.messages = value
    })

    this._userService.getUserById(this._dst).subscribe(value => this._mateName = value.username);

    // then, we subscribe to new messages
    this._chatService.receiveChat().subscribe((message: Message) => {
      if(message.dst === this._authService.connectedUser.id)
        this.messages.push(message);
    });
  }

  public isAuthor(src: number): boolean {
    return this._authService.connectedUser.id === src;
  }

  public get mateName(): string {
    return this._mateName;
  }

  ngOnInit(){

  }

  addChat(){
    let payload = {
      src: this._authService.connectedUser.id,
      dst: this._dst,
      author: this._authService.connectedUser.username,
      message: this.message
    } as Message;
    this.messages.push(payload);
    this._chatService.sendChat(payload).subscribe();
    this.message = '';
  }

}
