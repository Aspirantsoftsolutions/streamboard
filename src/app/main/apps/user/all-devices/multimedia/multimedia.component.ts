import { CommonService } from './../../common.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MultimediaComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject();
  public sidebarToggleRef = false;
  public modalRef;
  public rows;
  public selectedOption = 10;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public selectedStatus = [];
  public selectedDevices = [];
  public mediaURL = "";
  public mediaType = "";
  public mediaList: any;
  public deviceGroupList: any;
  public devices = [];
  public allowedmediaTypes = {
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
    image: ['image/jpeg', 'image/png', 'image/avif', 'image/bmp', 'image/gif', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/tiff', 'image/webp']
  };
  public devicesList = [];
  public classDropdownSettings;
  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };
  public endDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };
  scheduleTime: any;
  startDate = new Date().toISOString();
  endDate = new Date().toISOString();
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('endDatePicker') endDatePicker;
  constructor(
    private _commonService: CommonService,

    private _coreSidebarService: CoreSidebarService,

    private _toastrService: ToastrService,

  ) {
    // this._commonService.getDeviceList().subscribe(response => {
    //   this.devicesList = response['data'];
    // });
    // this.devicesList = this._commonService.devicesSelected;
    this.classDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'groupName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  onItemSelect(item: any) {
    const devices = this.selectedDevices.filter(x => x._id === item._id);
    if (!devices) {
      this.selectedDevices.push(item);
    }
  }
  onSelectAll(items: any) {
    this.selectedDevices = items;
  }
  onDeselect(item: any) {
    this.selectedDevices = this.selectedDevices.filter(x => x._id != item._id);
  }

  onDeselectAll(items: any) {
    this.selectedDevices = items;
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

  getDeviceGroup() {
    this._commonService.getDeviceGroup().subscribe(list => {
      this.deviceGroupList = list['data'];
    });
  }

  clearFields() {
    setTimeout(() => {
      this.startDatePicker.flatpickr.clear();
      this.endDatePicker.flatpickr.clear();
      this.scheduleTime = "";
      this.selectedStatus = [];
    }, 100);
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
      },
      "deviceGroups": this.selectedDevices,
      "startDate": this.startDatePicker.flatpickrElement.nativeElement.children[0].value,
      "endDate": this.endDatePicker.flatpickrElement.nativeElement.children[0].value,
      "triggerTime": this.scheduleTime
    }

    if (this.startDate && this.endDate && this.scheduleTime) {
      this._commonService.schedulePushNotifications(pushPayLoad).subscribe(resp => {
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
    } else {

      this._commonService.sendPushNotifications(pushPayLoad).subscribe(resp => {
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

    this.clearFields();
  }

  ngOnInit(): void {

    this._commonService.onDevicesSelected.asObservable().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response != null && response.length) {
        // this.isToUpdate = true;
        // this._id = response._id;
        // this.groupName = response.groupName;
        this.devices = response.map(x => x._id);
        console.log(response, 'From device group sidebar');

      } else {
        this.devices = [];
      }
    });

    this.getMedia();
    this.getDeviceGroup();
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
