import { AuthenticationService } from './../../../../../auth/service/authentication.service';
import { SessionsListService } from './../sessions-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-sessions-sidebar',
  templateUrl: './new-sessions-sidebar.component.html'
})
export class NewSessionsSidebarComponent implements OnInit {
  public description;
  public username;
  public email;
  public groupId;
  private currentUser;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _userListService: SessionsListService,
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
      this.toggleSidebar('new-user-sidebar');
    }
  }

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe(x => {
      console.log('current user here:', x);
      this.currentUser = x;
    });
  }
}
