import { Injectable } from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private _URL = window.URL;

  /**
   * Constructor of VideoService
   */
  constructor(private _sanitizer: DomSanitizer) { }

  /**
   * Creates a blob from a file
   * @param file file
   */
  public makeBlob(file: string): string {
    return this._URL.createObjectURL(file);
  }

  /**
   * Creates a video from a blob and return its value
   * @param blob the blob
   */
  public sanitize(blob: string): SafeUrl {
    return this._sanitizer.bypassSecurityTrustUrl(blob);
  }

}
