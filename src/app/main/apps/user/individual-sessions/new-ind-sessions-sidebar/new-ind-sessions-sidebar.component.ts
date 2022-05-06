import { GroupsListService } from './../../groups/groups-list.service';
import { AuthenticationService } from './../../../../../auth/service/authentication.service';
import { IndSessionsListService } from './../ind-sessions-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-ind-sessions-sidebar',
  templateUrl: './new-ind-sessions-sidebar.component.html'
})
export class NewIndSessionsSidebarComponent implements OnInit {
  public description;
  public username;
  public email;
  public group;
  private currentUser;
  public title;
  public emailids;
  public groupRows;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _groupListService: GroupsListService,
    private _userListService: IndSessionsListService,
    private _authenticationService:AuthenticationService) {
    
 
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
      form.value['teacherId'] = this.currentUser.userId;
      console.log(form);
      this._userListService.createSession(form.value).then((resposne) => {
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
      this.toggleSidebar('new-ind-sessions-sidebar');
    }
  }

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe(x => {
      console.log('current user here:', x);
      this.currentUser = x;
    });

    this._groupListService.getDataTableRows().then((resposne) => {
      console.log('res set groupRows:', resposne);
      this.groupRows = resposne;
      console.log('groupRows:', this.groupRows);
    }, (error) => {
      console.log('res set error:', error);

    }
    );

  }
}
