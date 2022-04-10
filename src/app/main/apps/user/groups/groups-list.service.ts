import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GroupsListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public classRows: any;
  
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
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
      this._httpClient.get('api/user/all/Group').subscribe((response: any) => {
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
  setUser(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/auth/register', {
        'username': form['user-fullname'],
        'email': form['user-email'],
        'password': 'Test@123',
        'mobile': '123456789',
        'countryCode': '+91',
        'role': "Group",
        'plan': "Free",
        'status': 'active',
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  setUserClass(classId, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put('api/user', {
        'classId': classId,
        'userId' : userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }
 
}
