import { Component, OnInit } from '@angular/core';
import {Post} from "../shared/types/post.type";
import {PostService} from "../shared/services/post.service";
import {UserService} from "../shared/services/user.service";
import {User} from "../shared/types/user.type";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../shared/services/auth.service";
import {FollowService} from "../shared/services/follow.service";
import {Follow} from "../shared/types/follow.type";
import {NotificationsService} from "../shared/services/notifications.service";
import {ReloadFeedService} from "../shared/services/reload-feed.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _posts: Post[];
  private _user: User;
  private _userSubscription: Subscription;
  private _postSubscription: Subscription;
  private _reloadSubscription: Subscription;
  private _follow: string;
  private _postsObservable: Observable<Post[]>;
  private _isAccessible: boolean;

  /**
   * Constructor of ProfileComponent
   * @param _postService Post service to get posts of the user
   * @param _userService User service to get user information
   * @param _route Activated Route
   * @param _authService Authentication service to know if this profile is the one of the connected user
   * @param _followService Follow service to handle the subscribe button
   * @param _notificationService Notification service to handle subscribe notification
   * @param _reloadService Reload service to only show posts that haven't been deleted
   * @param _router Router
   */
  constructor(private _postService: PostService, private _userService: UserService, private _route: ActivatedRoute,
              private _authService : AuthService, private _followService: FollowService,
              private _notificationService: NotificationsService, private _reloadService : ReloadFeedService,
              private _router: Router) {
    this._posts = [] as Post[];
    this._user = {} as User;
    this._userSubscription = {} as Subscription;
    this._postSubscription = {} as Subscription;
    this._reloadSubscription = {} as Subscription;
    this._follow = "S'abonner";
    this._postsObservable = {} as Observable<Post[]>;
    this._isAccessible = true;
  }

  /**
   * Returns the posts of the connected user
   */
  public get posts(): Post[] {
    return this.isAccessible ? this._posts : [];
  }

  /**
   * Return the number of posts on this profile
   */
  public getNbPosts(): number{
    return this._posts.length;
  }

  /**
   * Return true if the profile is visible by the connected user
   */
  public get isAccessible(): boolean{
    return this._isAccessible || this.isConnectedUserAccount();
  }

  /**
   * Return true if the current profile's user if the one of the connected user
   */
  public isConnectedUserAccount(): boolean {
    return this._authService.connectedUser.id === this._user.id;
  }

  /**
   * Returns the text value for follow button
   */
  public get follow(): string {
    return this._follow;
  }

  /**
   * Reload the posts to show
   */
  private _reloadFeed(): void {
    this._postService.fetchAllByUser(this._user.id).subscribe(
      posts => {
        this._posts = posts ? posts.reverse() : [];
      }
    );
  }

  /**
   * Return the path of the profile picture of a given user
   * @param user user to get profile picture of
   */
  public getProfilePicture(user : User): string {
    if(user.profilePicture)
      return this._userService.getProfilePicture(user);
    return "http://localhost:3000/public/default/default.png"
  }

  /**
   * Follow or unfollow the user by the connected user
   */
  public onFollow(): void {
    if(this._follow === "S'abonner") {
      // push follow in db
      this._followService.follow(this._user).subscribe(value => this._user = value)
      // sends a notification to the owner of the post
      this._notificationService.sendNotification(this._user.id, String(this._authService.connectedUser.id), "follow")
      // update button content
      this._follow = "Se Désabonner";
      this._isAccessible = true;
    }else{
      // push unfollow in db
      this._followService.unFollow(this._user).subscribe(value => this._user = value)
      // update button content
      this._follow = "S'abonner";
      this._isAccessible = !this._user.isPrivate;
    }
  }

  /**
   * Returns the connected user
   */
  public get user(): User {
    return this._user;
  }

  /**
   * Subscribe to get user id in parameter of the route, and initialize the list of posts
   */
  ngOnInit(): void {
    this._userSubscription = this._route.params.subscribe(params => {
      //gets user by username
      this._userService.getUserByUsername(params['username']).subscribe(
        user => {
          this._user = user
          // update content of follow button depending of the user is already followed or not
          this._followService.getFollowers(this._authService.connectedUser.id).subscribe(value => {
            let found = value && value.find(follow => follow.idFollowed === this._user.id) as Follow
            this._follow = found ? "Se Désabonner" : "S'abonner";

            //The profile is accessible if the account isn't private,
            // or if the connected user follows the one which profile page is the current one
            //or if it's the profile of the connected user
            this._isAccessible = (!this._user.isPrivate || !!found || this._authService.connectedUser.id == this._user.id)
          })
          this._postSubscription = this._postService.fetchAllByUser(this._user.id).subscribe(
            posts => this._posts = posts ? posts.reverse() : []
          );
        }
      );
    });
    this._reloadSubscription = this._reloadService.getEventSubsciption().subscribe(() => this._reloadFeed());
  }

  /**
   * Destroy subscription on destroy
   */
  ngOnDestroy(): void {
    if(!this._userSubscription.closed)
      this._userSubscription.unsubscribe();
    if(!this._postSubscription.closed)
      this._postSubscription.unsubscribe();
    if(!this._reloadSubscription.closed)
      this._reloadSubscription.unsubscribe();
  }

}
