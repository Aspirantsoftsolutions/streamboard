import { ClassesListService } from './../../classes/classes-list.service';
import { TeachersListService } from './../teachers-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-new-teachers-sidebar',
  templateUrl: './new-teachers-sidebar.component.html'
})
export class NewTeachersSidebarComponent implements OnInit {
  public firstName;
  public lastName;
  public mobileNumber;
  public email;
  public classRows;
  public class;
  public isToUpdate: boolean = false;
  public userId;
  public classDropdownSettings;
  public selectedClasses = [];

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _teacherListService: TeachersListService,
    private _classListService: ClassesListService,
    private _commonService: CommonService,) {
    this._commonService.onUserEditListChanged.subscribe(response => {
      console.log(response);
      if (response != null) {
        this.isToUpdate = true;
        this.userId = response.userId;
        this.email = response.email;
        this.firstName = response.firstName!;
        this.lastName = response.lastName!;
        this.mobileNumber = response.mobile;
      } else {
        this.isToUpdate = false;
        this.userId = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.mobileNumber = '';
      }
    });


    this.classDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'className',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onItemSelect(item: any) {
    this.selectedClasses.push(item);
  }
  onSelectAll(items: any) {
    console.log(items);
    this.selectedClasses = items;
  }
  onDeselect(item: any) {
    this.selectedClasses = this.selectedClasses.filter(x => x._id != item._id);
    console.log(this.selectedClasses);
  }

  onDeselectAll(items: any) {
    this.selectedClasses = items;
  }
  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    var school = this._commonService.getCurrentUser();
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
          this._teacherListService.getAllTeachers();
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
        let user = this._commonService.getCurrentUser();
        this._teacherListService.setTeacher(form.value, user.userId).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 Teacher Created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._teacherListService.getAllTeachers();
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
