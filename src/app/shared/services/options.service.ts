import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private _httpOptions : any;

  /**
   * Constructor of Options service
   * @param _cookies Cookie service to update cookies' content
   */
  constructor(private _cookies : CookieService) {
    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ''
      })
    };
  }

  /**
   * Function to return request options
   */
  get httpOptions() : any {
    let token = this._cookies.get('Authorization');
    this._httpOptions.headers = this._httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this._httpOptions;
  }
}
