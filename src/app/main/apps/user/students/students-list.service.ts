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
  public onStudentListChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
    this.onStudentListChanged = new BehaviorSubject({});
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
      var school = (this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId);
      this._httpClient.get(`${environment.apiUrl}/api/user/allStudents/` + school).subscribe((response: any) => {
        this.rows = response;
        console.log(this.rows.data);
        this.rows.data.map(row => {
          row.checked = false;
        });
        this.onUserListChanged.next(this.rows.data);
        this.onStudentListChanged.next(this.rows.data);
        resolve(this.rows.data);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  setStudent(form, schoolId): Promise<any[]> {
    let currentUser = this.getCurrentUser();
    let obj = {
      'username': form['user-firstName'] + form['user-lastName'],
      'firstName': form['user-firstName'],
      'lastName': form['user-lastName'],
      'email': form['user-email'],
      'password': 'Test@123',
      'mobile': form['user-number'],
      'countryCode': '+91',
      'classes': form['class'],
      'grades': form['grade'],
      'schoolId': currentUser.userId,
      'teachers': form['username']
    };

    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/registerStudent`, obj).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }


  updateStudentProfile(form, userid, classId): Promise<any[]> {
    let currentUser = this.getCurrentUser();
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateStudentProfileData`, {
        'classes': form['class'],
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'mobile': form['user-number'],
        'grades': form['grade'],
        'teachers': form['username'],
        'schoolId': currentUser.userId,
        'userId': userid
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

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }


  deleteStudent(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/user/Student/${id}`, {
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }


  // getAllStudents(): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.get(`${environment.apiUrl}/api/user/allStudents/` + this.getCurrentUser().userId).subscribe((response: any) => {
  //       response.data.map(row => {
  //         row.checked = false;
  //       });
  //       this.onUserListChanged.next(response.data);
  //       resolve(response.data);
  //     }, reject);
  //   });
  // }


  updateStudentStatus(isactive, userId): Promise<any[]> {
    let val = "";
    if (isactive == true) {
      val = "active";
    } else {
      val = "inactive";
    }

    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/studentActive`, {
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
