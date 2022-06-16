import { GroupsListService } from './../../groups/groups-list.service';
import { AuthenticationService } from './../../../../../auth/service/authentication.service';
import { SessionsListService } from './../sessions-list.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-sessions-sidebar',
  templateUrl: './new-sessions-sidebar.component.html'
})
export class NewSessionsSidebarComponent implements OnInit {
  public description;
  public username;
  public email;
  public group;
  private currentUser;
  public title;
  public emailids;
  public groupRows;
  // Basic Date Picker
  public basicDPdataS: NgbDateStruct;
  public basicDPdataE: NgbDateStruct;
  public url = this.router.url;
  public urlLastValue;
  public basicTP;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _groupListService: GroupsListService,
    private router: Router,
    private _userListService: SessionsListService,
    private _authenticationService:AuthenticationService) {
    
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
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
      var type = "";
      if (this.urlLastValue == 'quick_sessions') {
        type = "quickSession";
      } else if (this.urlLastValue == 'live_sessions') {
        type = "liveSession";
      } else if (this.urlLastValue == 'scheduled_sessions') {
        type = "ScheduledSession";
      }
      form.value['type'] = type;
      form.value['start'] = this.basicDPdataS.day + "-" + this.basicDPdataS.month + "-" + this.basicDPdataS.year;
      form.value['end'] = this.basicDPdataE.day + "-" + this.basicDPdataE.month + "-" + this.basicDPdataE.year;
      if (!form.value['group']) {
        form.value['group'] = "x";
      }
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
      this.toggleSidebar('new-sessions-sidebar');
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
