import { Component, OnInit } from '@angular/core';
import { Pagination, TodoListService } from '../services/todolist.service';
import { Observable, map, take } from 'rxjs';
import { TodoItemDto } from '../web-api-client';
import { ActivatedRoute } from '@angular/router';
import { TodoItemService } from '../services/todoitem.service';

@Component({
  selector: 'app-todo-home-component',
  templateUrl: './todo-home.component.html',
  styleUrls: ['./todo-home.component.scss'],
})
export class TodoHomeComponent implements OnInit {
  paginatedItems: TodoItemDto[];
  pagination$: Observable<Pagination>;
  filteredItems: TodoItemDto[];
  paginatedItems$: Observable<TodoItemDto[]>;
  constructor(
    public listService: TodoListService,
    private route: ActivatedRoute,
    private itemService: TodoItemService
  ) {}

  ngOnInit() {
    this.paginatedItems$ = this.listService.items$;
    this.pagination$ = this.listService.pagination$;
    this.listService.items$.subscribe((response) => {
      this.filteredItems = response;
      this.paginatedItems = response;
    });

    this.itemService.getTagsWithCount().pipe(take(1)).subscribe();
  }
  updateItemsList(filteredItems) {
    this.paginatedItems = filteredItems;
  }

  onSelectPage(page: number): void {
    this.listService
      .getPaginatedItems(this.listService.selectedListId, '', undefined, page)
      .pipe(take(1))
      .subscribe();
  }

  filterByTag(itemIds) {
    this.listService
      .getPaginatedItems(this.listService.selectedListId, '', itemIds)
      .pipe(
        take(1),
        map((response) => {
          return response.items.filter((f) => itemIds.includes(f.id));
        })
      )
      .subscribe();
  }
}
