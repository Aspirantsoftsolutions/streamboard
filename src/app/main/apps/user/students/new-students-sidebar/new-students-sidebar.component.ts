import { TeachersListService } from './../../teachers/teachers-list.service';
import { GradesListService } from './../../grades/grades-list.service';
import { ClassesListService } from './../../classes/classes-list.service';
import { StudentsListService } from './../students-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-new-students-sidebar',
  templateUrl: './new-students-sidebar.component.html'
})
export class NewStudentsSidebarComponent implements OnInit {
  public lastName;
  public firstName;
  public userNumber;
  public email;
  private _unsubscribeAll: Subject<any>;
  public classes;
  public grades;
  public class;
  public grade;
  public isToUpdate = false;
  public userId;
  public teachers;
  public teacherDropdownSettings;
  public selectedTeachers = [];

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _classListService: ClassesListService,
    private _gradeListService: GradesListService,
    private _teacherService: TeachersListService,
    private _studentListService: StudentsListService,) {

    this._studentListService.onStudentListChanged.subscribe(response => {
      if (response != null) {
        this.isToUpdate = true;
        this.userId = response.userId;
        this.email = response.email;
        this.firstName = response.firstName!;
        this.lastName = response.lastName!;
        this.userNumber = response.mobile;
        this.class = response.classes;
        this.grade = response.grades;
        this.selectedTeachers = response.teachers;
      } else {
        this.isToUpdate = false;
      }

    });

    this.teacherDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
      if (this.isToUpdate) {
        console.log('class,', this.class);
        this._studentListService.updateStudentProfile(form.value, this.userId, this.class).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 updated Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._studentListService.getAllStudents();
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
        var school = this._studentListService.getCurrentUser();
        this._studentListService.setStudent(form.value, school.userId).then((resposne) => {
          console.log('res set:', resposne);
          let successString = Response;
          this.toastr.success('👋 User Created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._studentListService.getAllStudents();
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
      this.toggleSidebar('new-students-sidebar');
    }
  }


  onItemSelect(item: any) {
    const teacher = this.selectedTeachers.filter(x => x._id === item._id);
    if (!teacher) {
      this.selectedTeachers.push(item);
    }
  }
  onSelectAll(items: any) {
    console.log(items);
    this.selectedTeachers = items;
  }
  onDeselect(item: any) {
    this.selectedTeachers = this.selectedTeachers.filter(x => x._id != item._id);
    console.log(this.selectedTeachers);
  }

  onDeselectAll(items: any) {
    this.selectedTeachers = items;
  }


  ngOnInit(): void {
    this._classListService.getDataTableRows().then((resposne) => {
      console.log('res set classRows:', resposne);
      this.classes = resposne;
      console.log('classRows:', this.classes);
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
    this._teacherService.getAllTeachers().then((resposne) => {
      console.log('res set classRows:', resposne);
      this.teachers = resposne;
      console.log('classRows:', this.teachers);
    }, (error) => {
      console.log('res set error:', error);
    });

  }

}
