import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-new-payment-sidebar',
  templateUrl: './new-payment-sidebar.component.html'
})
export class NewPaymentSidebarComponent implements OnInit {
  public fullName;
  public username;
  public email;
  public clients = [];
  public disableFields = true;
  public client;
  public amount;
  public comments;
  public paymentType;
  public date = new Date().toLocaleDateString();
  public dateOptions = {
    altInput: true,
    mode: "single",
    altInputClass:
      "form-control flat-picker flatpickr-input invoice-edit-input",
    enableTime: false,
  };

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _commonService: CommonService) { }

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
  submit(form: FormGroup) {
    if (form.valid) {
      this._commonService.savePayment({ clientId: this.client._id, ...form.value }).subscribe((resp) => {
        form.reset();
        this._commonService.onPaymentsChanged.next({});
        this.toggleSidebar('new-payment-sidebar')
      });
    }
  }

  ngOnInit(): void {
    this._commonService.getDataTableRows().then((data) => {
      this.clients = data;
    });
  }

  updateClient(value) {
    this.client = this.clients.find(client => client.email == value);
    this.fullName = this.client.fullName;
    this.email = this.client.email;
    this.username = this.client.username;
  }
}
