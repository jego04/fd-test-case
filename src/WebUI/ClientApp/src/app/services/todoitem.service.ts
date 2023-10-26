import { Injectable, NgZone } from '@angular/core';
import {
  CreateTodoItemTagCommand,
  TodoItemsClient,
  TodoItemsTagDto,
} from '../web-api-client';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoItemService {
  private _tags: BehaviorSubject<TodoItemsTagDto[] | null> =
    new BehaviorSubject(null);

  private _filteredTags: BehaviorSubject<TodoItemsTagDto[] | null> =
    new BehaviorSubject(null);

  get tags$(): Observable<TodoItemsTagDto[]> {
    return this._tags.asObservable();
  }

  get filteredTags$(): Observable<TodoItemsTagDto[]> {
    return this._filteredTags.asObservable();
  }

  constructor(private itemsClient: TodoItemsClient, private zone: NgZone) {}

  getTags(): Observable<TodoItemsTagDto[]> {
    return this.itemsClient.getTags().pipe(
      take(1),
      map((res) => {
        if (res) {
          this._tags.next(res);
          return res;
        }
        return [];
      })
    );
  }

  getTagsByItemId(id: number): Observable<TodoItemsTagDto[]> {
    return this.itemsClient.getTagsByItemId(id).pipe(
      take(1),
      map((res) => {
        if (res) {
          this._filteredTags.next(res);
          return res;
        }
        return [];
      })
    );
  }

  createTag(tag: CreateTodoItemTagCommand): Observable<TodoItemsTagDto[]> {
    return this.filteredTags$.pipe(
      take(1),
      switchMap((tags) =>
        this.itemsClient.create2(tag as CreateTodoItemTagCommand).pipe(
          tap(() => console.log(tags)),
          map(() => {
            tags.push(tag);
            this._filteredTags.next(tags);
            return tags;
          })
        )
      ),
      catchError((err) => {
        console.error(err);
        return of(err);
      })
    );
  }
}
