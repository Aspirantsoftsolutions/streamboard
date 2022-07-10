import { ClassesListService } from './../../classes/classes-list.service';
import { TeachersListService } from '../teachers-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommonService } from '../../common.service';

@Component({
  selector: 'link-class-sidebar',
  templateUrl: './link-class-sidebar.component.html'
})
export class LinkClassSidebarComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  public classes;
  public class;
  public userId;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _teacherService: TeachersListService,
    private _classListService: ClassesListService,
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
      console.log('class,', this.class);
      this._commonService.linkClass(userIds, this.class).then((resposne) => {
        console.log('res set:', resposne);
        let successString = Response;
        this.toastr.success('👋 updated Successfully.', 'Success!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
        this._classListService.getDataTableRows();
      }, (error) => {
        console.log('res set error:', error);
        let errorString = error;
        this.toastr.error(errorString, 'Error!', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
      }
      );
      this.toggleSidebar('link-class-sidebar');
    }
  }

  ngOnInit(): void {
    this._classListService.getDataTableRows().then((resposne) => {
      console.log('res set classRows:', resposne);
      this.classes = resposne;
      console.log('classRows:', this.classes);
    }, (error) => {
      console.log('res set error:', error);
    });


  }

}
