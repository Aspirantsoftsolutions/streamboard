import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { PaymentsListService } from './payments-list.service';
import { CommonService } from '../common.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentsListComponent implements OnInit {
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

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _userListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _userListService: PaymentsListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _commonService: CommonService,
    public translate: TranslateService
  ) {
    this._unsubscribeAll = new Subject();
    this._commonService.onPaymentsChanged.subscribe(() => {
      this.init();
    });
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
      return (d.comments !== undefined && d.comments.toLowerCase().indexOf(val) !== -1) || (d.clientId.fullName !== undefined && d.clientId.fullName.toLowerCase().indexOf(val) !== -1) || (d.clientId.firstName !== undefined && d.clientId.firstName.toLowerCase().indexOf(val) !== -1) || (d.clientId.email !== undefined && d.clientId.email.toLowerCase().indexOf(val) !== -1)|| !val;
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
      const isPartialGenderMatch = row.currentPlan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
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
    this.init();
  }

  init() {
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this._commonService.getPaymentHistory().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp) => {
            this.rows = resp['data'];
            this.tempData = this.rows;
          });
        }, 450);
      } else {
        this._commonService.getPaymentHistory().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp) => {
          this.rows = resp['data'];
          this.tempData = this.rows;
        });
      }
    });
  }

  addPayment() {
    this.toggleSidebar('new-payment-sidebar');
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
