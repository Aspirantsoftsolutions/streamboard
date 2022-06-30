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
  public onTeacherEditListChanged = null;

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
        let user = [];
        this.rows.data.forEach(element => {
          if (element.role == 'School' || element.role == 'Individual') {
            user.push(element);
          }
        });
        this.onUserListChanged.next(user);
        this.onUserEditListChanged.next(user);

        resolve(user);
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
      this._httpClient.get(`${environment.apiUrl}/api/user/allClasses/` + this.getCurrentUser().userId).subscribe((response: any) => {
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
      this._httpClient.get(`${environment.apiUrl}/api/user/allStudents/` + this.getCurrentUser().userId).subscribe((response: any) => {
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
      this._httpClient.get(`${environment.apiUrl}/api/user/allTeachers/`+this.getCurrentUser().userId).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

   getAllUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/`).subscribe((response: any) => {
        console.log(response.data);
        resolve(response.data);
      }, reject);
    });
   }
  
  getCount(userid): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/getCounts/`+userid,).subscribe((response: any) => {
        console.log(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  updateUserStatus(isactive, userId): Promise<any[]> {
    let val = "";
    if (isactive == true) {
      val = "active";
    } else {
      val = "inactive";
    }

    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/userActive`, {
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

  updateSchoolSubscription(plan, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updatePlanType`, {
        'plan': plan,
        'userId': userId
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


  updateProfile(form,userid): Promise<any[]> { 
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateProfileData`, {
        'organisation': form['user-name'],
        'fullName': form['user-fullname'],
        'firstName': form['user-firstname'],
        'lastName': form['user-lastname'],
        'address': form['user-address'],
        'mobile': form['user-number'],
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

  updateStudentProfile(form, userid, classId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateStudentProfileData`, {
        'classId': classId,
        'firstName': form['user-firstName'],
        'lastName': form['user-lastName'],
        'mobile': form['user-number'],
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

  updateGroup(form, userid): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateProfileData`, {
        'username': form['user-name'],
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
        'role': 'School',
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
        'plan': "Basic",
        'status': 'active',
        'location': form['location'],
        'organisation':form['organisation']
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  addCalendarEvent(form): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/user/addEvent`, {
        'title': form['title'],
        'label': form['label'],
        'startDate': form['startDate'],
        'endDate': form['endDate'],
        'eventUrl': form['eventUrl'],
        'guests': form['guests'],
        'description': form['description'],
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  getCalendar(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/getCalendar`).subscribe((response: any) => {
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

  getNotifications(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/notificaitons/all`).subscribe((response: any) => {
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

  updateFeatures(object, userId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateFeatures`, {
        'isGoogleDriveEnable': object.isGoogleDriveEnable,
        'isOneDriveEnable': object.isOneDriveEnable,
        'isImmersiveReaderEnable': object.isImmersiveReaderEnable,
        'isMagicDrawEnable': object.isMagicDrawEnable,
        'isHandWritingEnable': object.isHandWritingEnable,
        'isPhetEnable': object.isPhetEnable,
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
