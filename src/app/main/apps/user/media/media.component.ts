
import { CommonService } from './../common.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { Subject, async } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MsalService } from '@azure/msal-angular';
import { UserViewService } from '../user-view/user-view.service';
import { GraphService, ProviderOptions } from '../sso/graph.service';
import { InteractionType } from '@azure/msal-browser';
import { protectedResources } from '../../../../auth-config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MediaComponent implements OnInit {

  public sidebarToggleRef = false;
  public modalRef;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public mediaList: any;
  public allowedmediaTypes = {
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
    image: ['image/jpeg', 'image/png', 'image/avif', 'image/bmp', 'image/gif', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/tiff', 'image/webp']
  };
  constructor(
    private _commonService: CommonService,
    private modalService: NgbModal,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private authService: MsalService,
    private userService: UserViewService,
    private graphService: GraphService,
    private _toastrService: ToastrService,

  ) {

  }

  toggleSidebar(name): void {
    setTimeout(() => {
      this._commonService.onUserEditListChanged.next(null);
    }, 200);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  toggleSidebarEdit(name, id): void {
    setTimeout(() => {
      this._commonService.onUserEditListChanged.next(null);
    }, 200);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();

  }

  ngOnInit(): void {
    this.getMedia();
  }

  getMedia() {
    this._commonService.getMediaList().subscribe(list => {
      this.mediaList = list['data'];
    });
  }

  closeUploadModal(msg) {
    this._coreSidebarService.getSidebarRegistry('app-uploadmedia-sidebar').toggleOpen();
    this.getMedia();
  }

  deleteMedia(media) {
    this._commonService.deleteMedia(media._id).subscribe(() => {
      this._toastrService.success('👋 Media deleted successfully', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
      this.getMedia();
    }, err => {
      console.log(err);
      this._toastrService.error('something bad happened', 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    })
  }

  getMediaType(type) {
    if (this.allowedmediaTypes.video.includes(type)) {
      return 'video'
    }

    if (this.allowedmediaTypes.audio.includes(type)) {
      return 'audio'
    }

    if (this.allowedmediaTypes.image.includes(type)) {
      return 'image'
    }
  }

}
