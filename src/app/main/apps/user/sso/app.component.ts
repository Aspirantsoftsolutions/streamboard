import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
// const { google } = require('googleapis');
// const { authenticate } = require('@google-cloud/local-auth');
// const people = google.people('v1');
const privatekey = require('../../../../../../streamboard-346619-e851b52adce0.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Microsoft identity platform';
  isIframe = false;
  loginDisplay = false;
  gloginDisplay = false;
  tenantId = "";
  azureId = "";
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private _sauthService: SocialAuthService,
    private msalBroadcastService: MsalBroadcastService,
    private _authenticationService: AuthenticationService
  ) {}

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
      });
    
    this._sauthService.authState.subscribe((user) => {
      console.log('user:', user);
      this.gloginDisplay = true;
      // this.userSocial = user;
      // this._authenticationService.getUsers(this.userSocial.response.access_token, this.userSocial.response.id_token);
      // console.log('user token:', this.userSocial.response.access_token);
      this._authenticationService.getUsers(user.response.access_token, 'e851b52adce04eb4597101ccd7dd6167acc65f46')
        .subscribe(
          data => {
            console.log("data c:", data);
            // this._router.navigate(['/']);
          },
          error => {
          }
        );
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
    // if (this.tenantId != "" && this.azureId != "") {
     
    // }
  }

  logout() {
    this.authService.logout();
  }

  googleLogin() {
      const googleLoginOptions = {
      scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly'
    }
    this._sauthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);
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
}
