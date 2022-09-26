import { CommonService } from './../../common.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  //styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject();
  public devices = [];
  public fullname;
  public username;
  public title;
  public email;
  public mobilenumber;
  public itemail;
  public firstname;
  public lastname;
  public address;
  public isToUpdate = false;
  public userId;
  public devicesList = [];
  public deviceGroupList = [];
  public classDropdownSettings;
  public selectedDevices = [];
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _commonService: CommonService,) {
    this.classDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'groupName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // this._commonService.getDeviceList().subscribe(response => {
    //   if (response != null) {
    //     this.devicesList = response['data'];
    //   } else {
    //     this.isToUpdate = false;
    //   }
    //   if (response != null && response['data'] != null && response['data'] == 0) {
    //     this.isToUpdate = false;
    //   }
    // });

  }


  onItemSelect(item: any) {
    const devices = this.selectedDevices.filter(x => x._id === item._id);
    if (!devices) {
      this.selectedDevices.push(item);
    }
  }
  onSelectAll(items: any) {
    this.selectedDevices = items;
  }
  onDeselect(item: any) {
    this.selectedDevices = this.selectedDevices.filter(x => x._id != item._id);
  }

  onDeselectAll(items: any) {
    this.selectedDevices = items;
  }


  getDeviceGroup() {
    this._commonService.getDeviceGroup().subscribe(list => {
      this.deviceGroupList = list['data'];
    });
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
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      // if (!this.devicesList) {
      //   this.toastr.error('something bad happened', 'Error!', {
      //     toastClass: 'toast ngx-toastr',
      //     closeButton: true
      //   });
      // }
      const pushPayLoad = {
        "data": {
          "title": form.value.title,
          "description": form.value.description
        },
        "to": this._commonService.devicesSelected.map(x => x.deviceid),
        "notification": {
          "badge": 1
        },
        "deviceGroups": this.selectedDevices
      }

      this._commonService.sendPushNotifications(pushPayLoad).subscribe(data => {
        console.log(data);
        this.toastr.success('👋 notification sent successfully', 'Success!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this._commonService.getDataTableRows();
        this.toggleSidebar('notification-sidebar');
      }, (error) => {
        console.log('res set error:', error);
        let errorString = error;
        this.toastr.error(errorString, 'Error!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      });

      // this.toggleSidebar('all-device-sidebar');
    }
  }

  ngOnInit(): void {
    this.getDeviceGroup();
    this._commonService.onDevicesSelected.asObservable().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response != null && response.length) {
        // this.isToUpdate = true;
        // this._id = response._id;
        // this.groupName = response.groupName;
        this.devices = response.map(x => x._id);
        console.log(response, 'From device group sidebar');

      } else {
        this.devices = [];
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

}
