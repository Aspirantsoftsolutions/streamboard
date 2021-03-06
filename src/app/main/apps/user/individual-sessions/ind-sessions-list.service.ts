import { AuthenticationService } from './../../../../auth/service/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class IndSessionsListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _authenticationService: AuthenticationService) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
    console.log('current user here:', this._authenticationService.currentUser);

  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/session/all`).subscribe((response: any) => {
        this.rows = response;
        console.log(this.rows.data);
        this.onUserListChanged.next(this.rows.data);
        resolve(this.rows.data);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  createSession(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/session/createSession`, {
        'title': form['user-title'],
        'groupId': "asfds",
        'description': form['user-description'],
        'teacherId': "asdfod",
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
