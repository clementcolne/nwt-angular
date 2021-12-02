import { Component, OnInit } from '@angular/core';
import {Post} from "../shared/types/post.type";
import {ActivatedRoute, Router} from "@angular/router";
import {PostService} from "../shared/services/post.service";

@Component({
  selector: 'app-page-post',
  templateUrl: './page-post.component.html',
  styleUrls: ['./page-post.component.css']
})
export class PagePostComponent implements OnInit {

  private _post : Post;

  /**
   * Constructor of Page Post Component
   * @param _route Activated route
   * @param _postService Post service to get information of the post to show
   * @param _router Route
   */
  constructor(private _route : ActivatedRoute, private _postService : PostService, private _router : Router) {
    this._post = {} as Post;
  }

  /**
   * Returns the post to show on the page
   */
  get post(): Post {
    return this._post;
  }

  /**
   * Init the post by fetching it in the database with the given id
   */
  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this._postService.fetchById(params['id']).subscribe(
          post => this._post = post,
          err => this._router.navigate(["**"])
        )
    });
  }

}
