import { SchoolsListService } from './../schools-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-new-schools-sidebar',
  templateUrl: './new-schools-sidebar.component.html'
})
export class NewSchoolsSidebarComponent implements OnInit {
  public schoolName;
  public username;
  public email;
  public emailOwner;
  public schoolAddress;
  public schoolLocation;
  public schoolNumber;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _userListService: SchoolsListService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      console.log(response);
      // this.username = response.username;
      this.schoolName = response.username;
      this.email = response.email;
      this.schoolAddress = response.address!;
      this.schoolNumber = response.mobile;
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
      this._userListService.setUser(form.value).then((resposne) => {
        console.log('res set:', resposne);
        let successString = Response;
        this.toastr.success('👋 School Created Successfully.', 'Success!', {
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
      this.toggleSidebar('new-schools-sidebar');
    }
  }

  ngOnInit(): void {}
}
