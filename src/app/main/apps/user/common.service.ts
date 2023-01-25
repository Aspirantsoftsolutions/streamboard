import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from "rxjs/operators";

@Injectable()
export class CommonService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public onPaymentsChanged: BehaviorSubject<any>;
  public onUserEditListChanged: BehaviorSubject<any>;
  public onStudentsSelected: BehaviorSubject<any>;
  public onDevicesUpdates: BehaviorSubject<any>;
  public onDevicesSelected: BehaviorSubject<any>;
  public updateSideMenu: BehaviorSubject<any>;
  public static teacherGetList;
  public onTeacherEditListChanged = null;
  public devicesSelected = [];
  public deviceGroups = [];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
    this.onPaymentsChanged = new BehaviorSubject({});
    this.onUserEditListChanged = new BehaviorSubject({});
    this.onStudentsSelected = new BehaviorSubject({});
    this.onDevicesUpdates = new BehaviorSubject({});
    this.onDevicesSelected = new BehaviorSubject([]);
    this.updateSideMenu = new BehaviorSubject(false);
  }

  getCurrentUser() {
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
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
    const url = `${environment.apiUrl}/api/user/clients`
    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
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

  /**
  * Get rows
  */
  getDataTableRowsAll(): Promise<any[]> {
    const url = `${environment.apiUrl}/api/user/all`;
    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
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
      this._httpClient.get(`${environment.apiUrl}/api/user/allStudents/` + (this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId)).subscribe((response: any) => {
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
      this._httpClient.get(`${environment.apiUrl}/api/user/allTeachers/` + (this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId)).subscribe((response: any) => {
        console.log(response.data);
        this.onUserListChanged.next(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getAllUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/all/` + (this.getCurrentUser().role != 'School' ? this.getCurrentUser().schoolId : this.getCurrentUser().userId)).subscribe((response: any) => {
        console.log(response.data);
        resolve(response.data);
      }, reject);
    });
  }

  getCount(userid): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiUrl}/api/user/getCounts/` + userid,).subscribe((response: any) => {
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


  updateProfile(form, userid): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/updateProfileData`, {
        'organisation': form['user-name'] || form['user-name'],
        'fullName': form['user-fullname'],
        'firstName': form['user-firstname'],
        'lastName': form['user-lastname'],
        'address': form['user-address'],
        'mobile': form['user-number'],
        'userId': userid,
        'username': form['user-name'] || form['username'],
        'email': form['user-email'] || form['email'],
        'itemail': form['user-it-email'],
        'countryCode': '+971',
        'role': form['role'],
        'plan': form['user-plan'] ? form['user-plan'].value : form['plan'],
        'schoolId': form['schoolId'],
        'licenseEndDate': new Date(form['plan-endDate'][0]).toISOString()
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


  linkTeachers(userIds, teacherId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/linkTeachers`, {
        'teacherId': teacherId,
        'userId': userIds
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

  linkClass(userIds, teacherId): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.put(`${environment.apiUrl}/api/user/linkClasses`, {
        'userId': teacherId,
        'teacherId': userIds
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
        'plan': form['user-plan'].value,
        'status': 'active',
        'licenseEndDate': new Date(form['plan-endDate'][0]).toISOString()
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  register(form, role): Promise<any[]> {
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
        'organisation': form['organisation']
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
        'schools': (form['schools'] || []).map(x => ({ ...x, role: 'School' })),
        'teachers': (form['teachers'] || []).map(x => ({ ...x, role: 'Teacher' })),
        'students': (form['students'] || []).map(x => ({ ...x, role: 'Student' })),
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
        ...object,
        'userId': userId
      }).subscribe((response: any) => {
        console.log(response);
        resolve(response);
      }, reject);
    });
  }

  fileUpload(imageForm: FormData) {
    console.log('image uploading');
    const currUser = this.getCurrentUser().userId;
    return this._httpClient.post(`${environment.apiUrl}/api/multimedia/upload/${currUser}`, imageForm);
  }

  getMediaList() {
    const currUser = this.getCurrentUser().userId;
    return this._httpClient.get(`${environment.apiUrl}/api/multimedia/list/${currUser}`);
  }

  getDeviceList() {
    const currUser = this.getCurrentUser().userId;
    const URL = currUser ? `${environment.apiUrl}/api/device/${currUser}` : `${environment.apiUrl}/api/device`;
    return this._httpClient.get(URL);
  }

  sendPushNotifications(body) {
    // const currUser = this.getCurrentUser().userId;
    return this._httpClient.post(`${environment.apiUrl}/api/pushnotifications/add`, body);
  }

  schedulePushNotifications(body) {
    // const currUser = this.getCurrentUser().userId;
    return this._httpClient.post(`${environment.apiUrl}/api/pushnotifications/schedule`, body);
  }

  deleteDevice(id) {
    return this._httpClient.delete(`${environment.apiUrl}/api/device/${id}`);
  }

  deleteMedia(id) {
    return this._httpClient.delete(`${environment.apiUrl}/api/multimedia/${id}`)
  }

  updateDevice(id, body) {
    return this._httpClient.post(`${environment.apiUrl}/api/device/${id}`, body).pipe(tap(x => { this.onDevicesUpdates.next(x) }));
  }

  createDevice(body) {
    return this._httpClient.post(`${environment.apiUrl}/api/device`, body);
  }

  createDeviceGroup(devices, groupName) {
    const body = {
      devices,
      groupName,
      school_id: this.getCurrentUser().userId
    };
    return this._httpClient.post(`${environment.apiUrl}/api/device/groups`, body);
  }

  getDeviceGroup() {
    const schoolId = this.getCurrentUser().userId;
    return this._httpClient.get(`${environment.apiUrl}/api/device/groups/${schoolId}`).pipe(tap(resp => this.deviceGroups = resp['data']));
  }

  sendCommandToDeviceGroup(devices, command) {
    const body = {
      command,
      to: devices,
      "notification": {
        "badge": 1
      }
    };
    return this._httpClient.post(`${environment.apiUrl}/api/pushnotifications/command`, body)
  }

  deleteDeviceFromGroup(groupId, deviceId) {
    return this._httpClient.delete(`${environment.apiUrl}/api/device/group/${groupId}`, { body: { deviceId } });
  }

  getInviteList() {
    return this._httpClient.get(`${environment.apiUrl}/api/user/invites`);
  }

  deleteGroup(id) {
    return this._httpClient.delete(`${environment.apiUrl}/api/device/groups/${id}`);
  }

  bulkUpdateCreds(body) {
    return this._httpClient.post(`${environment.apiUrl}/api/device/creds`, body);
  }

  getMicroSoftUsers(bearerToken) {
    return this._httpClient.get(`https://graph.microsoft.com/v1.0/users`, { headers: { 'Authorization': `Bearer ${bearerToken}` } })
      .pipe(map(user => {
        console.log('logged in users here:', user);
        // login successful if there's a jwt token in the response
        return user;
      })
      );
  }

  savePayment(paymentInfo) {
    return this._httpClient.post(`${environment.apiUrl}/api/payments`, paymentInfo);
  }

  getPaymentHistory() {
    return this._httpClient.get(`${environment.apiUrl}/api/payments`);
  }

  getAdminAnalytics() {
    return this._httpClient.get(`${environment.apiUrl}/api/analytics/adminAnalytics`);
  }

  getSchoolAnalytics() {
    return this._httpClient.get(`${environment.apiUrl}/api/analytics/schoolAnalytics`);
  }

  forgotPassword(form) {
    return this._httpClient.post(`${environment.apiUrl}/api/auth/forgotPassword`, { email: form.email });
  }

  getPlans() {
    return this._httpClient.get(`${environment.apiUrl}/api/plans`);
  }

  updatePlans(body) {
    return this._httpClient.post(`${environment.apiUrl}/api/plans`, body);
  }

  sendInvoice() {
    return this._httpClient.post(`${environment.apiUrl}/api/invoice/sendInvoice`, {});
  }

  updateLocale(userId, locale) {
    return this._httpClient.post(`${environment.apiUrl}/api/user/preferences/${userId}`, { locale });
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
