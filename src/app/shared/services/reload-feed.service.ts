import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReloadFeedService {

  private _reloadFeedEventSubject: Subject<void> = new Subject<void>();
  private _reloadNotifEventSubject: Subject<void> = new Subject<void>();

  /**
   * Constructor of ReloadFeedService
   */
  constructor() { }

  /**
   * Trigger event to all subscribed components
   */
  public emitReloadFeedEvent(): void{
    this._reloadFeedEventSubject.next();
  }

  public emitReloadNotifEvent(): void{
    this._reloadNotifEventSubject.next();
  }

  /**
   * Return an observable
   */
  public getEventSubsciption(): Observable<void> {
    return this._reloadFeedEventSubject.asObservable();
  }

  public getEventLoadNotif(): Observable<void>{
    return this._reloadNotifEventSubject.asObservable();
  }
}
