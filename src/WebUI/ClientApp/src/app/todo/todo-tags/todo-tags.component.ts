import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';
import { TodoItemService } from 'src/app/services/todoitem.service';
import { TodoListService } from 'src/app/services/todolist.service';
import { TodoItemDto, TodoItemsTagDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-tags-component',
  templateUrl: './todo-tags.component.html',
  styleUrls: ['./todo-tags.component.scss'],
})
export class TodoTagsComponent implements OnInit {
  tagsWithCount$: Observable<any[]>;
  @Output() itemIds = new EventEmitter<number[]>();
  items$: Observable<TodoItemDto[]>;
  constructor(
    public listService: TodoListService,
    private itemService: TodoItemService
  ) {}

  ngOnInit() {
    this.tagsWithCount$ = this.itemService.tagsWithCount$;
  }

  filterTodoItems(itemIds: number[]) {
    this.itemIds.emit(itemIds);
  }
}
