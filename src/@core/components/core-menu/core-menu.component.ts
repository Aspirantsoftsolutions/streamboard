import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '../../../app/main/apps/user/common.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;
  plans = [];
  public featureKeys = {
    "Geogebra": "isGeoGebraEnable",
    "Creative tools": "isCreativeToolsEnable",
    "New page": "isNewPageEnable",
    "Background": "isBackgroundEnable",
    "Save .SB File": "isSaveSBEnable",
    "Import": "isImportEnable",
    "Handwriting": "isHandWritingEnable",
    "Immersive reader": "isImmersiveReaderEnable",
    "Google drive": "isGoogleDriveEnable",
    "one drive": "isOneDriveEnable",
    "screenshot": "isScreenshotEnable",
    "recording": "isRecordingEnable",
    "QR code": "isQRCodeEnable",
    "participate mode": "isParticipateModeEnable",
    "export pdf": "isExportpdfEnable",
    "Magic draw": "isMagicDrawEnable",
    "Session interaction": "isSessionInteractionEnable",
    "Student attendance": "isStudentAttendanceEnable",
    "SSO integration": "isSSOIntegrationEnable",
    "Device management": "isDeviceManagementEnable",
    "QR login": "isQRloginEnable",
    "Phet": "isPhetEnable",
    "Dashboard": "isDashboardEnable",
    "Calendar": "isCalendarEnable",
    "Collaboration Class": "isCollaborationClassEnable",
    "All Users": "isAllUsersEnable",
    "WhiteBoard": "isWhiteBoardEnable",
    "School": "isSchoolEnable",
    "Notifications": "isNotificationsEnable"
  }
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   * @param {CommonService} _commonService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef, 
    private _coreMenuService: CoreMenuService, 
    private _commonService: CommonService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.currentUser = this._commonService.getCurrentUser();
    this._commonService.getPlans().subscribe((resp) => {
      this.plans = resp['data'].plans[this.currentUser.plan.toLowerCase()];
      Object.keys(this.featureKeys).forEach(key => {
        if (this.currentUser[this.featureKeys[key]] && this.plans.indexOf(key) === -1) {
          this.plans.push(key)
        }
      });
      console.log('My Plans', this.plans);
    });
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();

    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._coreMenuService.currentUser;

      // Load menu
      this.menu = this._coreMenuService.getCurrentMenu();
      console.log('Sweety', this.menu);

      this._changeDetectorRef.markForCheck();
    });
  }
}
