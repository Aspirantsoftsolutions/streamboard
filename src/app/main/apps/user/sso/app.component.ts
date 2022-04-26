import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { protectedResources } from './auth-config';
import { ProviderOptions, GraphService } from './graph.service';
import { UserViewService } from '../user-view/user-view.service';

// const { google } = require('googleapis');
// const { authenticate } = require('@google-cloud/local-auth');
// const people = google.people('v1');
const privatekey = require('../../../../../../streamboard-346619-e851b52adce0.json');
type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}

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
  profile!: ProfileType;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private _sauthService: SocialAuthService,
    private userService: UserViewService,
    private graphService: GraphService,
    private msalBroadcastService: MsalBroadcastService,
    private _authenticationService: AuthenticationService,
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
        this.checkAndSetActiveAccount();
      });
    
    
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
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
            data.users.forEach(element => {
              if (!element.isAdmin) {
                const email = element.primaryEmail;
                const username = element.name.givenName;
                const firstName = element.name.givenName;
                const lastName = element.name.familyName;
                this.userService.setUser(email, username).then((resposne: any) => {
                  console.log('res set:', resposne);
                  }, (error) => {
                  console.log('res set error:', error);
                }
                );
              }
            });
            // this._router.navigate(['/']);
          },
          error => {
          }
      );
      
      this._authenticationService.getCalendarEvents(user.response.access_token)
        .subscribe(
          data => {
            console.log("data c:", data);
            
            // this._router.navigate(['/']);
            this._authenticationService.getCalendarEventsList(user.response.access_token, data.items[3].id)
              .subscribe(
                data1 => {
                  console.log("data c1:", data1);
                  // this._router.navigate(['/']);
                },
                error => {
                }
              );
          },
          error => {
          }
        );
    });

    const providerOptions: ProviderOptions = {
      account: this.authService.instance.getActiveAccount()!,
      scopes: protectedResources.graphMe.scopes,
      interactionType: InteractionType.Popup
    };
    this.getProfile(providerOptions);

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

  login() {
    // this.logout();

    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
            const providerOptions: ProviderOptions = {
              account: this.authService.instance.getActiveAccount()!,
              scopes: protectedResources.graphMe.scopes,
              interactionType: InteractionType.Popup
            };
            this.getProfile(providerOptions);

          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            console.log("coming here");
            this.authService.instance.setActiveAccount(response.account);
            const providerOptions: ProviderOptions = {
              account: this.authService.instance.getActiveAccount()!,
              scopes: protectedResources.graphMe.scopes,
              interactionType: InteractionType.Popup
            };
            this.getProfile(providerOptions);

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
    // this.googleLogout();
      const googleLoginOptions = {
        scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly'
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


  getProfile(providerOptions: ProviderOptions) {
    this.graphService.getGraphClient(providerOptions, this.authService)
      .api('/users').get()
      .then((profileResponse: ProfileType) => {
        console.log(profileResponse);
      })
      .catch((error) => {
        console.log(error);
      });
  }


}
