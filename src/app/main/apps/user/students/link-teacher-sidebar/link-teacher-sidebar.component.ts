import { TeachersListService } from '../../teachers/teachers-list.service';
import { StudentsListService } from '../students-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonService } from '../../common.service';

@Component({
  selector: 'link-teacher-sidebar',
  templateUrl: './link-teacher-sidebar.component.html'
})
export class LinkTeacherSidebarComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public teachers;
  public teacher;
  public userId;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _teacherService: TeachersListService,
    private _studentListService: StudentsListService,
    private _commonService: CommonService,) {
    
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

      let response = CommonService.teacherGetList;
      let userIds = [];
      response.forEach(element => {
        if (element.checked)
          userIds.push(element.userId);
      });
      
      console.log('userid here:', userIds);

      console.log(form);
      console.log('class,', this.teacher);
      this._commonService.linkTeachers(userIds, this.teacher).then((resposne) => {
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
      this.toggleSidebar('link-teacher-sidebar');
    }
  }

  ngOnInit(): void {
    this._teacherService.getAllTeachers().then((resposne) => {
      console.log('res set classRows:', resposne);
      this.teachers = resposne;
      console.log('classRows:', this.teachers);
    }, (error) => {
      console.log('res set error:', error);
    });


  }

}
