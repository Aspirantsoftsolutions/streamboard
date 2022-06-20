import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { CommonService } from 'app/main/apps/user/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public notificationsForm: FormGroup;
  public submitted = false;
  public url = this._router.url;
  // Private
  private _unsubscribeAll: Subject<any>;
  private urlLastValue = "";
  public allUsers = [];
  public allTeachers = [];
  public allStudents = [];
  public allSchools = [];
  guestList;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _commonService: CommonService,
    private _coreConfigService: CoreConfigService,
    private toastr: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder) {
    this._unsubscribeAll = new Subject();

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.notificationsForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;


    this._commonService.sendNotifications(this.notificationsForm.value).then((resposne) => {
      console.log('res set:', resposne);

      let successString = Response;
      this.toastr.success('👋 Notifications Send Successfully.', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
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

  isAdmin() {
    return this._commonService.getCurrentUser().role == 'Admin';
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.notificationsForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this._commonService.getAllUsers().then((resposne) => {
      this.allUsers = resposne;
    }, (error) => {
        
    });

    this._commonService.getAllTeachers().then((resposne) => {
      this.allTeachers = resposne;
    }, (error) => {

    });

    this._commonService.getAllStudents().then((resposne) => {
      this.allStudents = resposne;
    }, (error) => {

    });

    this._commonService.getDataTableRows().then((resposne) => {
      this.allSchools = resposne;
    }, (error) => {

    });



    this.dropdownSettings = {
      singleSelection: false,
      idField: 'userId',
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
