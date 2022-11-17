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
    public premium = [];
    constructor(private commonService: CommonService, private toaster: ToastrService) {
        this.getMasterPlans();
    }
    onTabChange(event) {
        const tabs = ['basic', 'premium', 'enterprise'];
        const selectedTab = tabs[event.nextId.split('-')[2]];
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
        }
        console.log(this.basic, this.premium, this.enterprise);
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
}