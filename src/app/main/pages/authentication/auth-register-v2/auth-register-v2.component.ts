import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { PublicClientApplication } from '@azure/msal-browser';
import { MSAL_INSTANCE } from '@azure/msal-angular';

@Component({
  selector: 'app-auth-register-v2',
  templateUrl: './auth-register-v2.component.html',
  styleUrls: ['./auth-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: FormGroup;
  public submitted = false;
  public role = 'teacher';
  // Private
  private _unsubscribeAll: Subject<any>;
  public selectedStatus = [];

  public selectStatusRegister: any = [
    { name: 'Select', value: '' },
    { name: 'Pending', value: 'Are you a teacher' },
    { name: 'Active', value: 'Are you a student' },
    { name: 'Inactive', value: 'Are you a IT Admin' }
  ];

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _UserListService: UserListService,
    private toastr: ToastrService,
    private _router: Router,
    private socialAuthService: SocialAuthService,
    private _authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder,
    @Inject(MSAL_INSTANCE) private msalInstance: PublicClientApplication,
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    if (this.registerForm.valid) {
      this.submitted = true;
      this._UserListService.register(this.registerForm.value, 'Individual').then((resposne) => {
        console.log('res set:', resposne);
        this._router.navigate(['/pages/authentication/login-v2']);

        let successString = Response;
        this.toastr.success('👋 Registered Created Successfully.', 'Success!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      }, (error) => {
        console.log('res set error:', error);
        let errorString = error.message;
        this.toastr.error(errorString, 'Error!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      }
      );
    } else {
      this.toastr.error('Validation error', 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
  }

  socialRegistration(email) {
    this.submitted = true;
    this._UserListService.socialRegister(email).then((resposne) => {
      console.log('res set:', resposne);
      this._router.navigate(['/pages/authentication/login-v2']);
      let successString = Response;
      this.toastr.success('👋 Registered Created Successfully.', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }, (error) => {
      console.log('res set error:', error);
      let errorString = error;
      this.toastr.error(errorString, 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      mobilenumber: ['', Validators.required],
      location: ['', Validators.required],
      organisation: ['', Validators.required],
      privacy: ['', Validators.required]
    });
    this.selectedStatus = this.selectStatusRegister[0];

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  googleLogin() {
    // this.googleLogout();
    const googleLoginOptions = {
      scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly'
    }
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((user) => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if ((user?.provider == 'GOOGLE') || (user?.provider == 'MICROSOFT')) {
          this._authenticationService.isSocialLogin = true;
          localStorage.setItem('loginSSO', 'GOOGLE');
          this.socialRegistration(user.email);
        }
        this.submitted = true;
      } else {
        this._router.navigate(['/pages/authentication/login-v2']);
      }

      if (!this._authenticationService.currentUserValue) {
        this._router.navigate(['/pages/authentication/login-v2']);
      }
    });
  }

  microSoftLogin() {
    this.msalInstance.loginPopup({ scopes: ['Application.Read.All', 'Application.ReadWrite.All', 'Directory.Read.All', 'Directory.ReadWrite.All', 'email', 'openid', 'profile', 'User.Read', 'User.Read.All', 'User.ReadBasic.All', 'User.ReadWrite', 'User.ReadWrite.All'] }).then((user) => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('loginSSO', 'MICROSOFT');
        this._authenticationService.isSocialLogin = true;
        this.socialRegistration(user.account.idTokenClaims['email']);
        this.submitted = true;
      } else {
        this._router.navigate(['/pages/authentication/login-v2']);
      }
      if (!this._authenticationService.currentUserValue) {
        this._router.navigate(['/pages/authentication/login-v2']);
      }
    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
