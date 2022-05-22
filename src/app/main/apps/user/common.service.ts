import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CommonService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public onUserEditListChanged: BehaviorSubject<any>;
 
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
    this.onUserEditListChanged = new BehaviorSubject({});
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
      this._httpClient.get(`${environment.apiUrl}/api/user/all`).subscribe((response: any) => {
        this.rows = response;
        console.log(this.rows.data);
        this.onUserListChanged.next(this.rows.data);
        this.onUserEditListChanged.next(this.rows);

        resolve(this.rows.data);
      }, reject);
    });
  }

  sendInvitationEmail(emailId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/invite`, {
        'emailId': emailId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  getClasses(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/Class`).subscribe((response: any) => {
        console.log(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getGrades(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/Grade`).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getGroups(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/Group`).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getSchools(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/School`).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }


  getAllStudents(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/allStudents`).subscribe((response: any) => {
        console.log(response.data);
        response.data.map(row => {
          row.checked = false;
        });
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getSubjects(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/Subject`).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getAllTeachers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/allTeachers`).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  /**
  * Get rows
  */
  setUser(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/register`, {
        'organisation': form['user-name'],
        'username': form['user-name'],
        'email': form['user-email'],
        'itemail': form['user-it-email'],
        'fullName': form['user-fullname'],
        'firstName': form['user-firstname'],
        'lastName': form['user-lastname'],
        'address': form['user-address'],
        'password': 'Test@123',
        'mobile': form['user-number'],
        'countryCode': '+91',
        'role': 'Individual',
        'plan': 'Free',
        'status': 'active'
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  register(form,role): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/auth/register`, {
        'username': form['username'],
        'email': form['email'],
        'password': form['password'],
        'mobile': form['mobilenumber'],
        'countryCode': '+91',
        'role': role,
        'plan': "Free",
        'status': 'active',
        'location': form['location'],
        'organisation':form['organisation']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  sendNotifications(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/notificaitons/add`, {
        'title': form['title'],
        'body': form['body'],
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  deleteUser(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/user/${id}`, {
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

  deleteStudent(id): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.apiUrl}/api/user/Student/${id}`, {
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  updateUserPassword(form, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updatePassword`, {
        'password': form['newPassword'],
        'userId': userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  // deleteClass(id): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.delete(`${environment.apiUrl}/api/user/${id}`, {
  //     }).subscribe((response: any) => {
  //       console.log(response);
  //       resolve(response);
  //     }, reject);
  //   });
  // }

}
