import { Injectable } from '@angular/core';
import {
  CreateTodoItemTagCommand,
  TodoItemsClient,
  TodoItemsTagDto,
} from '../web-api-client';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  reduce,
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

  private _tagsWithCount: BehaviorSubject<any[] | null> = new BehaviorSubject(
    null
  );

  get tagsWithCount$(): Observable<any[]> {
    return this._tagsWithCount.asObservable();
  }

  get tags$(): Observable<TodoItemsTagDto[]> {
    return this._tags.asObservable();
  }

  get filteredTags$(): Observable<TodoItemsTagDto[]> {
    return this._filteredTags.asObservable();
  }

  constructor(private itemsClient: TodoItemsClient) {}

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

  getTagsWithCount() {
    return this.tags$.pipe(
      take(1),
      map((tags) => {
        const result = this.CountNumberOfTags(tags);
        this._tagsWithCount.next(result);
        return result;
      })
    );
  }

  CountNumberOfTags(tags: TodoItemsTagDto[]) {
    const result = [];

    if (tags == null || tags.length == 0) {
      return result;
    }

    for (let tag of tags) {
      let group = result.find((g) => g.name == tag.name);
      if (!group) {
        group = { name: tag.name, count: 0, itemIds: [] };
        result.push(group);
      }
      group.count++;
      if (!group.itemIds.includes(tag.todoItemId)) {
        group.itemIds.push(tag.todoItemId);
      }
    }
    result.sort((a, b) => b.count - a.count);
    return result;
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

  removeTag(id: number) {
    return this.filteredTags$.pipe(
      take(1),
      switchMap((tags) =>
        this.itemsClient.softDeleteTag(id).pipe(
          map((res) => {
            const idx = tags.findIndex((f) => f.id == id);
            const removedTagName = tags[idx].name;
            tags.splice(idx, 1);
            this._filteredTags.next(tags);
            return {
              response: res,
              removedIndex: idx,
            };
          }),
          switchMap((response) =>
            this.tags$.pipe(
              take(1),
              map((tags) => {
                const idx = tags.findIndex(
                  (f) => f.id == response.removedIndex
                );
                tags.splice(idx, 1);
                const result = this.CountNumberOfTags(tags);
                this._tagsWithCount.next(result);
                this._tags.next(tags);
                return response.response;
              })
            )
          )
        )
      )
    );
  }

  removeTagWhenItemIsRemoved(itemId: number) {
    return this.tags$.pipe(
      take(1),
      map((tags) => {
        const idx = tags.findIndex((f) => f.id == itemId);
        tags.splice(idx, 1);
        const result = this.CountNumberOfTags(tags);
        this._tagsWithCount.next(result);
        this._tags.next(tags);
        return tags;
      })
    );
  }

  createTag(tag: CreateTodoItemTagCommand): Observable<TodoItemsTagDto[]> {
    return this.filteredTags$.pipe(
      take(1),
      switchMap((tags) =>
        this.itemsClient.create2(tag as CreateTodoItemTagCommand).pipe(
          map((res) => {
            tag = { id: res, ...tag } as TodoItemsTagDto;
            tags.push(tag);
            this._filteredTags.next(tags);
            return tag;
          }),
          switchMap((tag) =>
            this.tags$.pipe(
              take(1),
              map((tags) => {
                tags === null ? (tags = []) : tags;
                tag = { ...tag, todoItemId: tag.itemId } as TodoItemsTagDto;
                tags.push(tag);
                this._tags.next(tags);
                const result = this.CountNumberOfTags(tags);
                this._tagsWithCount.next(result);
                return tag;
              })
            )
          )
        )
      ),
      catchError((err) => {
        console.error(err);
        return of(err);
      })
    );
  }
}
