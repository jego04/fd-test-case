import { Injectable } from '@angular/core';
import {
  CreateTodoListCommand,
  PaginatedListOfTodoItemBriefDto,
  TodoItemDto,
  TodoItemsClient,
  TodoListDto,
  TodoListsClient,
  TodosVm,
  UpdateTodoItemDetailCommand,
  UpdateTodoListCommand,
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
import { ParamsBuilderService } from './params-builder.service';
import { environment } from 'src/environments/environment';
import { TodoItemService } from './todoitem.service';

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
  private _items: BehaviorSubject<TodoItemDto[] | null> = new BehaviorSubject(
    null
  );
  private _lists: BehaviorSubject<TodosVm | null> = new BehaviorSubject(null);
  private _selectedList: BehaviorSubject<TodoListDto | null> =
    new BehaviorSubject(null);
  private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(
    null
  );

  get items$(): Observable<TodoItemDto[]> {
    return this._items.asObservable();
  }

  get lists$(): Observable<TodosVm> {
    return this._lists.asObservable();
  }

  get selecetedList$(): Observable<TodoListDto> {
    return this._selectedList.asObservable();
  }

  get pagination$(): Observable<Pagination> {
    return this._pagination.asObservable();
  }

  get defaultPageSize() {
    return environment.defaultPageSize;
  }

  selectedListId: number;

  constructor(
    private listClient: TodoListsClient,
    private itemsClient: TodoItemsClient,
    private itemService: TodoItemService,
    private paramsBuilder: ParamsBuilderService
  ) {}

  getPaginatedItems(
    id?: number,
    search: string = '',
    itemIds: number[] = [],
    page?: number,
    pageSize: number = this.defaultPageSize
  ): Observable<{ items: TodoItemDto[]; pagination: Pagination }> {
    let params: any = {};
    params = this.paramsBuilder.addPaging(params, page, pageSize);
    return this.itemsClient
      .getTodoItemsWithPagination(
        id,
        search,
        itemIds,
        params.page,
        params.pageSize
      )
      .pipe(
        take(1),
        map((res) => {
          const pagination: Pagination = {
            hasNextPage: res.hasNextPage,
            hasPreviousPage: res.hasPreviousPage,
            pageNumber: res.pageNumber,
            totalCount: res.totalCount,
            totalPages: res.totalPages,
          };
          this._items.next(res.items);
          this._pagination.next(pagination);
          return {
            items: res.items,
            pagination: pagination,
          };
        })
      );
  }

  getToDoList(): Observable<TodosVm> {
    return this.listClient.get().pipe(
      take(1),
      map((res) => {
        this._lists.next(res);
        return res;
      })
    );
  }

  getListById(id: number): Observable<TodoListDto> {
    return this.lists$.pipe(
      take(1),
      map((lists: TodosVm) => {
        const selected = lists.lists.find((l) => l.id === id);
        this._selectedList.next(selected);
        return selected;
      })
    );
  }

  setSelectedList(id: number) {
    this.selectedListId = id;
  }

  deleteList(id: number) {
    return this.lists$.pipe(
      take(1),
      switchMap((lists) =>
        this.listClient.softDelete(id).pipe(
          map((res) => {
            const idx = lists.lists.findIndex((f) => f.id == id);
            lists.lists.splice(idx, 1);
            this._lists.next(lists);
            return res;
          })
        )
      )
    );
  }

  deleteItemInList(id: number, itemId: number) {
    return this.items$.pipe(
      take(1),
      switchMap((itemList) =>
        this.itemsClient.softDelete(itemId).pipe(
          take(1),
          map((r) => {
            const idx = itemList.findIndex((f) => f.id == itemId);
            itemList.splice(idx, 1);
            this._items.next(itemList);
            return r;
          })
        )
      ),
      catchError((err) => {
        console.log(err);
        return of(err);
      })
    );
  }

  updateList(id: number, listCommand: UpdateTodoListCommand) {
    return this.selecetedList$.pipe(
      take(1),
      switchMap((selected) =>
        this.listClient.update(id, listCommand).pipe(
          map((res) => {
            selected = { ...listCommand } as TodoListDto;
            this._selectedList.next(selected);
            return res;
          }),
          switchMap((res) =>
            this.lists$.pipe(
              take(1),
              map((lists) => {
                const idx = lists.lists.findIndex(
                  (f) => f.id == listCommand.id
                );
                lists.lists[idx] = {
                  ...lists.lists[idx],
                  title: listCommand.title,
                } as TodoListDto;
                this._lists.next(lists);
                return res;
              })
            )
          )
        )
      )
    );
  }

  updateItemDetails(
    id: number,
    command: UpdateTodoItemDetailCommand,
    prevListId: number
  ) {
    const isNewListId: number = prevListId;

    return this.lists$.pipe(
      take(1),
      switchMap((lists) =>
        this.itemsClient.updateItemDetails(id, command).pipe(
          map(() => {
            const index = lists.lists.findIndex((f) => f.id == command.listId);
            const itemIndex = lists.lists[index].items.findIndex(
              (f) => f.id === command.id
            );
            const tempList = lists.lists[index].items[itemIndex];
            lists.lists[index].items[itemIndex] = {
              ...tempList,
              ...command,
            } as TodoItemDto;
            this._lists.next(lists);
          }),
          switchMap((result) =>
            this.items$.pipe(
              take(1),
              map((items) => {
                const idx = items.findIndex((f) => f.id == command.id);
                items[idx] = {
                  ...items[idx],
                  listId: command.listId,
                  itemColour: command.itemColour,
                } as TodoItemDto;

                //Check if List Id changed.
                if (command.listId != isNewListId) {
                  const filteredItems = items.filter(
                    (f) => f.listId != command.listId
                  );
                  this._items.next(filteredItems);
                } else {
                  this._items.next(items);
                }
              })
            )
          )
        )
      )
    );
  }

  createNewList(list: CreateTodoListCommand): Observable<number> {
    return this.lists$.pipe(
      take(1),
      switchMap((lists) =>
        this.listClient.create(list as CreateTodoListCommand).pipe(
          map((res) => {
            const newList = { ...list, id: res } as TodoListDto;
            lists.lists.push(newList);
            this._lists.next(lists);
            return res;
          })
        )
      )
    );
  }
}
