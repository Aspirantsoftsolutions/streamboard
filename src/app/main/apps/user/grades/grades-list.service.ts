import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GradesListService implements Resolve<any> {
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
      this._httpClient.get(`${environment.apiUrl}/api/grades/${this.getCurrentUser().userId}`).subscribe((response: any) => {
        this.rows = response.data;
        this.onUserListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  setUser(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/register`, {
        'username': form['user-fullname'],
        'email': form['user-fullname'] + "@gmail.om",
        'password': 'Test@123',
        'mobile': '123456789',
        'countryCode': '+91',
        'role': "Grade",
        'plan': "Basic",
        'status': 'active',
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }





  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
  * Get rows
  */
  createGrade(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/grades/create`, {
        'name': form.name,
        'school_id': this.getCurrentUser().userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
        this.getDataTableRows().then(() => { });
      }, reject);
    });
  }

  getGradeById(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/grades/grade/${id}`).subscribe((response: any) => {
        console.log(response);
        resolve(response);
        this.getDataTableRows().then(() => { });
      }, reject);
    });
  }

  setUserClass(classId, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user`, {
        'classId': classId,
        'userId': userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
