import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { SocialAuthService, GoogleLoginProvider, MicrosoftLoginProvider } from 'angularx-social-login';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public userSocial: any;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    private userService: UserListService,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    @Inject(MSAL_INSTANCE) private msalInstance: PublicClientApplication,
  ) {
    // redirect to home if already logged in
    if (this._authenticationService.currentUserValue) {
      this._router.navigate(['/']);
    }

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
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    // const googleLoginOptions = {
    //   scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly'
    // }
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // // Login
    this.loading = true;
    this._authenticationService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this._authenticationService.isSocialLogin = false;
          this._authenticationService.getCurrentUser(data.data.token, data.data.user.userId)
            .subscribe( 
              data => {
                if(data.data.role === 'Individual'){
                  this._router.navigate(['/apps/user/quick_sessions']);
                } else{
                  this._router.navigate(['/']);
                }
              },
              error => {
              }
            );
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  loginSocial(user) {
    const email = user.email ? user.email : user.preferred_username.includes('@') ? user.preferred_username : '';
    this._authenticationService
      .loginSocial(email)
      .pipe(first())
      .subscribe(
        data => {
          this._authenticationService.getCurrentUser(data.data.token, data.data.user.userId)
            .subscribe(
              data => {
                this._router.navigate(['/']);
              },
              error => {
              }
            );
        },
        error => {
          this.error = error;
          this.loading = false;
          console.log('login eror:', error);
          this.register(user);
        }
      );
  }

  register(user) {
    console.log('calling from register', user);

    let form = {
      'username': user.firstName,
      'email': user.email,
      'mobile': '123456789',
      'password': 'Test@123',
      'countryCode': '+91'
    }
    this.userService.register(form, 'Individual').then((resposne) => {
      console.log('res set:', resposne);
      this.loginSocial(user);
    }, (error) => {
      console.log('res set error:', error);

    }
    );
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
          this.loginSocial(user);
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
      console.log("&&&&&&&&&&&&&&&&&", user);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('loginSSO', 'MICROSOFT');
        this._authenticationService.isSocialLogin = true;
        this.loginSocial(user.account.idTokenClaims);
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
