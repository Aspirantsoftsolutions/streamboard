import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EventRef } from 'app/main/apps/calendar/calendar.model';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';

@Component({
  selector: 'app-calendar-event-sidebar',
  templateUrl: './calendar-event-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CalendarEventSidebarComponent implements OnInit {
  //  Decorator
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('endDatePicker') endDatePicker;

  // Public
  public event: EventRef;
  public isDataEmpty;
  public selectLabel = [
    { label: 'Business', bullet: 'primary' },
    { label: 'Personal', bullet: 'danger' },
  ];
  public selectGuest = [
    'venkat',
    'gsvs'
  ];
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

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CalendarService} _calendarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _calendarService: CalendarService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Event Sidebar
   */
  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    console.log(eventForm);
    if (eventForm.valid) {
      //! Fix: Temp fix till ng2-flatpicker support ng-modal (Getting NG0100: Expression has changed after it was checked error if we use ng-model with ng2-flatpicker)
      eventForm.form.value.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
      eventForm.form.value.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;

      this._calendarService.addEvent(eventForm.form.value);
      this.toggleEventSidebar();
      
      setTimeout(() => {
        this._calendarService.getEvents();
        this._calendarService.getCalendar();
      }, 1000);
    }
  }

  /**
   * Update Event
   */
  updateEvent() {
    this.toggleEventSidebar();
    //! Fix: Temp fix till ng2-flatpicker support ng-modal
    this.event.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    this.event.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
    this._calendarService.postUpdatedEvent(this.event);
  }

  /**
   * Delete Event
   */
  deleteEvent() {
    this._calendarService.deleteEvent(this.event);
    this.toggleEventSidebar();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to current event changes
    this._calendarService.onCurrentEventChange.subscribe(response => {
      this.event = response;

      // If Event is available
      if (Object.keys(response).length > 0) {
        this.event = response;
        this.isDataEmpty = false;
        if (response.id === undefined) {
          this.isDataEmpty = true;
        }
      }
      // else Create New Event
      else {
        this.event = new EventRef();

        // Clear Flatpicker Values
        setTimeout(() => {
          this.startDatePicker.flatpickr.clear();
          this.endDatePicker.flatpickr.clear();
        });
        this.isDataEmpty = true;
      }
    });
  }
}
