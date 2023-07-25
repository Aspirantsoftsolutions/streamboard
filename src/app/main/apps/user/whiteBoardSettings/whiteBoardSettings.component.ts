import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';

@Component({
    selector: 'whiteBoard-settings',
    templateUrl: 'whiteBoardSettings.component.html',
    styleUrls: ['whiteBoardSettings.component.scss']
})

export class whiteBoardSettingsComponent {
    public features = [];
    public basic = [];
    public enterprise = [];
    public custom = [];
    public premium = [];
    public clientList = [];
    public client;
    public clientAssignedFeatures = [];
    public selectedTab;
    public selectedClient;
    public featureKeys = {
        isGeoGebraEnable: 'Geogebra',
        isCreativeToolsEnable: 'Creative tools',
        isNewPageEnable: 'New page',
        isSaveSBEnable: 'Save .SB File',
        isImportEnable: 'Import',
        isBackgroundEnable: 'Background',
        isHandWritingEnable: 'Handwriting',
        isImmersiveReaderEnable: 'Immersive reader',
        isGoogleDriveEnable: 'Google drive',
        isOneDriveEnable: 'one drive',
        isScreenshotEnable: 'screenshot',
        isRecordingEnable: 'recording',
        isQRCodeEnable: 'QR code',
        isParticipateModeEnable: 'participate mode',
        isExportpdfEnable: 'export pdf',
        isMagicDrawEnable: 'Magic draw',
        isSessionInteractionEnable: 'Session interaction',
        isStudentAttendanceEnable: 'Student attendance',
        isSSOIntegrationEnable: 'SSO integration',
        isDeviceManagementEnable: 'Device management',
        isQRloginEnable: 'QR login',
        isPhetEnable: 'Phet',
        isDashboardEnable: "Dashboard",
        isCalendarEnable: "Calendar",
        isCollaborationClassEnable: "Collaboration Class",
        isAllUsersEnable: "All Users",
        isWhiteBoardEnable: "WhiteBoard",
        isSchoolEnable: "School",
        isNotificationsEnable: "Notifications"
    }
    constructor(private commonService: CommonService, private toaster: ToastrService) {
        this.getMasterPlans();
        this.getClientList();
    }

    onTabChange(event) {
        const tabs = ['basic', 'premium', 'enterprise', 'customize'];
        this.selectedTab = tabs[event.nextId.split('-')[2]];
    }

    changeStatus(event, plan) {
        switch (plan) {
            case 'basic': {
                if (event.target.checked) {
                    this.basic.push({ name: event.target.value, value: true });
                } else {
                    this.basic = this.basic.filter(plan => plan.name != event.target.value);
                }
            }
                break;
            case 'premium': {
                if (event.target.checked) {
                    this.premium.push({ name: event.target.value, value: true });
                } else {
                    this.premium = this.premium.filter(plan => plan.name != event.target.value);
                }
            }
                break;
            case 'enterprise': {
                if (event.target.checked) {
                    this.enterprise.push({ name: event.target.value, value: true });
                } else {
                    this.enterprise = this.enterprise.filter(plan => plan.name != event.target.value);
                }
            }
                break;
            case 'customize': {
                if (event.target.checked) {
                    this.custom.push({ name: event.target.value, value: true });
                } else {
                    this.custom = this.custom.filter(plan => plan.name != event.target.value);
                }
            }
                break;
        }
    }

    isItemChecked(plan, item) {
        let value;
        switch (plan) {
            case 'basic': value = this.basic.find(sitem => sitem.name == item) ? true : false;
                break;
            case 'premium': value = this.premium.find(sitem => sitem.name == item) ? true : false;
                break;
            case 'enterprise': value = this.enterprise.find(sitem => sitem.name == item) ? true : false;
                break;
        }
        return value;
    }

    getMasterPlans() {
        this.commonService.getPlans().subscribe(resp => {
            const { availableFeatures, plans } = resp['data'];
            this.features = availableFeatures;
            this.basic = plans['basic'].map((feature) => ({ name: feature, value: true }));
            this.premium = plans['premium'].map((feature) => ({ name: feature, value: true }));
            this.enterprise = plans['enterprise'].map((feature) => ({ name: feature, value: true }));
        });
    }

    updatePlan() {
        const plans = {
            basic: this.basic.map(feature => feature.name),
            premium: this.premium.map(feature => feature.name),
            enterprise: this.enterprise.map(feature => feature.name)
        };
        this.commonService.updatePlans(plans).subscribe((resp) => {
            this.getMasterPlans();
            this.toaster.success('updated plans successfully', 'Success!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            })
        }, error => {
            console.log(error);
            this.toaster.error('update failed', 'Error!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
        });
    }

    getClientList() {
        this.commonService.getAllClients().subscribe((response) => {
            this.clientList = response['data'];
        });
    }

    onClientSelect() {
        this.selectedTab = 'customize';
        this.selectedClient = this.clientList.find(cl => cl.userId === this.client);
        this.clientAssignedFeatures = [];
        Object.keys(this.selectedClient).forEach(key => {
            if (this.featureKeys[key]) {
                this.clientAssignedFeatures.push({ name: this.featureKeys[key], value: this.selectedClient[key] });
            }
        });
        this.custom = [...this.clientAssignedFeatures.filter(sitem => sitem.value)];
    }

    updateUserPlan() {
        //:: TODO
        Object.keys(this.selectedClient).forEach(key => {
            const obj = this.custom.find(feat => feat.name === this.featureKeys[key]);
            if (this.featureKeys[key]) {
                if (obj) {
                    this.selectedClient[key] = true;
                } else {
                    this.selectedClient[key] = false;
                }
            }

        });
        this.commonService.customizeClientFeature(this.selectedClient, this.selectedClient.userId).then(() => {
            this.toaster.success('updated plans successfully', 'Success!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            })
        }).catch(() => {
            this.toaster.error('update failed', 'Error!', {
                toastClass: 'toast ngx-toastr',
                closeButton: true
            });
        });
    }
}