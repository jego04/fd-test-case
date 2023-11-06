import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-calendar-component',
  templateUrl: './todo-calendar.component.html',
  styleUrls: ['./todo-calendar.component.scss'],
})
export class TodoCalendarComponent implements OnInit {
  daysWithItems: Date[];
  constructor() {}

  ngOnInit() {}
}
