import { CommonService } from '../../common.service';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-device-groups-sidebar',
  templateUrl: './device-groups.component.html',
  //styleUrls: ['./app-device-groups.component.scss']
})
export class DeviceGroupSideBar implements OnInit {
  public isToUpdate = false;
  public groupName = '';
  public devices = [];
  public _id;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _commonService: CommonService) {
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
      console.log(form);
      if (this.isToUpdate) {
        this._commonService.updateDevice(this._id, form.value).subscribe((resposne) => {
          console.log('res set:', resposne);
          this.toastr.success('👋 device group name updated Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
        }, (error) => {
          console.log('res set error:', error);
          let errorString = error;
          this.toastr.error(errorString, 'Error!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
        }
        );
      } else {
        const devicesList = this._commonService.devicesSelected.map(x => x._id);
        this._commonService.createDeviceGroup(devicesList, this.groupName).subscribe((resposne) => {
          console.log('res set:', resposne);
          this.toastr.success('👋 device group Created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._commonService.getDataTableRows();
        }, (error) => {
          console.log('res set error:', error);
          let errorString = error;
          this.toastr.error(errorString, 'Error!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
        }
        );
      }

      this.toggleSidebar('device-groups-sidebar');
    }
  }

  ngOnInit(): void {
    this._commonService.onDevicesSelected.asObservable().subscribe(response => {
      console.log('groupsss', response);
      if (response != null) {
        // this.isToUpdate = true;
        // this._id = response._id;
        // this.groupName = response.groupName;
        this.devices = response.map(x => x._id);
        console.log(response, 'From device group sidebar');

      } else {
        this.isToUpdate = false;
      }
      if (response != null && response.data != null && response.data.length == 0) {
        this.isToUpdate = false;
      }

    });
  }

}
