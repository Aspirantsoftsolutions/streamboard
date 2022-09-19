import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GradesListService implements Resolve<any> {
  public rows: any;
  public onGradeListChanged: BehaviorSubject<any>;
  public list: BehaviorSubject<any>;
  public classRows: any;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onGradeListChanged = new BehaviorSubject({});
    this.list = new BehaviorSubject({});
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
      resolve();
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/grades/${this.getCurrentUser().userId}`).subscribe((response: any) => {
        this.rows = response.data;
        resolve(this.rows);
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
        this.getDataTableRows().then(() => { });
        resolve(response);
      }, reject);
    });
  }

  updateGrade(form, id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/grades/${id}`, {
        'name': form.name,
      }).subscribe((response: any) => {
        this.list.next(null);
        resolve(response);
      }, reject);
    });
  }

  deleteGrade(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/grades/${id}`).subscribe((response: any) => {
        console.log(response);
        this.list.next(null);
        resolve(response);
      }, reject);
    });
  }

  getGradeById(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/grades/grade/${id}`).subscribe((response: any) => {
        console.log(response);
        resolve(response);
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
