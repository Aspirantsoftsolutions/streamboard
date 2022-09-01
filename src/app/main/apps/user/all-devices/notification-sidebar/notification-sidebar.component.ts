import { CommonService } from './../../common.service';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit {

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
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      if (response != null) {
        this.devicesList = response;
        this.isToUpdate = true;
        this.userId = response.userId;
        this.username = response.organisation;
        this.fullname = response.fullName!;
        this.email = response.email;
        this.firstname = response.firstName!;
        this.lastname = response.lastName!;
        this.address = response.address!;
        this.itemail = response.itemail!;
        this.mobilenumber = response.mobile;
      } else {
        this.isToUpdate = false;
      }
      if (response != null && response.data != null && response.data.length == 0) {
        this.isToUpdate = false;
      }

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
      if (!this.devicesList) {
        this.toastr.error('something bad happened', 'Error!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      }
      const pushPayLoad = {
        "data": {
          "title": form.value.title,
          "description": form.value.description
        },
        "to": this.devicesList.map(x => x.deviceid),
        "notification": {
          "badge": 1
        }
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

  ngOnInit(): void { }

}
