import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { IndSessionsListService } from './ind-sessions-list.service';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sessions-list',
  templateUrl: './ind-sessions-list.component.html',
  styleUrls: ['./ind-sessions-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndSessionsListComponent implements OnInit {
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
    { name: 'Admin', value: 'Admin' },
    { name: 'Author', value: 'Author' },
    { name: 'Editor', value: 'Editor' },
    { name: 'Maintainer', value: 'Maintainer' },
    { name: 'Subscriber', value: 'Subscriber' }
  ];

  public selectPlan: any = [
    { name: 'All', value: '' },
    { name: 'Basic', value: 'Basic' },
    { name: 'Company', value: 'Company' },
    { name: 'Enterprise', value: 'Enterprise' },
    { name: 'Team', value: 'Team' }
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
  isGooogleDrive = false;
  isOneDrive = false;
  isImmersiveReader = false;
  isMagicDraw = false;
  isHandWriting = false;
  isPhet = false;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: IndSessionsListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _commonService: CommonService,
    private _toastrService: ToastrService,
  ) {
    this._unsubscribeAll = new Subject();
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
      return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
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
    let user = this._commonService.getCurrentUser();
     this.isGooogleDrive = user.isGoogleDriveEnable;
    this.isOneDrive = user.isOneDriveEnable ;
     this.isImmersiveReader = user.isImmersiveReaderEnable;
     this.isMagicDraw = user.isMagicDrawEnable;
     this.isHandWriting = user.isHandWritingEnable;
     this.isPhet = user.isPhetEnable;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  updateFeatures() {
    let user = this._commonService.getCurrentUser();
    const userId = user.userId;
    let featureUpdate: any = {};
    featureUpdate.isGoogleDriveEnable = this.isGooogleDrive;
    featureUpdate.isOneDriveEnable = this.isOneDrive;
    featureUpdate.isImmersiveReaderEnable = this.isImmersiveReader;
    featureUpdate.isMagicDrawEnable = this.isMagicDraw;
    featureUpdate.isHandWritingEnable = this.isHandWriting;
    featureUpdate.isPhetEnable = this.isPhet;

    user.isGoogleDriveEnable = this.isGooogleDrive;
    user.isOneDriveEnable = this.isOneDrive;
    user.isImmersiveReaderEnable = this.isImmersiveReader;
    user.isMagicDrawEnable = this.isMagicDraw;
    user.isHandWritingEnable = this.isHandWriting;
    user.isPhetEnable = this.isPhet;

    this._commonService.updateFeatures(featureUpdate, userId).then((resposne: any) => {
      console.log('res updateFeatures:', resposne);
      localStorage.setItem('currentUser', JSON.stringify(user));

      setTimeout(() => {
        this._toastrService.success(
          'Successfully Updated  🎉',
          '👋 !',
          { toastClass: 'toast ngx-toastr', closeButton: true }
        );
      }, 1000);
      
    }, (error) => {
      console.log('res updateFeatures error:', error);
    }
    );
  }
}
