import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { SessionsListService } from './sessions-list.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SessionsListComponent implements OnInit {
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
  public url = this.router.url;
  public urlLastValue;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _sessionListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _sessionListService: SessionsListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private router: Router,
    public translate: TranslateService
  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  getCurrentUser() {
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
  }
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
      return (d.title !== undefined && d.title.toLowerCase().indexOf(val) !== -1) || (d.description !== undefined && d.description.toLowerCase().indexOf(val) !== -1) || !val;
    });

    // Update The Rows
    this.rows = temp.filter(row => {
      var match;
      if (this.urlLastValue == 'quick_sessions') {
        console.log(row.type.toLowerCase().indexOf('quicksession'));
        match = row.type.toLowerCase().indexOf('quicksession') !== -1;
      } else if (this.urlLastValue == 'scheduled_sessions') {
        console.log(row.type.toLowerCase().indexOf('scheduledsession'));
        match = row.type.toLowerCase().indexOf('scheduledsession') !== -1;
      } else if (this.urlLastValue == 'live_sessions') {
        console.log(row.type.toLowerCase().indexOf('scheduledsession'));
        match = row.type.toLowerCase().indexOf('livesession') !== -1;
      }
      return match;
    });
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
          this._sessionListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
            this.rows = this.filterSession();
          });
        }, 450);
      } else {
        this._sessionListService.onUserListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          this.rows = response;
          this.tempData = this.rows;
          console.log(this.rows);
          this.rows = this.filterSession();
        });
      }
    });
  }

  filterSession() {
    return this.rows.filter(row => {
      var match;
      if (this.urlLastValue == 'quick_sessions') {
        console.log(row.type.toLowerCase().indexOf('quicksession'));
        match = row.type.toLowerCase().indexOf('quicksession') !== -1;
      } else if (this.urlLastValue == 'scheduled_sessions') {
        console.log(row.type.toLowerCase().indexOf('scheduledsession'));
        match = row.type.toLowerCase().indexOf('scheduledsession') !== -1;
      } else if (this.urlLastValue == 'live_sessions') {
        console.log(row.type.toLowerCase().indexOf('scheduledsession'));
        match = row.type.toLowerCase().indexOf('livesession') !== -1;
      }
      return match;
    });
  }

  deleteSession(session) {
    this.toggleSidebar('new-sessions-sidebar');
    setTimeout(() => {
      this._sessionListService.onSessionSelected.next(session);
    }, 500);
  }

  editSession(session) {
    this.toggleSidebar('new-sessions-sidebar');
    setTimeout(() => {
      this._sessionListService.onSessionSelected.next(session);
    }, 250);
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
