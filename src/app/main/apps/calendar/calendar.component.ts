import { Title } from '@angular/platform-browser';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';

import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { EventRef } from 'app/main/apps/calendar/calendar.model';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // Public
  public slideoutShow = false;
  public events = [];
  public event;
  public calendarSec: EventRef[] = [];

  public calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.events,
    weekends: true,
    editable: true,
    eventResizableFromStart: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick: this.handleUpdateEventClick.bind(this),
    eventClassNames: this.eventClass.bind(this),
    select: this.handleDateSelect.bind(this)
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CalendarService} _calendarService
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _calendarService: CalendarService,
    private _coreConfigService: CoreConfigService,
    private _sauthService: SocialAuthService,
    private _authenticationService: AuthenticationService

  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Event Class
   *
   * @param s
   */
  eventClass(s) {
    const calendarsColor = {
      Business: 'primary',
      Holiday: 'success',
      Personal: 'danger',
      Family: 'warning',
      ETC: 'info'
    };

    const colorName = calendarsColor[s.event._def.extendedProps.calendar];
    return `bg-light-${colorName}`;
  }

  /**
   * Update Event
   *
   * @param eventRef
   */
  handleUpdateEventClick(eventRef: EventClickArg) {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
    this._calendarService.updateCurrentEvent(eventRef);
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Date select Event
   *
   * @param eventRef
   */
  handleDateSelect(eventRef) {
    const newEvent = new EventRef();
    newEvent.start = eventRef.start;
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
    this._calendarService.onCurrentEventChange.next(newEvent);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      // ! If we have zoomIn route Transition then load calendar after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          // Subscribe to Event Change
          this._calendarService.onEventChange.subscribe(res => {
            this.events = res;
            this.calendarOptions.events = res;
          });
        }, 450);
      } else {
        // Subscribe to Event Change
        this._calendarService.onEventChange.subscribe(res => {
          console.log('init here:', res);
          this.events = res;
          this.calendarOptions.events = res;
        });
      }
    });

    this._calendarService.onCurrentEventChange.subscribe(res => {
      this.event = res;
    });

    this._sauthService.authState.subscribe((user) => {
      console.log('user:', user);
      // this.userSocial = user;
      // this._authenticationService.getUsers(this.userSocial.response.access_token, this.userSocial.response.id_token);
      // console.log('user token:', this.userSocial.response.access_token);
     
      // let domainName = user.email.split("@");
      // this._authenticationService.getUsers(user.response.access_token, 'e851b52adce04eb4597101ccd7dd6167acc65f46',domainName[1])
      //   .subscribe(
      //     data => {
      //       console.log("data c:", data);
      //       // this._router.navigate(['/']);
      //     },
      //     error => {
      //     }
      //   );

      this._authenticationService.getCalendarEvents(user.response.access_token)
        .subscribe(
          data => {
            console.log("data c:", data);

            data.items.forEach(element => {
              this._authenticationService.getCalendarEventsList(user.response.access_token, element.id)
                .subscribe(
                  data1 => {
                    console.log("data c1:", data1);
                    this._calendarService.calendar = [];
                    this._calendarService.events = [];
                    data1.items.forEach(event => {
                      console.log("data cevent1:", event);

                      const data = new EventRef();
                      // newEvent.id = parseInt(eventRef.event.id);
                      data.id = event.id;
                      data.title = event.summary;
                      // data.url = event.source?.url ?? "";
                      data.start = event.start?.dateTime ?? "";
                      data.calendar = 'Personal';
                      data.end = event.end?.dateTime ?? "";
                      data.extendedProps.description = event.summary??event.title;
                      this._calendarService.calendar.push(data);
                      this._calendarService.events.push(data);
                    });
                    this.calendarOptions.events = this._calendarService.events;
                    this._calendarService.onEventChange.next(this._calendarService.events);
                    this._calendarService.onCalendarChange.next(this._calendarService.calendar);
                    this.events = this._calendarService.events;
                    console.log("data this._calendarService.calendarSecondary:", this._calendarService.events);

                  },
                  error => {
                  }
                );
            });
            // this._router.navigate(['/']);
            
          },
          error => {
          }
        );
    });

    // const googleLoginOptions = {
    //   scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly'
    // }
    // this._sauthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);


  }

  /**
   * Calendar's custom button on click toggle sidebar
   */
  ngAfterViewInit() {
    // Store this to _this as we need it on click event to call toggleSidebar
    let _this = this;
    this.calendarOptions.customButtons = {
      sidebarToggle: {
        text: '',
        click() {
          _this.toggleSidebar('calendar-main-sidebar');
        }
      }
    };
  }
}
