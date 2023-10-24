import { Injectable } from '@angular/core';
import {
  TodoItemsClient,
  UpdateTodoItemDetailCommand,
} from '../web-api-client';
import { map, switchMap, take } from 'rxjs';
import { TodoListService } from './todolist.service';

@Injectable({ providedIn: 'root' })
export class ToDoItemService {
  constructor(
    private itemsClient: TodoItemsClient,
    private listService: TodoListService
  ) {}
}
