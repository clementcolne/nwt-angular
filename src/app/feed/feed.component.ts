import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../shared/types/post.type";
import {PostService} from "../shared/services/post.service";
import {Subscription} from "rxjs";
import {ReloadFeedService} from "../shared/services/reload-feed.service";
import {FollowService} from "../shared/services/follow.service";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  private _posts: Post[];
  private _follows: number[];
  private _eventsSubscription: Subscription;

  /**
   * Constructor of Home
   */
  constructor(private _postService: PostService, private _reloadFeedService: ReloadFeedService,
              private _followService : FollowService, private _authService : AuthService) {
    this._posts = [];
    this._follows = [];
    this._eventsSubscription = {} as Subscription;
  }

  /**
   * Return all posts
   */
  public get posts(): Post[] | undefined {
    return this._posts ? this._posts : undefined;
  }

  /**
   * Reloads all posts when event is trigger from parent
   */
  private _reloadFeed(): void {
    this._postService.fetchAll().subscribe(
      posts => {
        this._posts = posts.reverse()
      }
    );
  }

  /**
   * At initialisation, load posts
   */
  ngOnInit(): void {
    this._postService.fetchAll().subscribe(
      value => {

        //List of all of the posts in the app
        this._posts = value
        this._followService.getFollowers(this._authService.connectedUser.id).subscribe(
          follows => {

          //List of all the id of the follows of the current user
          follows && follows.map(follow => this._follows.push(follow.idFollowed))

          //Filter the posts of the app with the follows id
          this._posts = this._posts.filter(post => this._follows.includes(post.idAuthor) || post.idAuthor == this._authService.connectedUser.id).reverse();
        });
      }
    );
    this._eventsSubscription = this._reloadFeedService.getEventSubsciption().subscribe(() => this._reloadFeed());
  }

  /**
   * At destruction, destroy the subscription
   */
  ngOnDestroy(): void {
    if(!this._eventsSubscription.closed)
      this._eventsSubscription.unsubscribe();
  }

}
