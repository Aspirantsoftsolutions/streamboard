import { AuthenticationService } from './../../../../auth/service/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class SessionsListService implements Resolve<any> {
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

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
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
    const currUser = this.getCurrentUser();
    const URL = currUser.role === 'Student' ? `${environment.apiUrl}/api/session/students/${currUser._id}` : `${environment.apiUrl}/api/session/${currUser.userId}`
    return new Promise((resolve, reject) => {
      this._httpClient.get(URL).subscribe((response: any) => {
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
        'groupId': form['group'],
        'description': form['user-description'],
        'teacherId': form['host'] ? form['host'] : form['teacherId'],
        'type': form['type'],
        'start': form['start'],
        'end': form['end'],
        'participants': form['user-emailids'] ? form['user-emailids'].map(x => x.email).join(',') : "",
        'scheduledBy': form['host'] ? 'school' : 'teacher',
        'school_id': this.getCurrentUser().userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
