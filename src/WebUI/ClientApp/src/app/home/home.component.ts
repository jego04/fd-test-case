import { Component, OnInit } from '@angular/core';
import { Observable, map, of, switchMap, take, tap } from 'rxjs';
import { TodoItemService } from '../services/todoitem.service';
import { TodoItemDto } from '../web-api-client';
import { Pagination, TodoListService } from '../services/todolist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  daysWithItems: Observable<Date[]>;
  selectedDate = new Date();
  items$: Observable<TodoItemDto[]>;
  selectedDateItems: Observable<any>;

  constructor(private listService: TodoListService) {}

  ngOnInit() {
    this.items$ = this.listService.items$;
    this.getFilteredItems();
  }

  updateItemsList(date: Date) {
    this.selectedDate = date;
    this.getFilteredItems();
  }

  getFilteredItems() {
    this.items$ = this.items$.pipe(
      take(1),
      map((items) => {
        return items.filter(
          (f) =>
            f.reminder.getMonth() == this.selectedDate.getMonth() &&
            f.reminder.getFullYear() == this.selectedDate.getFullYear()
        );
      })
    );

    this.daysWithItems = this.items$.pipe(
      map((filteredItems) => filteredItems.map((f) => f.reminder))
    );

    this.selectedDateItems = this.items$.pipe(
      map((filteredItems) =>
        filteredItems.filter(
          (f) => f.reminder.getDate() == this.selectedDate.getDate()
        )
      )
    );
  }
}
