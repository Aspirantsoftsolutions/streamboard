import { ClassesListService } from './../../classes/classes-list.service';
import { TeachersListService } from './../teachers-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-teachers-sidebar',
  templateUrl: './new-teachers-sidebar.component.html'
})
export class NewTeachersSidebarComponent implements OnInit {
  public fullname;
  public mobileNumber;
  public email;
  public classRows;
  public class;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _userListService: TeachersListService,
    private _classListService: ClassesListService,) { }

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
      this.toggleSidebar('new-teachers-sidebar');
    }
  }

  ngOnInit(): void {
    this._classListService.getDataTableRows().then((resposne) => {
      console.log('res set teacher:', resposne);
      this.classRows = resposne;
      console.log('teachers:', this.classRows);
    }, (error) => {
      console.log('res set error:', error);
    }
    );
  }

}
