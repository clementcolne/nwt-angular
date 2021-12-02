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
   * Trigger reload posts event to all subscribed components
   */
  public emitReloadFeedEvent(): void{
    this._reloadFeedEventSubject.next();
  }

  /**
   * Trigger reload notifications event to all subscribed components
   */
  public emitReloadNotifEvent(): void{
    this._reloadNotifEventSubject.next();
  }

  /**
   * Return an observable of the reload feed event
   */
  public getEventSubsciption(): Observable<void> {
    return this._reloadFeedEventSubject.asObservable();
  }

  /**
   * Return an observable of the reload notifications event
   */
  public getEventLoadNotif(): Observable<void>{
    return this._reloadNotifEventSubject.asObservable();
  }
}
