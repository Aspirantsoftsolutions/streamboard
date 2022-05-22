import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { GradesListService } from '../grades-list.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-new-grades-sidebar',
  templateUrl: './new-grades-sidebar.component.html'
})
export class NewGradesSidebarComponent implements OnInit {
  public fullname;
  public username;
  public email;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _userListService: GradesListService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      console.log(response);
      this.username = response.username;
      this.fullname = response.fullName!;
      this.email = response.email;
    }); }

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

      this._userListService.setUser(form.value).then((resposne:any) => {
        console.log('res set:', resposne);
        let successString = resposne;
        // this._userListService.classRows.map(row => {
        //   console.log('current rows id', row.userId);
        //   this._userListService.setUserClass(resposne.data.userId, row.userId).then((response) => {
        //     console.log('res udpate:', response);
        //     // let successString = response;
        //   }, (error) => {
        //     console.log('res set error:', error);
        //     let errorString = error;
        //   });
        // });

        // this.toastr.success('👋 User Created Successfully.', 'Success!', {
        //   toastClass: 'toast ngx-toastr',
        //   closeButton: true
        // });
        if(this._userListService.classRows==null)
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
      this.toggleSidebar('new-grades-sidebar');
    }
  }

  ngOnInit(): void {}
}
