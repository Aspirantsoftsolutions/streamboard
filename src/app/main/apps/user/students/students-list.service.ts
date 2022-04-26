import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StudentsListService implements Resolve<any> {
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
      Promise.all([this.getAllStudents()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getAllStudents(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/user/allStudents').subscribe((response: any) => {
        this.rows = response;
        console.log(this.rows.data);
        this.rows.data.map(row => {
          row.checked = false;
        });
        this.onUserListChanged.next(this.rows.data);
        resolve(this.rows.data);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  setStudent(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/auth/registerStudent', {
        'username': form['user-firstName'] + form['user-lastName'],
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'email': form['user-email'],
        'password': 'Test@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'classId': form['class'],
        'grade': form['grade']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
