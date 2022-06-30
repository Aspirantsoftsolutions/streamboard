import { CommonService } from './../../common.service';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-client-sidebar',
  templateUrl: './new-client-sidebar.component.html'
})
export class NewClientSidebarComponent implements OnInit {
  public fullname;
  public username;
  public email;
  public mobilenumber;
  public itemail;
  public firstname;
  public lastname;
  public address;
  public isToUpdate = false;
  public userId;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      console.log('res cms', response);
      if (response != null) {
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
      if (response != null && response.data!=null && response.data.length==0) {
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
        this._commonService.updateProfile(form.value,this.userId).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 updated Successfully.', 'Success!', {
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
      } else {
        this._commonService.setUser(form.value).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 User Created Successfully.', 'Success!', {
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
     
      this.toggleSidebar('new-client-sidebar');
    }
  }

  ngOnInit(): void {}
}
