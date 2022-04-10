import { GradesListService } from './../../grades/grades-list.service';
import { ClassesListService } from './../../classes/classes-list.service';
import { StudentsListService } from './../students-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { TeachersListService } from '../../teachers/teachers-list.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-students-sidebar',
  templateUrl: './new-students-sidebar.component.html'
})
export class NewStudentsSidebarComponent implements OnInit {
  public fullname;
  public userNumber;
  public email;
  private _unsubscribeAll: Subject<any>;
  public classRows;
  public grades;
  public class;
  public grade;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _classListService: ClassesListService,
    private _gradeListService: GradesListService,
    private _userListService: StudentsListService,) {
    
    this._unsubscribeAll = new Subject();
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
      this.toggleSidebar('new-students-sidebar');
    }
  }

  ngOnInit(): void {
    this._classListService.getDataTableRows().then((resposne) => {
      console.log('res set classRows:', resposne);
      this.classRows = resposne;
      console.log('classRows:', this.classRows);
    }, (error) => {
      console.log('res set error:', error);
    });

    this._gradeListService.getDataTableRows().then((resposne) => {
      console.log('res set Grades:', resposne);
      this.grades = resposne;
      console.log('grades:', this.grades);
    }, (error) => {
      console.log('res set error:', error);
    });

  }

}
