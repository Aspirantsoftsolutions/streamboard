import { CommonService } from 'app/main/apps/user/common.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject, async } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { UserListService } from 'app/main/apps/user/user-list/user-list.service';
import { protectedResources } from '../../../../auth-config';
import { InteractionType } from '@azure/msal-browser';
import { ProviderOptions, GraphService } from '../sso/graph.service';
import { MsalService } from '@azure/msal-angular';
import { UserViewService } from '../user-view/user-view.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
// var admin = require('google-admin-sdk');
// const privatekey = require('../../../../../../streamboard-346619-e851b52adce0.json');
// const { JWT } = require('google-auth-library');    

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public selectRole: any = [
    { name: 'All', value: '' },
    { name: 'Teacher', value: 'Teacher' },
    { name: 'Student', value: 'Student' },
  ];

  public selectPlan: any = [
    { name: 'All', value: '' },
    { name: 'Basic', value: 'Basic' },
    { name: 'Premium', value: 'Premium' },
    { name: 'Enterprise', value: 'Enterprise' },
  ];

  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' }
  ];

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: UserListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _commonService: CommonService,
    private authService: MsalService,
    private userService: UserViewService,
    private graphService: GraphService,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this._unsubscribeAll = new Subject();
  }

  setLoginDisplay() {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    this.selectedRole = this.selectRole[0];
    this.selectedPlan = this.selectPlan[0];
    this.selectedStatus = this.selectStatus[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return (d.username !== undefined && d.username.toLowerCase().indexOf(val) !== -1) ||(d.email !== undefined && d.email.toLowerCase().indexOf(val) !== -1) || (d.fullName !== undefined && d.fullName.toLowerCase().indexOf(val) !== -1) || (d.firstName !== undefined && d.firstName.toLowerCase().indexOf(val) !== -1) || !val;
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    setTimeout(() => {
      this._commonService.onUserEditListChanged.next(null);
    }, 200);
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByPlan(event) {
    const filter = event ? event.value : '';
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(roleFilter, planFilter, statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialNameMatch = row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch = row.plan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch = row.status.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch;
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
          });
        }, 450);
      } else {
        this._userListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          this.rows = response;
          this.tempData = this.rows;
        });
      }
    });

    this.getUser();


  }

  statusChange(id, status): void {
    this._commonService.updateUserStatus(!status, id).then((response) => {
      this._userListService.getDataTableRows();
    });
  }


  doSync() {
    // this._router.navigate(['/apps/user/profile']);
    const providerOptions: ProviderOptions = {
      account: this.authService.instance.getActiveAccount()!,
      scopes: protectedResources.graphMe.scopes,
      interactionType: InteractionType.Popup
    };
    this.getProfile(providerOptions);

  }

  getProfile(providerOptions: ProviderOptions) {
    this.graphService.getGraphClient(providerOptions, this.authService)
      .api('/users').get()
      .then((profileResponse: any) => {
        console.log('data', profileResponse);
        profileResponse.value.forEach(element => {
          if (!element.userPrincipalName.includes('admin')) {
            const email = element.mail;
            const username = element.displayName;
            const firstName = element.displayName;
            const lastName = element.displayName;
            this.userService.setUser(email, username).then((resposne: any) => {
              console.log('res set:', resposne);
              this._userListService.getDataTableRows();
            }, (error) => {
              console.log('res set error:', error);
            }
            );
          }
        });

      })
      .catch((error) => {
        console.log(error);
      });
  }

  toggleSidebarEdit(name, id): void {
    console.log('id:', id);
    this._userListService.getDataTableRows().then((response: any) => {
      response.map(row => {
        if (row.userId == id) {
          console.log('current row', row);
          setTimeout(() => {
            this._commonService.onUserEditListChanged.next(row);
          }, 200);
          this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
        }
      });
    }, (error) => {
      console.log('res set error:', error);
    });
  }

  deleteUser(id) {
    this._commonService.deleteUser(id).then((response) => {
      this._userListService.getDataTableRows();
      this.toastr.success('👋 Deleted Successfully.', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    });
  }

  async getUser() {
    // const client = new JWT({
    //   email: privatekey.client_email,
    //   key: privatekey.private_key,
    //   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    // });
    // let url = "https://admin.googleapis.com/admin/directory/v1/users";
    // const res = await client.request({ url });
    // console.log(res.data);

  // try {
  //   const admin = await google.admin({
  //     version: "directory_v1",
  //     auth: client,
  //   });
  //   //get all users
  //   const users = await admin.users.get({
  //     userKey: email,
  //   });
  //   console.log(users, "users");
  // } catch (error) {
  //   console.log(
  //     error.response ? error.response.data : error.message,
  //     "error",
  //     error.message ? error.errors : ""
  //   );
  // }
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
