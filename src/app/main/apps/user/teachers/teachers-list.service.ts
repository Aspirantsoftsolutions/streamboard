import { CommonService } from 'app/main/apps/user/common.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TeachersListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public onTeacherListChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
    this.onTeacherListChanged = new BehaviorSubject({});
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
      Promise.all([this.getAllTeachers()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getAllTeachers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      var userId = (this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId);
      this._httpClient.get(`${environment.apiUrl}/api/user/allTeachers/` + userId).subscribe((response: any) => {
        this.rows = response;
        console.log(this.rows.data);
        this.onUserListChanged.next(this.rows.data);
        resolve(this.rows.data);
      }, reject);
    });
  }


  updateProfile(form, userid): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateProfileData`, {
        'organisation': form['user-name'],
        'fullName': form['user-fullname'],
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'address': form['user-address'],
        'mobile': form['user-number'],
        'userId': userid,
        'classes': form['className']
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  setTeacher(form, schoolid): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/registerTeacher`, {
        'username': form['user-firstName'] + form['user-lastName'],
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'email': form['user-email'],
        'password': 'Test@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'classId': form['class'],
        'schoolId': schoolid,
        'classes': form['className']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  deleteTeacher(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/user/Teacher/${id}`, {
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }


  updateTeacherStatus(isactive, userId): Promise<any[]> {
    let val = "";
    if (isactive == true) {
      val = "active";
    } else {
      val = "inactive";
    }

    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/teacherActive`, {
        'isActive': isactive,
        'userId': userId,
        "status": val
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

}
