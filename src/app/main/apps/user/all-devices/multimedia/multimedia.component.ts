import { CommonService } from './../../common.service';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { DatePickerI18nComponent } from 'app/main/forms/form-elements/date-time-picker/date-picker-i18n/date-picker-i18n.component';


@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
 // styleUrls: ['./multimedia.component.scss']
})
export class MultimediaComponent implements OnInit {

  public sidebarToggleRef = false;
  public modalRef;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public selectedStatus = [];
  public mediaURL = "";
  public mediaType = "";
  public mediaList: any;
  public allowedmediaTypes = {
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
    image: ['image/jpeg', 'image/png', 'image/avif', 'image/bmp', 'image/gif', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/tiff', 'image/webp']
  };
  public devicesList = [];
  constructor(
    private _commonService: CommonService,

    private _coreSidebarService: CoreSidebarService,

    private _toastrService: ToastrService,

  ) {
    // this._commonService.getDeviceList().subscribe(response => {
    //   this.devicesList = response['data'];
    // });
    // this.devicesList = this._commonService.devicesSelected;
  }

  toggleSidebar(name): void {
    setTimeout(() => {
      this._commonService.onUserEditListChanged.next(null);
    }, 200);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  selectedMedia(event) {
    this.mediaURL = event.location;
    this.mediaType = event.type;
  }


  toggleSidebarEdit(name, id): void {
    setTimeout(() => {
      this._commonService.onUserEditListChanged.next(null);
    }, 200);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();

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

  getMedia() {
    this._commonService.getMediaList().subscribe(list => {
      this.mediaList = list['data'];
    });
  }

  broadcastMedia() {
    const pushPayLoad = {
      "data": {
        "title": '',
        "description": '',
        "image_url": this.getMediaType(this.mediaType) === 'image' ? this.mediaURL : '',
        "video_url": this.getMediaType(this.mediaType) === 'video' ? this.mediaURL : '',
      },
      "to": this._commonService.devicesSelected.map(x => x.deviceid),
      "notification": {
        "badge": 1
      }
    }
    this._commonService.sendPushNotifications(pushPayLoad).subscribe(resp => {
      console.log(resp);
      this._toastrService.success('👋 notification sent successfully', 'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
      this.toggleSidebar('app-multimedia-sidebar');
    }, err => {
      console.log(err);
      this._toastrService.error('something bad happened', 'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    })
  }

  ngOnInit(): void {
    this.getMedia();
  }
}
