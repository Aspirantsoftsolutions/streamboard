export class EventRef {
  id ;
  url: string;
  title: string = '';
  start: string;
  end: string;
  allDay = false;
  calendar:string= '';
  extendedProps = {
    location: '',
    description: '',
    addGuest: []
  };
}
