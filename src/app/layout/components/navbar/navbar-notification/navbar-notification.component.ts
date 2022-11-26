import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { ToastrService } from 'ngx-toastr';

// Interface
interface notification {
  messages: [];
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  public notifications: any;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(private _notificationsService: NotificationsService,
    private _toastrService: ToastrService) { }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._notificationsService.onApiDataChange.subscribe(res => {
      this.notifications = res;
    });
  }

  markAsRead() {
    this._notificationsService.markAllAsRead().subscribe(res => {
      this._toastrService.success('👋 All Notification marked as read', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }, err => {
      console.log(err);
      this._toastrService.error('something bad happened', 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    })
  }
}
