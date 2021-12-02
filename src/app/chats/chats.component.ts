import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {UserService} from "../shared/services/user.service";
import {ChatService} from "../shared/services/chat.service";
import {User} from "../shared/types/user.type";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  private _openConversations: User[] = [];
  private _idConversation: number = 0;
  private _filteredUsers: Observable<User[]>;
  private _searchValue : string = '';
  private _myControl = new FormControl();
  private _users: User[] = [];

  constructor(private _authService: AuthService, private _userService: UserService, private _chatService: ChatService) {
    this._filteredUsers = new Observable<User[]>();
    this._userService.getAllUsers().subscribe(
      value => this._users = value
    )
  }

  /**
   * Return the filtered list of the follows
   */
  get filteredUsers(): Observable<User[]> {
    return this._filteredUsers;
  }

  public getProfilePicture(user : User): string{
    return this._userService.getProfilePicture(user);
  }

  public get openConversations(): User[] {
    return this._openConversations;
  }

  public setIdConversation(id: number): void {
    this._idConversation = id;
  }

  public search(): void {
    this._userService.getUserByUsername(this._searchValue).subscribe(value => this._idConversation = value.id)
  }

  public get idConversation(): number {
    return this._idConversation;
  }

  get myControl(): FormControl {
    return this._myControl;
  }

  /**
   * Return the search value
   */
  get searchValue(): string {
    return this._searchValue;
  }

  /**
   * Define the search value
   * Use to reset with value ''
   * @param value text to set the search value
   */
  set searchValue(value: string) {
    this._searchValue = value;
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this._users.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this._filteredUsers = this._myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this._users.slice())),
    );

    this._chatService.getOpenConversations(this._authService.connectedUser.id).subscribe(value => {
      for(let message of value) {
        this._userService.getUserById(message.src).subscribe(value2 => {
            this._openConversations.push(value2)
            this._openConversations = this._openConversations.filter((value) => value.username !== this._authService.connectedUser.username)
            this._openConversations = this._openConversations.filter((user, index, self) =>
                index === self.findIndex((u) =>
                (
                  u.id === user.id
                )
              )
            )
          }
        )
      }
    })
  }

}
