import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CommonService } from 'app/main/apps/user/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-userProfile',
    templateUrl: 'user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
    public email;
    public mobilenumber;
    public address;
    public firstname;
    public lastname;
    public user;
    constructor(private coreSidebarService: CoreSidebarService,
        private commonService: CommonService,
        private toasterService: ToastrService) { }

    ngOnInit() {
        this.commonService.editProfile.subscribe((data) => {
            this.user = JSON.parse(localStorage.getItem('currentUser'));
            this.email = this.user.email;
            this.mobilenumber = this.user.mobile;
            this.address = this.user.location;
            this.firstname = this.user.firstName;
            this.lastname = this.user.lastName;
        });
    }

    toggleSidebar(name) {
        this.coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    submit(form) {
        this.commonService.updateSelfProfile({
            ...this.user,
            email: form.value['user-email'],
            mobile: form.value['user-number'],
            firstName: form.value['user-firstname'],
            lastName: form.value['user-lastname']
        }).then((resp) => {
            localStorage.setItem('currentUser', JSON.stringify({
                ...this.user,
                email: form.value['user-email'],
                mobile: form.value['user-number'],
                firstName: form.value['user-firstname'],
                lastName: form.value['user-lastname']
            }));

            this.toasterService.success('👋 Successfully updated profile', 'Success!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });

        }).catch((err) => {
            this.toasterService.error(err.message, 'Error!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
        })
    }
}