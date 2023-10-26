import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TodoItemsTagDto } from '../web-api-client';
import { TodoItemService } from './todoitem.service';

@Injectable({ providedIn: 'root' })
export class ToDoItemTagResolver implements Resolve<TodoItemsTagDto[]> {
  constructor(private itemService: TodoItemService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<TodoItemsTagDto[]> {
    return this.itemService.getTags();
  }
}
