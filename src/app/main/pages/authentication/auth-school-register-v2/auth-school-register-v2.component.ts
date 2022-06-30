import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserListService } from 'app/main/apps/user/user-list/user-list.service';

@Component({
  selector: 'app-auth-school-register-v2',
  templateUrl: './auth-school-register-v2.component.html',
  styleUrls: ['./auth-school-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthSchoolRegisterV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public sregisterForm: FormGroup;
  public submitted = false;
  public role = 'Teacher';
  // Private
  private _unsubscribeAll: Subject<any>;
  public selectedStatus = [];

  public selectStatusRegister: any = [
    { name: 'Select', value: '' },
    { name: 'Pending', value: 'Are you a teacher' },
    { name: 'Active', value: 'Are you a student' },
    { name: 'Inactive', value: 'Are you a IT Admin' }
  ];

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _authenticationService: UserListService,
    private toastr: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.sregisterForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.sregisterForm.invalid) {
    //   return;
    // }
    this._authenticationService.registerSchool(this.sregisterForm.value,"School").then((resposne) => {
      console.log('res set:', resposne);
      this._router.navigate(['/pages/authentication/login-v2']);

      let successString = Response;
      this.toastr.success('👋 Registered Created Successfully.', 'Success!', {
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

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.sregisterForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobilenumber: ['', Validators.required],
      fullname: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      itemail: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
    });
    this.selectedStatus = this.selectStatusRegister[0];

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
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
