import { CommonService } from 'app/main/apps/user/common.service';
import { AuthSchoolRegisterV2Component } from './auth-school-register-v2/auth-school-register-v2.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { AuthForgotPasswordV2Component } from 'app/main/pages/authentication/auth-forgot-password-v2/auth-forgot-password-v2.component';

import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';

import { AuthRegisterV2Component } from 'app/main/pages/authentication/auth-register-v2/auth-register-v2.component';

import { AuthResetPasswordV2Component } from 'app/main/pages/authentication/auth-reset-password-v2/auth-reset-password-v2.component';
import { ToastrModule } from 'ngx-toastr';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';

// routing
const routes: Routes = [
  {
    path: 'authentication/login-v2',
    component: AuthLoginV2Component
  },
  {
    path: 'authentication/register-v2',
    component: AuthRegisterV2Component,
    resolve: {
      uls: UserListService
    },
  },
  {
    path: 'authentication/school-register',
    component: AuthSchoolRegisterV2Component,
    resolve: {
      uls: UserListService
    },
  },
  {
    path: 'authentication/reset-password-v2',
    component: AuthResetPasswordV2Component
  },
  {
    path: 'authentication/forgot-password-v2',
    component: AuthForgotPasswordV2Component
  }
];

@NgModule({
  declarations: [
    AuthLoginV2Component,
    AuthRegisterV2Component,
    AuthForgotPasswordV2Component,
    AuthResetPasswordV2Component,
    AuthSchoolRegisterV2Component
  ],
  providers: [
    UserListService,
    CommonService,
  ],
  imports: [ToastrModule, CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule]
})
export class AuthenticationModule { }
