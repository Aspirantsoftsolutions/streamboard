import { NewGradesSidebarComponent } from './grades/new-grades-sidebar/new-grades-sidebar.component';
import { GradesListService } from './grades/grades-list.service';
import { GradesListComponent } from './grades/grades-list.component';
import { NewGroupsSidebarComponent } from './groups/new-groups-sidebar/new-groups-sidebar.component';
import { GroupsListService } from './groups/groups-list.service';
import { GroupsListComponent } from './groups/groups-list.component';
import { NewStudentsSidebarComponent } from './students/new-students-sidebar/new-students-sidebar.component';
import { StudentsListService } from './students/students-list.service';
import { StudentsListComponent } from './students/students-list.component';
import { ClassesListService } from './classes/classes-list.service';
import { NewClassesSidebarComponent } from './classes/new-classes-sidebar/new-classes-sidebar.component';
import { ClassesListComponent } from './classes/classes-list.component';
import { TeachersListService } from './teachers/teachers-list.service';
import { TeachersListComponent } from './teachers/teachers-list.component';
import { NewTeachersSidebarComponent } from './teachers/new-teachers-sidebar/new-teachers-sidebar.component';
import { SchoolsListComponent } from './schools/schools-list.component';
import { NewSchoolsSidebarComponent } from './schools/new-schools-sidebar/new-schools-sidebar.component';
import { NewSessionsSidebarComponent } from './sessions/new-sessions-sidebar/new-sessions-sidebar.component';
import { NewSubscriptionSidebarComponent } from './subscriptions/new-subscription-sidebar/new-subscription-sidebar.component';
import { NewPaymentSidebarComponent } from './payments/new-payment-sidebar/new-payment-sidebar.component';
import { SessionsListService } from './sessions/sessions-list.service';
import { SessionsListComponent } from './sessions/sessions-list.component';
import { ToastrModule } from 'ngx-toastr';
import { PaymentsListService } from './payments/payments-list.service';
import { PaymentsListComponent } from './payments/payments-list.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';

import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';
import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';

import { UserEditComponent } from 'app/main/apps/user/user-edit/user-edit.component';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';

import { UserListComponent } from 'app/main/apps/user/user-list/user-list.component';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';

import { UserViewComponent } from 'app/main/apps/user/user-view/user-view.component';
import { UserViewService } from 'app/main/apps/user/user-view/user-view.service';
import { NewUserSidebarComponent } from 'app/main/apps/user/user-list/new-user-sidebar/new-user-sidebar.component';
import { SubscriptionsListComponent } from './subscriptions/subscriptions-list.component';
import { SubscriptionsListService } from './subscriptions/subscriptions-list.service';
import { SchoolsListService } from './schools/schools-list.service';

// import { MatButtonModule } from '@angular/material/button';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatListModule } from '@angular/material/list';
// import { MatTableModule } from '@angular/material/table';
// import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './sso/app.component';
import { HomeComponent } from './sso/home/home.component';
import { ProfileComponent } from './sso/profile/profile.component';
import { TenantComponent } from './sso/tenant/tenant.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';

import { msalConfig, loginRequest, protectedResources } from './sso/auth-config';

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

/**
 * MSAL Angular will automatically retrieve tokens for resources 
 * added to protectedResourceMap. For more info, visit: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md#get-tokens-for-web-api-calls
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  protectedResourceMap.set(protectedResources.graphMe.endpoint, protectedResources.graphMe.scopes);
  protectedResourceMap.set(protectedResources.armTenants.endpoint, protectedResources.armTenants.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}

// routing
const routes: Routes = [
  {
    path: 'subscriptions-list',
    component: SubscriptionsListComponent,
    resolve: {
      uls: SubscriptionsListService
    },
    data: { animation: 'SubscriptionsListComponent' }
  },
  {
    path: 'groups-list',
    component: GroupsListComponent,
    resolve: {
      uls: GroupsListService
    },
    data: { animation: 'GroupsListComponent' }
  },
  {
    path: 'grades-list',
    component: GradesListComponent,
    resolve: {
      uls: GradesListService
    },
    data: { animation: 'GradesListComponent' }
  },
  {
    path: 'payments-list',
    component: PaymentsListComponent,
    resolve: {
      uls: PaymentsListService
    },
    data: { animation: 'PaymentsListComponent' }
  },
  {
    path: 'user-list',
    component: UserListComponent,
    resolve: {
      uls: UserListService
    },
    data: { animation: 'UserListComponent' }
  },
  {
    path: 'sessions-list',
    component: SessionsListComponent,
    resolve: {
      uls: SessionsListService
    },
    data: { animation: 'SessionsListComponent' }
  },
  {
    path: 'quick_sessions',
    component: SessionsListComponent,
    resolve: {
      uls: SessionsListService
    },
    data: { animation: 'SessionsListComponent' }
  },
  {
    path: 'live_sessions',
    component: SessionsListComponent,
    resolve: {
      uls: SessionsListService
    },
    data: { animation: 'SessionsListComponent' }
  },
  {
    path: 'scheduled_sessions',
    component: SessionsListComponent,
    resolve: {
      uls: SessionsListService
    },
    data: { animation: 'SessionsListComponent' }
  },
  {
    path: 'schools-list',
    component: SchoolsListComponent,
    resolve: {
      uls: SchoolsListService
    },
    data: { animation: 'SchoolsListComponent' }
  },
  {
    path: 'teachers-list',
    component: TeachersListComponent,
    resolve: {
      uls: TeachersListService
    },
    data: { animation: 'TeachersListComponent' }
  },
  {
    path: 'classes-list',
    component: ClassesListComponent,
    resolve: {
      uls: ClassesListService
    },
    data: { animation: 'ClassesListComponent' }
  },
  {
    path: 'students-list',
    component: StudentsListComponent,
    resolve: {
      uls: StudentsListService
    },
    data: { animation: 'StudentsListComponent' }
  },
  {
    path: 'user-view/:id',
    component: UserViewComponent,
    resolve: {
      data: UserEditService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'UserViewComponent' }
  },
  {
    path: 'user-edit/:id',
    component: UserEditComponent,
    resolve: {
      ues: UserEditService
    },
    data: { animation: 'UserEditComponent' }
  },
  {
    path: 'appazure',
    component: AppComponent,
    data: { animation: 'appazure' }
  },
  // {
  //   path: 'appazure',
  //   loadChildren: () => import('./sso/app.module').then(m => m.AppModule)
  // }
];

@NgModule({
  declarations: [
    NewTeachersSidebarComponent,
    TeachersListComponent,
    SessionsListComponent,
    NewSessionsSidebarComponent,
    SubscriptionsListComponent,
    PaymentsListComponent,
    UserListComponent,
    UserViewComponent,
    UserEditComponent,
    NewUserSidebarComponent,
    NewPaymentSidebarComponent,
    NewSubscriptionSidebarComponent,
    NewSchoolsSidebarComponent,
    SchoolsListComponent,
    ClassesListComponent,
    NewClassesSidebarComponent,
    StudentsListComponent,
    NewStudentsSidebarComponent,
    GroupsListComponent,
    NewGroupsSidebarComponent,
    GradesListComponent,
    NewGradesSidebarComponent,
    AppComponent,
    HomeComponent,
    ProfileComponent,
    TenantComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule,
    ToastrModule,
    MsalModule
  ],
  providers: [
    TeachersListService,
    SchoolsListService,
    SessionsListService,
    SubscriptionsListService,
    PaymentsListService,
    UserListService,
    UserViewService,
    UserEditService,
    ClassesListService,
    StudentsListService,
    GroupsListService,
    GradesListService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class UserModule {}
