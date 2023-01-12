import { CommonService } from 'app/main/apps/user/common.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, InteractionType } from '@azure/msal-browser';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { msalConfig } from '../../../../auth-config';
import { UserViewService } from '../user-view/user-view.service';
import { CsvService } from './csv.service';
import { BulkUploadService } from './bulkUpload.service';
import { ToastrService } from 'ngx-toastr';
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Client } from "@microsoft/microsoft-graph-client";
// const { google } = require('googleapis');
// const { authenticate } = require('@google-cloud/local-auth');
// const people = google.people('v1');
type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}
import * as msal from "@azure/msal-browser";
import { TranslateService } from '@ngx-translate/core';


const msalInstance = new msal.PublicClientApplication(msalConfig);


export class CSVRecord {
  public classes: string;
  public countryCode: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public mobile: string;
  public password: string;
  public schoolId: string;
  public username: string;
}

export class teacherTemplateData {
  classes: string[];
  countryCode: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  schoolId: string;
  username: string
}

export class studentTemplateData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  countryCode: string;
  classes: string;
  grades: string;
  schoolId: string;
  teachers: string[];
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('csvReader') csvReader: any;
  //title = 'Microsoft identity platform';
  isIframe = false;
  loginDisplay = false;
  gloginDisplay = false;
  tenantId = "";
  azureId = "";
  public records: any[] = [];
  private readonly _destroying$ = new Subject<void>();
  profile!: ProfileType;
  isGooogleDrive = false;
  isOneDrive = false;
  isImmersiveReader = false;
  isMagicDraw = false;
  isHandWriting = false;
  isPhet = false;
  currentUser;
  teacherTemplateData = {
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '',
    mobile: '',
    classes: '',
    username: '',
    password: 'Test@123',
    schoolId: JSON.parse(localStorage.getItem('currentUser')).userId
  };
  studentTemplateData = {
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '',
    mobile: '',
    classes: '',
    grades: '',
    teachers: '',
    username: '',
    password: 'Test@123',
    schoolId: JSON.parse(localStorage.getItem('currentUser')).userId,
  }
  jsonData = [];

  constructor(
    private authService: MsalService,
    private _sauthService: SocialAuthService,
    private userService: UserViewService,
    private msalBroadcastService: MsalBroadcastService,
    private _authenticationService: AuthenticationService,
    private _commonService: CommonService,
    private csvService: CsvService,
    private bulkUploadService: BulkUploadService,
    private _toastrService: ToastrService,
    private translate: TranslateService
  ) {
    this.currentUser = this._commonService.getCurrentUser();
    // this.teacherTemplateData.schoolId = this.currentUser.userId;
    // this.studentTemplateData.schoolId = this.currentUser.userId;

  }


  download(profileType) {
    if (profileType === 'teacher') {
      let temp = { ...this.teacherTemplateData };
      delete temp['username'];
      delete temp['password'];
      delete temp['schoolId'];
      delete temp['countryCode'];
      this.jsonData.push(temp);
      this.csvService.setCSVHeaders(temp);
    } else {
      const temp = { ...this.studentTemplateData };
      delete temp['username'];
      delete temp['password'];
      delete temp['schoolId'];
      delete temp['countryCode'];
      this.jsonData.push(temp);
      this.csvService.setCSVHeaders(temp);
    }
    this.csvService.downloadFile(this.jsonData, `${profileType}template${Date.now()}`);
    this.fileReset();
  }

  uploadListener($event: any, profileType: string): void {

    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length, profileType);
        if (profileType === 'teacher') {
          this.bulkUploadService.createBulkTeachers(this.records).subscribe(resp => {
            console.log('bulk teachers', resp);
            this._toastrService.success(
              `Successfully created ${profileType}s`,
              '👋 !',
              { toastClass: 'toast ngx-toastr', closeButton: true, newestOnTop: true }
            );
          }, (error) => {
            this._toastrService.error(error.message || 'Something bad happened');
          });
        } else if (profileType === 'student') {
          this.bulkUploadService.createBulkStudents(this.records).subscribe(resp => {
            console.log('bulk teachers', resp);
            this._toastrService.success(
              `Successfully created ${profileType}s`,
              '👋 !',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
          }, (error) => {
            this._toastrService.error(error.message || 'Something bad happened');
          });
        }
        this.fileReset();
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any, profileType) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        if (profileType === 'teacher') {
          let csvRecord: teacherTemplateData = new teacherTemplateData();
          csvRecord.firstName = curruntRecord[1].trim();
          csvRecord.lastName = curruntRecord[2].trim();
          csvRecord.email = curruntRecord[3].trim();
          csvRecord.mobile = curruntRecord[4].trim();
          csvRecord.classes = curruntRecord[5].trim().split(';');
          csvRecord.password = 'Test@123';
          csvRecord.schoolId = this.currentUser.userId;
          csvRecord.username = csvRecord.firstName + csvRecord.lastName;
          csvRecord.countryCode = '+971';
          csvArr.push(csvRecord);
        } else if (profileType === 'student') {
          let csvRecord: studentTemplateData = new studentTemplateData();
          csvRecord.firstName = curruntRecord[1].trim();
          csvRecord.lastName = curruntRecord[2].trim();
          csvRecord.email = curruntRecord[3].trim();
          csvRecord.mobile = curruntRecord[4].trim();
          csvRecord.classes = curruntRecord[5].trim();
          csvRecord.grades = curruntRecord[6].trim();
          csvRecord.teachers = curruntRecord[7].trim().split(';');
          csvRecord.username = csvRecord.firstName + csvRecord.lastName;
          csvRecord.password = 'Test@123';
          csvRecord.schoolId = this.currentUser.userId;
          csvRecord.countryCode = '+971';
          csvArr.push(csvRecord);
        }
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsonData = [];
  }


  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;


    /**
     * You can subscribe to MSAL events as shown below. For more info,
     * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md
     */
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    this.setLoginDisplay();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  logout() {
    this.authService.logout();
  }

  googleLogin() {
    // this.googleLogout();
    const googleLoginOptions = {
      scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly'
    }
    this._sauthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((user) => {
      console.log("social x login =>", user);
      this.gloginDisplay = true;
      let domainName = user.email.split("@");
      this._authenticationService.getUsers(user.response.access_token, 'e851b52adce04eb4597101ccd7dd6167acc65f46', domainName[1])
        .subscribe(
          data => {
            console.log("data c:", data);
            data.users.forEach(element => {
              if (!element.isAdmin) {
                const email = element.primaryEmail;
                const username = element.name.givenName;
                this.userService.setUser(email, username).then((resposne: any) => {
                  console.log('res set:', resposne);
                  this._toastrService.success(
                    `Successfully created user(s)`,
                    '👋 !',
                    { toastClass: 'toast ngx-toastr', closeButton: true, newestOnTop: true }
                  );
                }, (error) => {
                  console.log('res set error:', error);
                  this._toastrService.error(
                    `Failed to created user(s)`,
                    '👋 !',
                    { toastClass: 'toast ngx-toastr', closeButton: true, newestOnTop: true }
                  );
                }
                );
              }
            });
            // this._router.navigate(['/']);
          },
          () => { }
        );
    });

  }

  microSoftLogin() {
    msalInstance.loginPopup().then(async (user) => {
      this.setLoginDisplay();
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
        account: user.account,
        interactionType: InteractionType.Popup, // msal-browser InteractionType
        scopes: user.scopes
      });
      // Initialize the Graph client
      const graphClient = Client.initWithMiddleware({
        authProvider
      });

      let userDetails = await graphClient.api('/users').get();
      userDetails['value'].forEach(element => {
        if (!element.userPrincipalName.includes('admin')) {
          const email = element.mail;
          const username = element.displayName;
          this.userService.setUser(email, username).then((resposne: any) => {
            console.log('res set:', resposne);
            this._toastrService.success(
              `Successfully created users`,
              '👋 !',
              { toastClass: 'toast ngx-toastr', closeButton: true, newestOnTop: true }
            );
          }, (error) => {
            console.log('res set error:', error);
            this._toastrService.error(
              `Failed to created users`,
              '👋 !',
              { toastClass: 'toast ngx-toastr', closeButton: true, newestOnTop: true }
            );
          }
          );
        }
      });
    })
  }

  googleLogout() {
    this._sauthService.signOut();
    this.gloginDisplay = false;
  }

  // unsubscribe to events when component is destroyed
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  updateFeatures() {
    const userId = this._commonService.getCurrentUser().userId;
    let featureUpdate: any = {};
    featureUpdate.isGoogleDriveEnable = this.isGooogleDrive;
    featureUpdate.isOneDriveEnable = this.isOneDrive;
    featureUpdate.isImmersiveReaderEnable = this.isImmersiveReader;
    featureUpdate.isMagicDrawEnable = this.isMagicDraw;
    featureUpdate.isHandWritingEnable = this.isHandWriting;
    featureUpdate.isPhetEnable = this.isPhet;

    this._commonService.updateFeatures(featureUpdate, userId).then((resposne: any) => {
      console.log('res updateFeatures:', resposne);
    }, (error) => {
      console.log('res updateFeatures error:', error);
    }
    );
  }
}
