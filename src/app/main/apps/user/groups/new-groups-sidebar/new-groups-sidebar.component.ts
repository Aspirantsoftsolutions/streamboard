import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { GroupsListService } from '../groups-list.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-new-groups-sidebar',
  templateUrl: './new-groups-sidebar.component.html'
})
export class NewGroupsSidebarComponent implements OnInit {
  public fullname;
  public email;
  public isToUpdate = false;
  public groupId;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _userListService: GroupsListService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      if (response != null) {
        this.isToUpdate = true;
        console.log(response);
        this.fullname = response.username!;
        this.email = response.email;
        this.groupId = response.userId;
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
    // this._userListService.classRows = null;
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
        this._commonService.updateGroup(form.value, this.groupId).then((resposne) => {
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
        this._userListService.setUser(form.value).then((resposne: any) => {
          console.log('res set:', resposne);
          let successString = resposne;
          if (this._userListService.classRows != null) {
            this._userListService.classRows.map(row => {
              console.log('current rows id', row.userId);
              this._userListService.setUserClass(resposne.data.userId, row.userId).then((response) => {
                console.log('res udpate:', response);
                // let successString = response;
              }, (error) => {
                console.log('res set error:', error);
                let errorString = error;
              });
            });
          }


          this.toastr.success('👋 User Created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          if (this._userListService.classRows == null)
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
      
      this.toggleSidebar('new-groups-sidebar');
    }
  }

  ngOnInit(): void {}
}
