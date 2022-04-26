import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  getCurrentUser(token) {
    return this._http
      .get<any>(`${environment.apiUrl}/api/user/profile`,
        {
          headers: {
            'Authorization' : 'Bearer '+ token
          }
        })
      .pipe(
        map(user => {
          console.log('logged in user:', user);
          // login successful if there's a jwt token in the response
          if (user) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user.data));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                user.data.role +
                ' user to Streamboard. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.data.username+'!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user.data);
          }

          return user;
        })
      );
  }

  getUsers(bearerToken,idToken) {
    return this._http
      .get<any>('https://content-admin.googleapis.com/admin/directory/v1/users?domain=adsrive.com&key='+idToken,
        {
          headers: {
            'Authorization': 'Bearer ' + bearerToken
          }
        })
      .pipe(
        map(user => {
          console.log('logged in users here:', user);
          // login successful if there's a jwt token in the response
          return user;
        })
      );
  }

  getCalendarEvents(bearerToken) {
    return this._http
      .get<any>('https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            'Authorization': 'Bearer ' + bearerToken
          }
        })
      .pipe(
        map(calendar => {
          console.log('calendar here:', calendar);
          return calendar;
        })
      );
  }

  getCalendarEventsList(bearerToken,calendarId) {
    return this._http
      .get<any>('https://www.googleapis.com/calendar/v3/calendars/'+calendarId+'/events',
        {
          headers: {
            'Authorization': 'Bearer ' + bearerToken
          }
        })
      .pipe(
        map(calendar => {
          console.log('calendar here:', calendar);
          return calendar;
        })
      );
  }

  
  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/api/auth/login`, { 'identity':email,'password': password })
      .pipe(
        map(user => {
          console.log('logged in user:', user);
          // login successful if there's a jwt token in the response
          if (user && user.data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
          //  localStorage.setItem('currentUser', JSON.stringify(user));

            // // Display welcome toast!
            // setTimeout(() => {
            //   this._toastrService.success(
            //     'You have successfully logged in as an ' +
            //       user.role +
            //       ' user to Streamboard. Now you can start to explore. Enjoy! 🎉',
            //     '👋 Welcome, !',
            //     { toastClass: 'toast ngx-toastr', closeButton: true }
            //   );
            // }, 2500);

            // notify
            // this.currentUserSubject.next(user);
           
          }

          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
