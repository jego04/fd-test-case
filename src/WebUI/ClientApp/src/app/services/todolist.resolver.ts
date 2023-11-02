import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';
import { TodoItemDto, TodosVm } from '../web-api-client';
import { Pagination, TodoListService } from './todolist.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ToDoListResolver implements Resolve<any> {
  constructor(private listService: TodoListService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const list = this.listService.getToDoList();
    const items = this.listService.getPaginatedItems();

    return forkJoin([list, items]);
  }
}

@Injectable({ providedIn: 'root' })
export class ToDoListItemResolver
  implements Resolve<{ items: TodoItemDto[]; pagination: Pagination }>
{
  constructor(private listService: TodoListService) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<{ items: TodoItemDto[]; pagination: Pagination }> {
    const id = +route.paramMap.get('listId');
    this.listService.setSelectedList(id);
    return this.listService.getPaginatedItems(id).pipe(
      tap(() => {}),
      catchError((err: HttpErrorResponse) => {
        //route -> todo/''
        return of({ items: [], pagination: {} });
      })
    );
  }
}
