import { Injectable } from '@angular/core';
import {Comment} from "../types/comment.type";
import {PostService} from "./post.service";
import {AuthService} from "./auth.service";
import {OptionsService} from "./options.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  /**
   * Constructor of comments service
   * @param _postService Post service to get post information
   * @param _authService Authentication service to get connected user information
   * @param _http Http client to send http requests
   * @param _optionsService Options service to get http header
   */
  constructor(private _postService: PostService, private _authService : AuthService,
              private _optionsService: OptionsService, private _http: HttpClient) {
  }

  /**
   * Returns the list of all comments for a given post
   * @param idPost is of the parent post
   */
  public fetchAll(idPost: number): Observable<Comment[]> {
    return this._http.get<Comment[]>("http://localhost:3000/comments/post/" + idPost,
      <Object>this._optionsService.httpOptions);
  }

  /**
   * Adds new comment to the list of comments
   * @param idPost id of the post
   * @param comment content of the comment
   * @param nbComments number of comments
   */
  public addComment(idPost: number, comment: string, nbComments: number): void {
    // comment to add
    let newComment = {
      idPost: idPost,
      idAuthor: this._authService.connectedUser.id,
      content: comment
    } as Comment;
    // add comment in database
    this._http.post<Comment>("http://localhost:3000/comments", JSON.stringify(newComment),
      <Object>this._optionsService.httpOptions).subscribe(value => newComment = value);
    // increment the number of comments
    let payload = {
      nbComments: nbComments + 1
    }
    this._http.patch<Comment>("http://localhost:3000/posts/" + idPost, JSON.stringify(payload),
      <Object>this._optionsService.httpOptions).subscribe();
  }

  /**
   * Return all comments for a given post
   * @param idPost id of the post
   */
  public getComments(idPost: number): Observable<Comment[]> {
    return this._http.get<Comment[]>("http://localhost:3000/comments/post/" + idPost,
      <Object>this._optionsService.httpOptions);
  }

}
