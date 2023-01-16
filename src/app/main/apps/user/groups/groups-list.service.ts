import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

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
      this._httpClient.get(`${environment.apiUrl}/api/groups/${(this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId)}`).subscribe((response: any) => {
        this.rows = response;
        console.log(this.rows.data);
        this.onUserListChanged.next(this.rows.data);
        resolve(this.rows.data);
      }, reject);
    });
  }



  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
  * Get rows
  */
  createGroup(form, selectedUsers, grade): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/groups/create`, {
        'name': form.name,
        'school_id': (this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId),
        'id': form.id,
        'students': selectedUsers,
        'grades': grade
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
        this.getDataTableRows().then(() => { });
      }, reject);
    });
  }

  getGroupById(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/groups/group/${id}`).subscribe((response: any) => {
        console.log(response);
        resolve(response);
        this.getDataTableRows().then(() => { });
      }, reject);
    });
  }

  // updateGroup(form): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.post(`${environment.apiUrl}/api/groups/create`, {
  //       'name': form.name,
  //       'school_id': this.getCurrentUser().userId
  //     }).subscribe((response: any) => {
  //       console.log(response);
  //       resolve(response);
  //     }, reject);
  //   });
  // }

  setUserClass(classId, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}api/user`, {
        'classId': classId,
        'userId': userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  deleteGroup(id) {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/groups/group/${id}`).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
