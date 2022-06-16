import { CommonService } from 'app/main/apps/user/common.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ClassesListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public classRows: any;
  
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _commonServie: CommonService) {
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
      var school = this._commonServie.getCurrentUser();
      this._httpClient.get(`${environment.apiUrl}/api/user/allClasses/`+school.userId).subscribe((response: any) => {
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
      var school = this._commonServie.getCurrentUser();
      this._httpClient.post(`${environment.apiUrl}/api/user/createClass`, {
        'className': form['user-fullname'],
        'schoolId': school.userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  setUserClass(classId, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user`, {
        'classId': classId,
        'userId' : userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }
 
}
