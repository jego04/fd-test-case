import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { TodoListService } from 'src/app/services/todolist.service';
import {
  CreateTodoListCommand,
  TodoListDto,
  TodoListsClient,
} from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-list-nav-component',
  templateUrl: './todo-list-nav.component.html',
  styleUrls: ['./todo-list-nav.component.scss'],
})
export class TodoListNavComponent implements OnInit {
  debug = false;
  newListModalRef: BsModalRef;
  newListEditor: any = {};
  lists: TodoListDto[];
  selectedList: TodoListDto;
  constructor(
    private modalService: BsModalService,
    private listsClient: TodoListsClient,
    public listService: TodoListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  selectList($events: any) {
    this.listService.selectedListId = $events;
    this.listService
      .getListById(this.listService.selectedListId)
      .pipe(take(1))
      .subscribe();
  }

  addList(): void {
    const list = {
      id: 0,
      title: this.newListEditor.title,
      items: [],
    } as TodoListDto;

    this.listService.createNewList(list).pipe(take(1)).subscribe();
    this.newListModalRef.hide();
    this.newListEditor = {};
  }

  showNewListModal(template: TemplateRef<any>): void {
    this.newListModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }

  newListCancelled(): void {
    this.newListModalRef.hide();
    this.newListEditor = {};
  }

  remainingItems(list: TodoListDto): number {
    return list.items.filter((t) => !t.done && t.isDeleted == false).length;
  }
}
