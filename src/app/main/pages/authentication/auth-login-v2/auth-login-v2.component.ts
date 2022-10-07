import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { SocialAuthService, GoogleLoginProvider, MicrosoftLoginProvider } from 'angularx-social-login';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';

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
    private _authenticationService: AuthenticationService
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
    this.socialAuthService.authState.pipe(takeUntil(this._authenticationService.destroy$)).subscribe((user) => {
      if (user == null) {
        this._router.navigate(['/pages/authentication/login-v2']);
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      if ((user?.provider == 'GOOGLE') || (user?.provider == 'MICROSOFT')) {
        this.loginSocial(user);
      }

      // this.userSocial = user;
      this.submitted = true;
      // this._authenticationService.getUsers(this.userSocial.response.access_token, this.userSocial.response.id_token);
      // console.log('user token:', this.userSocial.response.access_token);
      // this._authenticationService.getUsers(this.userSocial.response.access_token, 'e851b52adce04eb4597101ccd7dd6167acc65f46')
      //       .subscribe(
      //         data => {
      //           console.log("data c:", data);
      //           // this._router.navigate(['/']);
      //         },
      //         error => {
      //         }
      //       );
    });
  }

  loginSocial(user) {
    this._authenticationService
      .loginSocial(user.email)
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
          // this.register(user);
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
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);
  }

  microSoftLogin() {
    // this.googleLogout();
    const microsoftLoginOptions = {
      scope: 'User.Read'
    }
    this.socialAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID, microsoftLoginOptions);
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
