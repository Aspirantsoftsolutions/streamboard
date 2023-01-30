import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { InvoicePreviewService } from 'app/main/apps/invoice/invoice-preview/invoice-preview.service';
import { CommonService } from '../../user/common.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.service.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoicePreviewComponent implements OnInit, OnDestroy {
  // public
  public apiData;
  public urlLastValue;
  public url = this.router.url;
  public sidebarToggleRef = false;
  public paymentSidebarToggle = false;
  public paymentDetailss = {
    totalDue: '$12,110.55',
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905'
  };
  public date = new Date();
  public dueDate = new Date().setDate(new Date().getDate() + 30);
  public invoiceForm: FormGroup;
  public isEditInvoice = false;
  public invoice;
  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {InvoicePreviewService} _invoicePreviewService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private router: Router,
    private _invoicePreviewService: InvoicePreviewService,
    private _coreSidebarService: CoreSidebarService,
    private commonService: CommonService,
    private toaster: ToastrService,
    private fb: FormBuilder
  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.invoiceForm = this.fb.group({
      to: ['', Validators.required],
      paymentDetails: this.fb.group({
        due: ['', Validators.required],
        bankName: ['', Validators.required],
        country: ['', Validators.required],
        iban: ['', Validators.required],
        swift: ['', Validators.required],
      }),
      tasks: this.fb.array([this.newTask()], Validators.required),
      salePerson: ['', Validators.required],
      breakup: this.fb.group({
        subTotal: ['', Validators.required],
        discount: ['', Validators.required],
        tax: ['', Validators.required],
        total: ['', Validators.required],
      })
    });
  }

  get tasks(): FormArray {
    return this.invoiceForm.get("tasks") as FormArray
  }


  newTask() {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      rate: ['', Validators.required],
      hours: ['', Validators.required],
      total: ['', Validators.required],
    })
  }

  addNewTask() {
    this.tasks.push(this.newTask());
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._invoicePreviewService.onInvoicPreviewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.apiData = response;
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

  sendInvoice() {
    this.commonService.sendInvoice().subscribe((res) => {
      this.toaster.success('👋 successfully sent invoice.', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }, err => {
      this.toaster.error(err.message, 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    })
  }

  saveInvoice() {
    console.log(this.invoiceForm.value);
    this.invoice = this.invoiceForm.value;
  }

  editInvoice() {
    this.isEditInvoice = !this.isEditInvoice;

  }
}
