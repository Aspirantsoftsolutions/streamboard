import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CommonService } from '../common.service';

@Component({
    selector: 'invitations',
    templateUrl: './invitations.component.html',
    styleUrls: ['./invitations.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class InvitationsComponent implements OnInit {

    invites: any = []
    public selectedOption = 10;
    public chkBoxSelected = [];
    public SelectionType = SelectionType;
    public isInviteSelected = false;
    public ColumnMode = ColumnMode;

    constructor(private commonService: CommonService) { }

    ngOnInit() {
        this.getLIst();
    }

    customChkboxOnSelect({ selected }) {

        if (selected.length > 0)
            this.isInviteSelected = true;
        else
            this.isInviteSelected = false;
        this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
        this.chkBoxSelected.push(...selected);
    }
    getLIst() {
        this.commonService.getInviteList().subscribe((resp) => {
            this.invites = resp['data'];
        });
    }
}