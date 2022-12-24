import { Component, OnInit } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-send-invoice-sidebar-preview',
  templateUrl: './send-invoice-sidebar-preview.component.html'
})
export class SendInvoiceSidebarPreviewComponent implements OnInit {
  constructor(private _coreSidebarService: CoreSidebarService, public translate: TranslateService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {}
}
