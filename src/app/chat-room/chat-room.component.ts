import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from "../shared/services/chat.service";
import {AuthService} from "../shared/services/auth.service";
import {Message} from "../shared/types/message.type";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../shared/services/user.service";

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

  /**
   * Constructor of Chat room component
   * @param _chatService Chat service to get chat data
   * @param _authService Authentication service to get connected user information
   * @param _route Activated route
   * @param _userService User service to get conversation partner information
   */
  constructor(private _chatService: ChatService, private _authService: AuthService, private _route: ActivatedRoute,
              private _userService: UserService){
  }

  /**
   * Sets the id of the conversation partner
   * @param dst id of the user
   */
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

  /**
   * Returns true if the id of the conversation source user is the same as the connected user's one
   * @param src id of the conversation source user
   */
  public isAuthor(src: number): boolean {
    return this._authService.connectedUser.id === src;
  }

  /**
   * Returns the conversation partner's name
   */
  public get mateName(): string {
    return this._mateName;
  }

  ngOnInit(){
  }

  /**
   * Create a new conversation
   */
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
