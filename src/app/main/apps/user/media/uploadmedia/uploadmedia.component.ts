import { CommonService } from './../../common.service';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-uploadmedia',
  templateUrl: './uploadmedia.component.html',
 // styleUrls: ['./uploadmedia.component.scss'],
})
export class UploadmediaComponent implements OnInit {

  public isToUpdate = false;
  public fileObj: File;
  public imageUrl: string;
  public loading = false;
  @Output() uploadEve = new EventEmitter<any>();
  constructor(private _coreSidebarService: CoreSidebarService,
    private toastr: ToastrService,
    private _commonService: CommonService) {
    this._commonService.onUserEditListChanged.subscribe(response => {

    });

  }
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {

    this.toggleSidebar('uploadmedia-sidebar');

  }

  ngOnInit(): void { }

  onImagePicked(event: Event): void {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.fileObj = FILE;
  }

  onImageUpload() {
    const fileForm = new FormData();
    this.loading = true;
    fileForm.append('image', this.fileObj);
    this._commonService.fileUpload(fileForm).subscribe(res => {
      this.imageUrl = res['image'];
      this.loading = false;
      this.uploadEve.emit('success');
    });
  }
}
