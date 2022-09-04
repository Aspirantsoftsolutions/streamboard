import { CommonService } from 'app/main/apps/user/common.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class StudentsListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _commonService: CommonService) {
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
      var school = this._commonService.getCurrentUser();
      this._httpClient.get(`${environment.apiUrl}/api/user/allStudents/` + school.userId).subscribe((response: any) => {
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
  setStudent(form, schoolId): Promise<any[]> {
    let currentUser = this._commonService.getCurrentUser();
    console.log(currentUser);
    let obj;
    if (currentUser.role == 'Teacher') {
      obj = {
        'username': form['user-firstName'] + form['user-lastName'],
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'email': form['user-email'],
        'password': 'Test@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'classId': form['class'],
        'grade': form['grade'],
        'teacherId': currentUser.userId,
        'schoolId': currentUser.school[0].userId,
        'teachers': form['username']
      };
    } else {
      obj = {
        'username': form['user-firstName'] + form['user-lastName'],
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'email': form['user-email'],
        'password': 'Test@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'classId': form['class'],
        'grade': form['grade'],
        'schoolId': currentUser.userId,
        'teachers': form['username']
      };
    }

    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/registerStudent`, obj).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
