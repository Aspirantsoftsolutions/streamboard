import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { UserListService } from '../user-list.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {
  public firstName;
  public lastName;
  public email;
  public mobilenumber;
  public role = "Organisation";
  public plan = "Basic";
  public isToUpdate = false;
  public userId;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _userListService: UserListService,
    private _commonService: CommonService,
    public translate: TranslateService
    ) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      console.log('res cms', response);
      if (response != null) {
        this.isToUpdate = true;
        this.userId = response.userId;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.email = response.email;
        this.mobilenumber = response.mobile;
        this.role = response.role;
      } else {
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
        this._commonService.updateProfile(form.value, this.userId).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 updated Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._userListService.getDataTableRows();
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
        this._userListService.setUser(form.value).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 User Created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._userListService.getDataTableRows();
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
      this.toggleSidebar('new-user-sidebar');
    }
  }

  ngOnInit(): void { }
}
