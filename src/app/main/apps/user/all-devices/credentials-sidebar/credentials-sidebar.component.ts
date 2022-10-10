import { CommonService } from '../../common.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'credentials-groups-sidebar',
  templateUrl: './credentials-sidebar.component.html',
  //styleUrls: ['./app-device-groups.component.scss']
})
export class CredentialsSideBar implements OnInit {
  public isToUpdate = false;
  public userName = [];
  public password = [];
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
      const body = {
        "devices": this.devices,
        "userName": form.controls['userName'].value,
        "password": form.controls['password'].value
      };
      this._commonService.bulkUpdateCreds(body).subscribe((resp) => {
        this.toastr.success('Updated successfully', 'Success!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this._commonService.onDevicesUpdates.next({});
        this.toggleSidebar('credentials-groups-sidebar');
      });
    }
  }

  ngOnInit(): void {
    this._commonService.onDevicesSelected.asObservable().subscribe(response => {
      if (response != null && response.length) {
        this.devices = response.map(x => x._id);
        console.log(response, 'From device group sidebar');
      }
    });
  }

  ngOnDestroy() {
    this.isToUpdate = false;
    this.devices = [];
    this._id = '';
  }

}
