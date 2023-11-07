import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-todo-calendar-component',
  templateUrl: './todo-calendar.component.html',
  styleUrls: ['./todo-calendar.component.scss'],
})
export class TodoCalendarComponent implements OnInit {
  @Input() daysWithItems: Date[];
  daysWithEvents: Date[];

  @Output() selectedDateChange = new EventEmitter<Date>();
  @ViewChild('calendar') calendar: Calendar;
  selectedDate: Date = new Date();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.daysWithItems.currentValue.length != 0) {
      this.daysWithEvents = this.daysWithItems;
    } else {
    }
  }

  onMonthChanged(event: { year: number; month: number }) {
    this.selectedDateChange.emit(new Date(event.year, event.month - 1, 1));
  }

  onModelChange(event: Date[], calendar: Calendar) {
    var selectedDate: Date;

    if (event != null && this.daysWithEvents.length > 0) {
      if (event.length > this.daysWithEvents.length) {
        // clicks on date without event
        selectedDate = event.filter((e) => !this.daysWithEvents.includes(e))[0];
      } else if (event.length < this.daysWithEvents.length) {
        // clicks on date with event
        selectedDate = this.daysWithEvents.find((e) => !event.includes(e));
      }
    } else {
      if (this.daysWithEvents.length > 0) {
        selectedDate = this.daysWithEvents[0];
      }
    }

    this.selectedDateChange.emit(selectedDate);
    this.changeSelectedDateColor(selectedDate.getDate().toString());

    calendar.value = this.daysWithEvents;
  }

  changeSelectedDateColor(selectedDate: string) {
    var el = document.getElementsByTagName('span');

    var currentSelectedDate =
      document.getElementsByClassName('p-selected-date');

    setTimeout(function () {
      for (var i = 0; i < el.length; i++) {
        if (
          el[i].innerText == selectedDate &&
          i > 2 &&
          !el[i].parentElement.classList.contains('p-datepicker-other-month')
        ) {
          currentSelectedDate[0]?.classList.remove('p-selected-date');
          el[i].parentElement.classList.add('p-selected-date');
          break;
        }
      }
    }, 1);
  }
}
