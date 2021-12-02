import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ReloadFeedService} from "../shared/services/reload-feed.service";
import {DialogService} from "../shared/services/dialog.service";
import {UserService} from "../shared/services/user.service";
import {User} from "../shared/types/user.type";
import {FormControl} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Notification} from "src/app/shared/types/notification.type";
import {AuthService} from "../shared/services/auth.service";
import {NotificationsService} from "../shared/services/notifications.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private _searchValue : string;
  private _clickedSearch : boolean;
  private _myControl = new FormControl();
  private _users: User[];
  private _filteredUsers: Observable<User[]>;
  private _authorNotifUsername: string;
  private _notifs : Notification[];
  private _notifsRead : boolean;
  private _unreadNotifs : number;
  private _eventsSubscription: Subscription;
  private _authorsNotifs: Map<Notification, string>;

  /**
   * Constructor of Navbar Component
   * @param _router Router
   * @param _reloadFeedService Reload service to update notifications
   * @param _dialogService Dialog service to open creation post dialog
   * @param _userService User service to get information of all of the users
   * @param _authService Authentication service to get information of the connected user
   * @param _notifService Notification service to get notifications
   */
  constructor(private _router: Router, private _reloadFeedService: ReloadFeedService, private _dialogService: DialogService,
              private _userService: UserService, private _authService : AuthService, private _notifService : NotificationsService) {
    this._searchValue = "";
    this._clickedSearch = false;
    this._users = [];
    _userService.getAllUsers().subscribe(
      value => this._users = value
    )
    this._filteredUsers = new Observable<User[]>();
    this._notifs = [];
    this._authorNotifUsername = "";
    this._notifsRead = false;
    this._unreadNotifs = 0;
    this._eventsSubscription = {} as Subscription;
    this._authorsNotifs = new Map<Notification, string>();
    setInterval(()=> { this._reloadNotifs() }, 3000);
  }

  /**
   * Set the notification in parameter to read
   * @param notif notification read
   */
  public readNotifs(notif : Notification): void{
    this._notifService.updateNotification(notif.id).subscribe(
      _ => {
        this._reloadNotifs()
      }
    );
  }

  /**
   * Return the number of unread notifications
   */
  get nbUnreadNotif(): number{let cpt = 0;
    this._notifs.map(n => {
      cpt += !n.isRead ? 1 : 0
    });
    return cpt;
  }

  /**
   * Return the list of the notifications of the connected user
   */
  get notifs(): Notification[] {
    return this._notifs.reverse();
  }

  /**
   * Return path to a user profile picture
   * @param user User to get profile picture of
   */
  public getProfilePicture(user : User): string{
    return this._userService.getProfilePicture(user);
  }

  /**
   * Return path to user connected profile picture
   */
  get profilePicture() : string{
    return this._userService.getProfilePicture(this._authService.connectedUser);
  }

  /**
   * Return wether or not the search button has been clicked
   */
  get clickedSearch(): boolean {
    return this._clickedSearch;
  }

  /**
   * Toggle the search bar
   * @param value true if search bar is enabled
   */
  set clickedSearch(value: boolean) {
    if(!value)
      this.searchValue = '';
    this._clickedSearch = value;
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

  /**
   * Return the filtered list of the users
   */
  get filteredUsers(): Observable<User[]> {
    return this._filteredUsers;
  }

  /**
   * Return _myControl
   */
  get myControl(): FormControl {
    return this._myControl;
  }

  /**
   * Display the profile page of the user searched
   */
  public search():void{
    this._router.navigate(["profil/"+(this._searchValue)]).then();
    this.clickedSearch = false;
    this._searchValue = "";
  }

  /**
   * Scroll page to top and trigger event to reload posts
   */
  public home(): void {
    // check which current rooter it is
    if(this._router.url == "/") {
      // if we are on the feed, we reload the posts and scroll to top
      this._reloadFeedService.emitReloadFeedEvent();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }else{
      // else, we just navigate to the feed page
      this._router.navigate(['/']).then();
    }
  }

  /**
   * Open the dialog to create a post
   */
  public openDialog(): void {
    this._dialogService.openDialogCreatePost();
  }

  /**
   * Return true of the user is logged, otherwise false
   */
  public get isLogged(): boolean {
    return this._authService.isLoggedIn();
  }

  /**
   * Returns the connected user
   */
  public get connectedUser(): User {
    return this._authService.connectedUser;
  }

  /**
   * Filter the users in search bar
   * @param value text entered in searchbar
   */
  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this._users.filter(user => user.username.toLowerCase().includes(filterValue));
  }

  /**
   * Disconnect the connected user
   */
  public deconnexion(): void {
    this._clickedSearch = false;
    this._authService.deconnexion();
    this._router.navigate(["connexion"]).then();
  }

  /**
   * Return the author name of the content of the notification in parameter
   * @param notif notification to find author's name content
   */
  public getAuthorName(notif : Notification) : string |  undefined{
    return this._authorsNotifs.get(notif);
  }

  /**
   * On initialisation, the filter is initialized,
   * the notifications of the connected user are loaded
   */
  ngOnInit(): void {
    this._filteredUsers = this._myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this._users.slice())),
    );
    this._eventsSubscription = this._reloadFeedService.getEventLoadNotif().subscribe(() => this._reloadNotifs());
    if(this._authService.isLoggedIn() && this._authService.connectedUser) {
      this._notifService.getNotificationsByUser(this._authService.connectedUser.id).subscribe(
        value => {
          if (value) {
            this._notifs = value
            this._notifs.map(notif => {
              this._userService.getUserById(notif.author).subscribe(
                user => this._authorsNotifs.set(notif, user.username)
              )
            })
          } else {
            this._notifs = [];
          }
        }
      );
    }
  }

  /**
   * Reload notifications of the connected user
   * @private
   */
  private _reloadNotifs() {
    if(this._authService.isLoggedIn() && this._authService.connectedUser) {
      this._notifService.getNotificationsByUser(this._authService.connectedUser.id).subscribe(
        value => {
          if (value) {
            this._notifs = value
            this._notifs.map(notif => {
              this._userService.getUserById(notif.author).subscribe(
                user => this._authorsNotifs.set(notif, user.username)
              )
            })
          } else {
            this._notifs = [];
          }
        }
      );
    }
  }
}
