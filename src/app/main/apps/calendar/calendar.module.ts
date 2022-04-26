import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';

import { CalendarEventSidebarComponent } from 'app/main/apps/calendar/calendar-sidebar/calendar-event-sidebar/calendar-event-sidebar.component';
import { CalendarMainSidebarComponent } from 'app/main/apps/calendar/calendar-sidebar/calendar-main-sidebar/calendar-main-sidebar.component';

import { CalendarComponent } from 'app/main/apps/calendar/calendar.component';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

// routing
const routes: Routes = [
  {
    path: '**',
    component: CalendarComponent,
    resolve: {
      data: CalendarService
    },
    data: { animation: 'calendar' }
  }
];

@NgModule({
  declarations: [CalendarComponent, CalendarEventSidebarComponent, CalendarMainSidebarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    CoreSidebarModule,
    FormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [CalendarService, {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '257698626403-9dvcpsmpn1gb33sau8al4u6tr4ucmusf.apps.googleusercontent.com'
          )
        },
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }]
})
export class CalendarModule {}
