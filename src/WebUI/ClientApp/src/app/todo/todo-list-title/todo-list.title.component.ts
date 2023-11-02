import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, take } from 'rxjs';
import { TodoListService } from 'src/app/services/todolist.service';
import {
  CreateTodoListCommand,
  TodoListDto,
  TodoListsClient,
  UpdateTodoListCommand,
} from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-list-title-component',
  templateUrl: './todo-list-title.component.html',
})
export class TodoListTitleComponent implements OnInit {
  debug: boolean = false;
  selectedList: TodoListDto;
  selected$: Observable<TodoListDto>;
  listId: number;
  listOptionsEditor: any;
  listOptionsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: TodoListService,
    private modalService: BsModalService,
    private listsClient: TodoListsClient
  ) {}

  ngOnInit() {
    this.selected$ = this.listService.selecetedList$;
  }

  showListOptionsModal(template: TemplateRef<any>, list: TodoListDto) {
    this.listOptionsEditor = {
      id: list.id,
      title: list.title,
    };
    this.selectedList = list;
    this.listOptionsModalRef = this.modalService.show(template);
  }

  updateListOptions() {
    const list = this.listOptionsEditor as UpdateTodoListCommand;
    this.listService
      .updateList(list.id, list)
      .pipe(take(1))
      .subscribe(() => {
        this.listOptionsModalRef.hide();
        this.listOptionsEditor = {};
      });
  }

  confirmDeleteList(template: TemplateRef<any>) {
    this.listOptionsModalRef.hide();
    this.deleteListModalRef = this.modalService.show(template);
  }

  deleteListConfirmed(): void {
    this.listService
      .deleteList(this.selectedList.id)
      .pipe(take(1))
      .subscribe(() => {
        this.deleteListModalRef.hide();
        this.router.navigate(['todo']);
      });
  }
}
