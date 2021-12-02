import { Injectable } from '@angular/core';
import {Post} from "../types/post.type";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {OptionsService} from "./options.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  /**
   * Constructor of Post service
   * @param _authService Authentication service to get connected user information
   * @param _optionsService Options service to get http header
   * @param _http Http client to send http requests
   */
  constructor(private _authService : AuthService, private _optionsService : OptionsService, private _http: HttpClient) {
  }

  /**
   * Add a like for a given post and increments the number of likes of the post
   * @param idPost id of the post
   * @param likes number of likes on the post
   */
  public addLike(idPost: number, likes: number): any {
    let payload = {
      "idLiker": String(this._authService.connectedUser.id),
      "idLiked": String(idPost),
    };
    this._http.post<any>("http://localhost:3000/likes", JSON.stringify(payload), this._optionsService.httpOptions).subscribe();

    // increment number of likes
    let payloadLike = {
      "likes": likes + 1,
    };
    this._http.patch<any>("http://localhost:3000/posts/" + idPost, JSON.stringify(payloadLike), this._optionsService.httpOptions).subscribe();
  }

  /**
   * Delete a post
   * @param id id of the post
   */
  public delete(id: number): Observable<any> {
    return this._http.delete<any>("http://localhost:3000/posts/" + id, this._optionsService.httpOptions);
  }

  /**
   * Remove a like for a given post
   * @param idPost id of the post
   * @param likes number of likes on the post
   */
  public removeLike(idPost: number, likes: number): any {
    let payload = {
      "idLiker": String(this._authService.connectedUser.id),
      "idLiked": String(idPost),
    };
    this._http.delete<any>("http://localhost:3000/likes", { headers: this._optionsService.httpOptions.headers, body: JSON.stringify(payload) }).subscribe();

    // decrement number of likes
    let payloadLike = {
      "likes": likes - 1,
    };
    this._http.patch<any>("http://localhost:3000/posts/" + idPost, JSON.stringify(payloadLike), this._optionsService.httpOptions).subscribe();
  }

  /**
   * Returns all posts
   */
  public fetchAll(): Observable<Post[]> {
    return this._http.get<Post[]>("http://localhost:3000/posts", <Object>this._optionsService.httpOptions);
  }

  /**
   * Returns all posts for a given user
   * @param idAuthor id of the user
   */
  public fetchAllByUser(idAuthor: number): Observable<Post[]> {
    return this._http.get<Post[]>("http://localhost:3000/posts/user/" + idAuthor, <Object>this._optionsService.httpOptions);
  }

  /**
   * Returns the post with the specific id in param
   * @param idPost id of the post
   */
  public fetchById(idPost : number): Observable<Post>{
    return this._http.get<Post>("http://localhost:3000/posts/" + idPost, <Object>this._optionsService.httpOptions);
  }

  /**
   * Adds a post to the list of posts
   * @param media media of the post
   * @param description description of the post
   * @param location location of the post
   * @param mediaType type of media (image or video)
   */
  public addPost(media: string, description: string, location: string, mediaType: string): Observable<any> {
    let payload = {
      "idAuthor": this._authService.connectedUser.id,
      "media": media,
      "mediaType": mediaType,
      "description": description,
      "location": location
    } as Post;
    return this._http.post<Post>("http://localhost:3000/posts", JSON.stringify(payload), <Object>this._optionsService.httpOptions);
  }

  /**
   * Add image to database and return an observable of its filename
   * @param file File to upload
   */
  public addImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post<string>("http://localhost:3000/uploads/media", formData);
  }

  /**
   * Returns the number of comments for a given post
   * @param postId id of the post
   */
  public getNbComments(postId: number): Observable<Post> {
    return this._http.get<Post>("http://localhost:3000/posts/" + postId, <Object>this._optionsService.httpOptions);
  }

}
