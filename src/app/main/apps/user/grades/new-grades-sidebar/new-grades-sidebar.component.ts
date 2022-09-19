import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { GradesListService } from '../grades-list.service';

@Component({
  selector: 'app-new-grades-sidebar',
  templateUrl: './new-grades-sidebar.component.html'
})
export class NewGradesSidebarComponent implements OnInit {
  update = false;
  name = "";
  grade: any;


  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _gradesListService: GradesListService) {
    this._gradesListService.onGradeListChanged.subscribe(response => {
      if (Object.keys(response).length) {
        this.update = true;
        this.grade = response;
        this.name = response.name;
      } else {
        this.update = false;
        this.grade = '';
        this.name = '';
      }
    });
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    // this._gradesListService.classRows = null;
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
      if (this.update) {
        this._gradesListService.updateGrade(form.value, this.grade._id).then((resposne) => {
          console.log('res set:', resposne);
          this.toastr.success('👋 updated Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._gradesListService.list.next(null);
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
        this._gradesListService.createGrade(form.value).then((resposne) => {
          console.log('res set:', resposne);
          this.toastr.success('👋 created Successfully.', 'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          this._gradesListService.list.next(null);
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
      form.reset();
      this.toggleSidebar('new-grades-sidebar');
    }
  }

  ngOnInit(): void { }
}
