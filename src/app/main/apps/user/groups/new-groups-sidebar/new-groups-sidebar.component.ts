import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { GroupsListService } from '../groups-list.service';
import { CommonService } from '../../common.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-new-groups-sidebar',
  templateUrl: './new-groups-sidebar.component.html'
})
export class NewGroupsSidebarComponent implements OnInit {
  public fullname;
  public id;
  public isToUpdate = false;
  public groupId;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _groupService: GroupsListService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      if (response != null) {
        this.isToUpdate = true;
        this.fullname = response.name;
        this.id = response._id;
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
    // this._groupService.classRows = null;
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
      if (!this.id) {
        this._groupService.createGroup(form.value).then((resposne) => {
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
        this._groupService.createGroup({ ...form.value, id: this.id }).then((resposne: any) => {
          console.log('res set:', resposne);
          let successString = resposne;
          if (this._groupService.classRows != null) {
            this._groupService.classRows.map(row => {
              console.log('current rows id', row.userId);
              this._groupService.setUserClass(resposne.data.userId, row.userId).then((response) => {
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
          if (this._groupService.classRows == null)
            this._groupService.getDataTableRows();
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

  ngOnInit(): void { }
}
