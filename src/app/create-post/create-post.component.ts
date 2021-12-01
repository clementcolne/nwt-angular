import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../shared/services/post.service";
import {Post} from "../shared/types/post.type";
import {Router} from "@angular/router";
import {DialogService} from "../shared/services/dialog.service";
import {VideoService} from "../shared/services/video.service";
import {ReloadFeedService} from "../shared/services/reload-feed.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  private readonly _form: FormGroup;
  private _imgUrl: string;
  private _newPost: Post;
  private _errorFileType: boolean;
  private _videoUrl : any;
  private _videoBlob: string;
  private _mediaType: string;
  private _file: File;
  private _eventsSubscription: Subscription;
  // warning : use carfully according to documentation, here only to clear image input
  @ViewChild('image') private _imageInput: ElementRef<HTMLInputElement>;

  /**
   * Constructor of CreatePostComponent
   */
  constructor(private _postService: PostService, private _router: Router, private _dialogService: DialogService,
              private _videoService: VideoService, private _reloadService : ReloadFeedService) {
    this._form = this._buildForm();
    this._imgUrl = "";
    this._newPost = {} as Post;
    this._imageInput = {} as ElementRef<HTMLInputElement>;
    this._errorFileType = false;
    this._mediaType = "";
    this._videoBlob = "";
    this._file = {} as File;
    this._eventsSubscription = {} as Subscription;
  }

  /**
   * Return true if an url already exist, false if the url is empty string
   */
  public get isFilled(): boolean {
    return this._imgUrl !== "" || this._videoUrl;
  }

  /**
   * When the user uploads image, it loads its url
   * @param event $event
   */
  public onChangeFile(event: any): void {
    if (event.target.files) {
      if(event.target.files[0].type === "image/jpeg") {
        this._file = <File>event.target.files[0];
        // we set the media type on image
        this._mediaType = "image";
        // we reset the value of the video
        this._videoUrl = undefined;
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this._imgUrl = event.target.result;
        }
      }else {
        this._file = <File>event.target.files[0];
        // we set the media type on video
        this._mediaType = "video";
        // we reset the value of the image
        this._imgUrl = "";
        // we set the blob of the video
        this._videoBlob = this._videoService.makeBlob(event.target.files[0]);
        // we set the preview of the video
        this._videoUrl = this._videoService.sanitize(this._videoBlob);
      }
    }
  }

  /**
   * Return the readable video content
   */
  public get videoUrl(): any {
    return this._videoUrl;
  }

  /**
   * Return the url of the image
   */
  public get imgUrl(): string {
    return this._imgUrl;
  }

  /**
   * Returns the value of _form
   */
  public get form(): FormGroup {
    return this._form;
  }

  /**
   * Resets the form
   */
  public cancel(): void {
    this._form.get("description")?.reset();
    this._form.get("location")?.reset();
    this._imgUrl = "";
    this._videoUrl = undefined;
    this._imageInput.nativeElement.value = '';
  }

  /**
   * Create a post and close the dialog
   * @param value informations about the post
   */
  public sumbit(value: any): void {
    this._postService.addImage(this._file).subscribe((response) => {
      },
      (response) => {
        this._postService.addPost(response.error.text, value.description, value.location, this._mediaType).subscribe(
          _ => this._reloadService.emitReloadFeedEvent()
        );
      });
    this._dialogService.closeDialogService();
  }

  /**
   * Builds the FormGroup and returns its value
   */
  private _buildForm(): FormGroup {
    return new FormGroup({
        description: new FormControl('', Validators.compose([
          Validators.maxLength(512),
        ])),
        location: new FormControl('', Validators.compose([
          Validators.maxLength(128),
        ]))
      },
    );
  }

  ngOnInit(): void {
  }

}
