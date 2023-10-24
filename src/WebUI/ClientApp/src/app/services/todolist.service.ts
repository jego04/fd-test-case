import { Injectable } from '@angular/core';
import {
  CreateTodoListCommand,
  TodoItemDto,
  TodoItemsClient,
  TodoListDto,
  TodoListsClient,
  TodosVm,
  UpdateTodoItemDetailCommand,
} from '../web-api-client';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface Pagination {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private _lists: BehaviorSubject<TodosVm | null> = new BehaviorSubject(null);
  private _itemLists: BehaviorSubject<TodoListDto | null> = new BehaviorSubject(
    null
  );
  get lists$(): Observable<TodosVm> {
    return this._lists.asObservable();
  }

  get itemLists$(): Observable<TodoListDto> {
    return this._itemLists.asObservable();
  }

  constructor(
    private listClient: TodoListsClient,
    private itemsClient: TodoItemsClient
  ) {}

  getToDoList(): Observable<TodosVm> {
    return this.listClient.get().pipe(
      take(1),
      map((res) => {
        this._lists.next(res);
        this._itemLists.next(res.lists[0]);
        return res;
      })
    );
  }

  updateItemDetails(id: number, command: UpdateTodoItemDetailCommand) {
    return this.lists$.pipe(
      take(1),
      switchMap((lists) =>
        this.itemsClient.updateItemDetails(id, command).pipe(
          tap(() => {
            const index = lists.lists.findIndex((f) => f.id === command.listId);
            const itemIndex = lists.lists[index].items.findIndex(
              (f) => f.id === command.id
            );
            const tempList = lists.lists[index].items[itemIndex];

            lists.lists[index].items[itemIndex] = {
              ...tempList,
              ...command,
            } as TodoItemDto;

            this._lists.next(lists);
          })
        )
      )
    );
  }

  createNewList(list: CreateTodoListCommand): Observable<number> {
    return this.lists$.pipe(
      take(1),
      switchMap((lists) =>
        this.listClient.create(list as CreateTodoListCommand).pipe(
          map((newList) => {
            lists.lists.push(list);
            this._lists.next(lists);
            return newList;
          })
        )
      )
    );
  }
}
