import { CommonService } from './../../common.service';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-all-device-sidebar',
  templateUrl: './all-device-sidebar.component.html',
  //styleUrls: ['./all-device-sidebar.component.scss']
})
export class AllDeviceSidebarComponent implements OnInit {
  public isToUpdate = false;
  public deviceName = '';
  public _id;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      console.log('row', response);
      if (response != null) {
        this.isToUpdate = true;
        this._id = response._id;
        this.deviceName = response.deviceName;
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
      console.log(form);
      if (this.isToUpdate) {
        this._commonService.updateDevice(this._id, form.value).subscribe((resposne) => {
          console.log('res set:', resposne);
          this.toastr.success('👋 device name updated Successfully.', 'Success!', {
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
        this._commonService.createDevice(form.value).subscribe((resposne) => {
          console.log('res set:', resposne);
          this.toastr.success('👋 device Created Successfully.', 'Success!', {
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

      this.toggleSidebar('all-device-sidebar');
    }
  }

  ngOnInit(): void { }

}
