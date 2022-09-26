import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../common.service';
import { ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { ToastrService } from 'ngx-toastr';
import { startWith } from "rxjs/operators";
import { protectedResources } from '../../sso/auth-config';
import { UserViewService } from '../../user-view/user-view.service';
import { GraphService, ProviderOptions } from '../../sso/graph.service';
@Component({
    selector: 'app-device-groups',
    templateUrl: 'device-groups.component.html',
    styleUrls: ['./device-groups.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DeviceGroups implements OnInit {
    id: string = '';
    devices = [];
    deviceGroups = [];
    public sidebarToggleRef = false;
    public modalRef;
    public rows;
    public selectedOption = 10;
    public ColumnMode = ColumnMode;
    public temp = [];
    public previousRoleFilter = '';
    public previousPlanFilter = '';
    public previousStatusFilter = '';
    public emailInvite = '';
    disabled = true;
    public selectRole: any = [
        { name: 'All', value: '' },
        { name: 'School', value: 'School' },
        { name: 'Teacher', value: 'Teacher' },
        { name: 'Student', value: 'Student' },
        { name: 'Class', value: 'Class' }
    ];

    public selectPlan: any = [
        { name: 'All', value: '' },
        { name: 'Basic', value: 'Basic' },
        { name: 'Premium', value: 'Premium' },
        { name: 'Enterprise', value: 'Enterprise' },
    ];

    public selectStatus: any = [
        { name: 'All', value: '' },
        // { name: 'Pending', value: 'Pending' },
        { name: 'Active', value: 'Active' },
        { name: 'Inactive', value: 'Inactive' }
    ];

    public selectedRole = [];
    public selectedPlan = [];
    public selectedStatus = [];
    public searchValue = '';
    public isDeviceSelected = false;

    // Decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;

    // Private
    private tempData = [];
    private _unsubscribeAll: Subject<any>;
    public chkBoxSelected = [];
    public SelectionType = SelectionType;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     * @param {UserListService} _userListService
     * @param {CoreSidebarService} _coreSidebarService
     */
    constructor(
        private _commonService: CommonService,
        private modalService: NgbModal,
        private _coreSidebarService: CoreSidebarService,
        private _coreConfigService: CoreConfigService,
        private authService: MsalService,
        private userService: UserViewService,
        private graphService: GraphService,
        private _toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {
        this._unsubscribeAll = new Subject();
        this.route.params.subscribe((params) => {
            this.id = params['id'];
            this.getDevices();
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
        // this.selectedRole = this.selectRole[0];
        // this.selectedPlan = this.selectPlan[0];
        // this.selectedStatus = this.selectStatus[0];

        const val = event.target.value.toLowerCase();

        // Filter Our Data
        const temp = this.tempData.filter(function (d) {
            return d.device.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // Update The Rows
        this.rows = temp;
        // Whenever The Filter Changes, Always Go Back To The First Page
        this.table.offset = 0;
    }

    openInvite(modalForm) {
        this.modalRef = this.modalService.open(modalForm);
    }

    sendInvite(modal, modalForm) {
        console.log(this.modalRef);
        let value = this.modalRef._contentRef;
        console.log(this.emailInvite);
        this._commonService.sendInvitationEmail(this.emailInvite);
        modal.close('Accept click');
        // // Display welcome toast!
        setTimeout(() => {
            this._toastrService.success(
                'Successfully invited  🎉',
                '👋 !',
                { toastClass: 'toast ngx-toastr', closeButton: true }
            );
        }, 1000);
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        setTimeout(() => {
            this._commonService.onUserEditListChanged.next(null);
        }, 200);
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    statusChange(id, status): void {
        this._commonService.updateUserStatus(!status, id).then((response) => {
            this._toastrService.success('Deleted device successfully');
            this.getDevices();
        }, () => {
            this._toastrService.error('Something bad happened');
        });
    }

    deleteDeviceFromGroup(deviceId) {
        this._commonService.deleteDeviceFromGroup(this.id, deviceId).subscribe((response) => {
            console.log(response);
            this.getDevices();
        });
    }

    changeSubscriptionType(plan, id) {
        this._commonService.updateSchoolSubscription(plan, id).then((response) => {
            this.getDevices();
        });
    }

    toggleSidebarEdit(name, row): void {
        setTimeout(() => {
            this._commonService.onUserEditListChanged.next(row);
        }, 200);
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
        // console.log('id:', id);
        // this._commonService.getDataTableRows().then((response: any) => {
        //   response.map(row => {
        //     if (row.userId == id) {
        //       console.log('current row', row);
        //       setTimeout(() => {
        //         this._commonService.onUserEditListChanged.next(row);
        //       }, 200);
        //       this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
        //     }
        //   });
        // }, (error) => {
        //   console.log('res set error:', error);
        // });
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
        debugger
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
            // const isPartialNameMatch = row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
            // const isPartialGenderMatch = row.plan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
            const isPartialStatusMatch = row.status.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
            // return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch;
            return isPartialStatusMatch;
        });
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        this._commonService.onDevicesUpdates.pipe(startWith(1)).subscribe((res) => {
            this.getDevices();
        });
    }

    getDevices() {
        this._commonService.getDeviceGroup().subscribe((resp) => {
            this.deviceGroups = resp['data'];
            this.devices = this.deviceGroups.find(group => group._id === this.id)['devicesList'];
            this.rows = this.devices;
            this.tempData = this.rows;
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

    setLoginDisplay() {
        return this.authService.instance.getAllAccounts().length > 0;
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

    customChkboxOnSelect({ selected }) {

        if (selected.length > 0)
            this.isDeviceSelected = true;
        else
            this.isDeviceSelected = false;
        this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
        this.chkBoxSelected.push(...selected);
        this._commonService.devicesSelected = this.chkBoxSelected;
        this.disabled = this.chkBoxSelected.length ? false : true;
        this._commonService.onDevicesSelected.next(this.chkBoxSelected);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    sendCommand(command) {
        const devices = this.devices.map(device => device.deviceid);
        this._commonService.sendCommandToDeviceGroup(devices, command).subscribe((resp) => {
            this._toastrService.success('Command sent');
        }, err => {
            this._toastrService.error('Sending command failed');
        })
    }


}