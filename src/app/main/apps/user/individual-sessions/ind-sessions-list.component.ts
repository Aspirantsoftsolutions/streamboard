import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { IndSessionsListService } from './ind-sessions-list.service';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


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
  public featureKeys = {
    "Geogebra": "isGeoGebraEnable",
    "Creative tools": "isCreativeToolsEnable",
    "New page": "isNewPageEnable",
    "Background": "isBackgroundEnable",
    "Save .SB File": "isSaveSBEnable",
    "Import": "isImportEnable",
    "Handwriting": "isHandWritingEnable",
    "Immersive reader": "isImmersiveReaderEnable",
    "Google drive": "isGoogleDriveEnable",
    "one drive": "isOneDriveEnable",
    "screenshot": "isScreenshotEnable",
    "recording": "isRecordingEnable",
    "QR code": "isQRCodeEnable",
    "participate mode": "isParticipateModeEnable",
    "export pdf": "isExportpdfEnable",
    "Magic draw": "isMagicDrawEnable",
    "Session interaction": "isSessionInteractionEnable",
    "Student attendance": "isStudentAttendanceEnable",
    "SSO integration": "isSSOIntegrationEnable",
    "Device management": "isDeviceManagementEnable",
    "QR login": "isQRloginEnable",
    "Phet": "isPhetEnable",
    "Dashboard": "isDashboardEnable",
    "Calendar": "isCalendarEnable",
    "Collaboration Class": "isCollaborationClassEnable",
    "All Users": "isAllUsersEnable",
    "WhiteBoard": "isWhiteBoardEnable",
    "School": "isSchoolEnable",
    "Notifications": "isNotificationsEnable"
  }
  public features = {
    isGeoGebraEnable: false,
    isCreativeToolsEnable: false,
    isNewPageEnable: false,
    isSaveSBEnable: false,
    isImportEnable: false,
    isBackgroundEnable: false,
    isHandWritingEnable: false,
    isImmersiveReaderEnable: false,
    isGoogleDriveEnable: false,
    isOneDriveEnable: false,
    isScreenshotEnable: false,
    isRecordingEnable: false,
    isQRCodeEnable: false,
    isParticipateModeEnable: false,
    isExportpdfEnable: false,
    isMagicDrawEnable: false,
    isSessionInteractionEnable: false,
    isStudentAttendanceEnable: false,
    isSSOIntegrationEnable: false,
    isDeviceManagementEnable: false,
    isQRloginEnable: false,
    isPhetEnable: false,
    isDashboardEnable: false,
    isCalendarEnable: false,
    isCollaborationClassEnable: false,
    isAllUsersEnable: false,
    isWhiteBoardEnable: false,
    isSchoolEnable: false,
    isNotificationsEnable: false
  }

  public selectRole: any = [
    { name: this.translate.instant('Admin'), value: 'Admin' },
    { name: this.translate.instant('Author'), value: 'Author' },
    { name: this.translate.instant('Editor'), value: 'Editor' },
    { name: this.translate.instant('Maintainer'), value: 'Maintainer' },
    { name: this.translate.instant('Subscriber'), value: 'Subscriber' }
  ];

  public selectPlan: any = [
    { name: this.translate.instant('Basic'), value: 'Basic' },
    { name: this.translate.instant('Premium'), value: 'Premium' },
    { name: this.translate.instant('Enterprise'), value: 'Enterprise' },
    { name: this.translate.instant('Team'), value: 'Team' }
  ];

  public selectStatus: any = [
    { name: this.translate.instant('All'), value: '' },
    { name: this.translate.instant('Pending'), value: 'Pending' },
    { name: this.translate.instant('Active'), value: 'Active' },
    { name: this.translate.instant('Inactive'), value: 'Inactive' }
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
  currentUser;
  plans = [];

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
    public translate: TranslateService
  ) {
    this._unsubscribeAll = new Subject();
    this.currentUser = this._commonService.getCurrentUser();
    this._commonService.getPlans().subscribe((resp) => {
      this.plans = resp['data'].plans[this.currentUser.plan.toLowerCase()];
      Object.keys(this.featureKeys).forEach(key => {
        if (this.currentUser[this.featureKeys[key]] && this.plans.indexOf(key) === -1) {
          this.plans.push(key)
        }
      });
      console.log(this.plans);
    });
    console.log(this.plans);
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
    Object.keys(user).map(key => {
      if (this.features.hasOwnProperty(key)) {
        this.features[key] = user[key]
      }
    });
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
    Object.keys(this.features).map((key) => {
      user[key] = this.features[key];
    });
    this._commonService.updateFeatures(this.features, userId).then((resposne: any) => {
      console.log('res updateFeatures:', resposne);
      localStorage.setItem('currentUser', JSON.stringify({ ...JSON.parse(localStorage.getItem('currentUser')), ...this.features }));
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
