import { CommonService } from 'app/main/apps/user/common.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserListService implements Resolve<any> {
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
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    let currentUser = this._commonService.getCurrentUser();
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/${currentUser.userId}`).subscribe((response: any) => {
        this.rows = response;
        let data = [];
        this.rows.data.forEach(element => {
          if (element != null && currentUser != null) {
            if ((element.role != 'Grade') && (element.role != 'Group') && (element.role != 'Admin') && (element.email != currentUser.email) && (element.role != 'Individual')) {
              data.push(element);
            }
          }
        });
        console.log(data);
        if (currentUser != null) {
          this.rows.data.forEach(element => {
            element.teacher.forEach(teachers => {
              data.push(teachers);
            });
            element.student.forEach(students => {
              data.push(students);
            });
          });
        }

        console.log(this.rows);
        console.log(data);
        this.onUserListChanged.next(data);
        resolve(data);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  setUser(form): Promise<any[]> {
    let currentUser = this._commonService.getCurrentUser();
    let url = `${environment.apiUrl}/api/auth/register`;
    if (form['role'] == 'Student') {
      url = `${environment.apiUrl}/api/auth/registerStudent`
    } else if (form['role'] == 'Teacher') {
      url = `${environment.apiUrl}/api/auth/registerTeacher`
    }
    return new Promise((resolve, reject) => {
      this._httpClient.post(url, {
        'username': form['user-name'],
        'email': form['user-email'],
        'password': 'Test@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'role': form['role'],
        'plan': form['plan'],
        'status': 'active',
        'schoolId': currentUser.userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  register(form, role): Promise<any[]> {
    console.log(form);
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/register`, {
        'username': form['username'],
        'email': form['email'],
        'password': form['password'],
        'mobile': form['mobilenumber'],
        'countryCode': '+91',
        'role': role,
        'plan': "Basic",
        'status': 'pending',
        'location': form['location'],
        'organisation': form['username']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  registerSchool(form, role): Promise<any[]> {
    console.log(form);
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/register`, {
        'username': form['username'],
        'email': form['email'],
        'firstName': form['firstname'],
        'lastName': form['lastname'],
        'password': 'Test@123',
        'mobile': form['mobilenumber'],
        'countryCode': '+91',
        'role': role,
        'plan': "Basic",
        'status': 'active',
        'address': form['location'],
        'itemail': form['itemail'],
        'organisation': form['username']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  registerClient(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/register`, {
        'organisation': form['username'],
        'username': form['username'],
        'email': form['email'],
        'itemail': form['itemail'],
        'fullName': form['fullname'],
        'firstName': form['firstname'],
        'lastName': form['lastname'],
        'password': 'Test@123',
        'address': form['location'],
        'mobile': form['mobilenumber'],
        'countryCode': '+91',
        'role': form['role'],
        'plan': form['plan'],
        'status': 'active'
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }



}
