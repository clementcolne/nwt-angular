import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {Post} from "../types/post.type";
import {PostService} from "../services/post.service";
import {Comment} from "../types/comment.type";
import {CommentsService} from "../services/comments.service";
import {User} from "../types/user.type";
import {UserService} from "../services/user.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {VideoService} from "../services/video.service";
import {AuthService} from "../services/auth.service";
import {NotificationsService} from "../services/notifications.service";
import {ReloadFeedService} from "../services/reload-feed.service";

@Component({
  selector: 'app-card',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  // color of like button
  private _likeColor: ThemePalette;
  private _isLiked: boolean;
  // new comment from connected user
  private _newComment: string;
  // informations about the post
  private _post: Post;
  // list of all comments of the post
  private _comments: Comment[];
  // true if comments are loaded, otherwise false
  private _isCommentsLoaded: boolean;
  // author of the post
  private _author: User;

  /**
   * Constructor of post component
   * @param _postService Post service to get this post's information
   * @param _commentsService Comment service to get this post's comment
   * @param _userService User service to get author's information
   * @param _videoService Video service to handle videos display
   * @param _authService Authentication service to get connected user's information
   * @param _notificationService Notification service to send comment and like notifications
   * @param _reloadService Reload service to trigger notification relaod
   */
  constructor(private _postService: PostService, private _commentsService: CommentsService,
              private _userService: UserService, private _videoService: VideoService,
              private _authService: AuthService, private _notificationService: NotificationsService, private _reloadService : ReloadFeedService) {
    this._likeColor = "" as ThemePalette;
    this._newComment = "";
    this._post = {} as Post;
    this._comments = [] as Comment[];
    this._isCommentsLoaded = false;
    this._author = {} as User;
    this._isLiked = false;
  }

  /**
   * Swaps the value od _isLiked and sets the color of the icon
   */
  public clickLike(): void {
    if(this._isLiked) {
      this._postService.removeLike(this._post.id, this._post.likes)
    }else{
      this._postService.addLike(this._post.id, this._post.likes)
      // sends a notification to the owner of the post
      this._notificationService.sendNotification(this._post.idAuthor, String(this._post.id), "like")
    }
    this._isLiked = !this._isLiked;
    // sets the color of the button, red if liked, black if not
    this._likeColor = (this._isLiked ? "warn" : "") as ThemePalette;
    // sets the counter of likes, +1 if liked, -1 if unliked
    this.post.likes += (this._isLiked ? 1 : -1);
  }

  /**
   * Returns the video
   */
  public get videoUrl(): SafeUrl {
    return this._videoService.sanitize(this._post.media);
  }

  /**
   * Sets the post object
   * @param post post object
   */
  @Input()
  public set post(post: Post) {
    this._post = post;
    this._setAuthor();
  }

  /**
   * Sets the User author of the post
   */
  private _setAuthor(): void {
    this._userService.getUserById(this._post.idAuthor).subscribe(value => this._author = value);
  }

  /**
   * Delete the post and reload the feed
   */
  public deletePost(): void {
    this._postService.delete(this._post.id).subscribe(
      _ => this._reloadService.emitReloadFeedEvent()
    );
  }

  /**
   * Returns the author of the post
   */
  public get author(): User {
    return this._author;
  }

  /**
   * Share the post on twitter
   */
  public get shareOnTwitter(): string {
    return "http://twitter.com/share?text=Just found an amazing post on Amstramgram&url=http://localhost:3000/post/" +
    this._post.id;
  }

  /**
   * Return the connected user
   */
  public get connectedUser(): User {
    return this._authService.connectedUser;
  }

  /**
   * Return true if comment is loaded, otherwise false
   */
  public get isCommentsLoaded(): boolean {
    return this._isCommentsLoaded;
  }

  /**
   * Returns the sentence to display on the comment section before lazy loading
   */
  public get commentsLoadInfo(): string {
    let commentsInfo = "Charger 1 commentaire";
    if(this._post.nbComments > 1) {
      commentsInfo = "Charger " + this._post.nbComments + " commentaires";
    }
    return commentsInfo;
  }

  /**
   * Returns the value of _post
   */
  public get post(): Post {
    return this._post;
  }

  /**
   * Returns the path of the media to show
   */
  public get getMedia(): string {
    return "http://localhost:3000/public/" + this._post.media;
  }

  /**
   * Returns the path of a user's profile picture
   * @param user
   */
  getProfilePicture(user: User): string {
    if(user.profilePicture)
      return this._userService.getProfilePicture(user);
    return "http://localhost:3000/public/default/default.png"
  }

  /**
   * Returns the list of the comments
   */
  public get comments(): Comment[] {
    return this._comments
  }

  /**
   * Returns the list of the comments. Used to Lazy load the comments
   */
  public lazyLoadComments(): void {
    // fetch all existing comments of the post
    this._commentsService.getComments(this._post.id).subscribe(value => {
      this._comments = value
      this._isCommentsLoaded = true
    })
  }

  /**
   * Sets the value of the new comment
   * @param comment comment
   */
  public set newComment(comment: string) {
    this._newComment = comment;
  }

  /**
   * Returns the value of the new comment
   */
  public get newComment(): string {
    return this._newComment;
  }

  /**
   * Adds the comment when enter key is pressed if the comment is not empty
   * After comment is added, we lazy load the other comments
   */
  public addComment(): void {
    // the code is reached only of the user push a not empty comment
    if(this._newComment !== "") {
      // add the comment
      this._commentsService.addComment(this._post.id, this._newComment, this._comments.length);
      // sends a notification to the owner of the post
      this._notificationService.sendNotification(this._post.idAuthor, String(this._post.id), "comment")
      // fetch all comments of the post
      this._commentsService.getComments(this._post.id).subscribe(value => this._comments = value)
      // comments are loaded
      this._isCommentsLoaded = true;
      // gets the new number of comments
      this._postService.getNbComments(this._post.id).subscribe(value => this._post.nbComments = value.nbComments);
      // empty the comment input
      this._newComment = "";
    }
  }

  /**
   * Returns the value of _likeColor
   */
  public get likeColor(): ThemePalette {
    return this._likeColor;
  }

  /**
   * Initialize the color of the like button
   */
  ngOnInit(): void {
    this._authService.getLikedPosts().subscribe(value => {
      if(value) {
        let tmp = value.find(like =>
          (like.idLiked === this._post.id)
        );
        // apply color on the button
        this._likeColor = "" as ThemePalette
        this._isLiked = false;
        if (tmp) {
          this._likeColor = "warn" as ThemePalette
          this._isLiked = true;
        }
      }
    });
  }
}
