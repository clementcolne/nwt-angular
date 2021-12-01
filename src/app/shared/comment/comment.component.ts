import {Component, Input, OnInit} from '@angular/core';
import {Comment} from "../types/comment.type";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  private _comment: Comment;
  private _authorName: string;

  /**
   * Constructor of CommentComponent
   * @param _userService UserService
   */
  constructor(private _userService: UserService) {
    this._comment = {} as Comment;
    this._authorName = '';
  }

  /**
   * Set the comment object
   * @param comment comment object
   */
  @Input()
  public set comment(comment: Comment) {
    this._comment = comment;
  }

  /**
   * Return the comment
   */
  public get comment(): Comment {
    return this._comment;
  }

  /**
   * Return the name of the author
   */
  public get authorName(): string {
    return this._authorName;
  }

  /**
   * Initialize the value of _authorName
   */
  ngOnInit(): void {
    this._userService.getUserById(this._comment.idAuthor).subscribe(value => this._authorName = value.username);
  }

}
