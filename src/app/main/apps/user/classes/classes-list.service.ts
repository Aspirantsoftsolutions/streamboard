import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ClassesListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;

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
      this._httpClient.get('api/user/all/Class').subscribe((response: any) => {
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
        'username': form['user-name'],
        'email': form['user-email'],
        'password': 'Welcome@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'role': "Class",
        'plan': "Free",
        'status': 'pending'
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }
  register(form, role): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/auth/register', {
        'username': form['username'],
        'email': form['email'],
        'password': form['password'],
        'mobile': form['mobilenumber'],
        'countryCode': '+91',
        'role': "Class",
        'plan': "Free",
        'status': 'pending',
        'location': form['location'],
        'organisation': form['organisation']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }
}
