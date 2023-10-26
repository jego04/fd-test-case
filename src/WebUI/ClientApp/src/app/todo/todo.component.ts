import {
  Component,
  TemplateRef,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  TodoListsClient,
  TodoItemsClient,
  TodoListDto,
  TodoItemDto,
  PriorityLevelDto,
  CreateTodoListCommand,
  UpdateTodoListCommand,
  CreateTodoItemCommand,
  UpdateTodoItemDetailCommand,
  ColourDto,
  TodosVm,
  TodoItemsTagDto,
} from '../web-api-client';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TodoListService } from '../services/todolist.service';
import { ActivatedRoute } from '@angular/router';
import { TodoItemService } from '../services/todoitem.service';

@Component({
  selector: 'app-todo-component',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  debug = false;
  deleting = false;
  deleteCountDown = 0;
  deleteCountDownInterval: any;
  itemLists$: Observable<TodoListDto>;
  lists: TodoListDto[];
  priorityLevels: PriorityLevelDto[];
  coloursList: ColourDto[];
  selectedList: TodoListDto;
  selectedItem: TodoItemDto;
  newListEditor: any = {};
  listOptionsEditor: any = {};
  newListModalRef: BsModalRef;
  listOptionsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;
  itemDetailsModalRef: BsModalRef;
  newItemStyle: string;
  itemDetailsFormGroup = this.fb.group({
    id: [null],
    listId: [null],
    priority: [''],
    itemColour: [''],
    note: [''],
  });

  todoList$: Observable<TodosVm>;
  tags$: Observable<TodoItemsTagDto[]>;
  constructor(
    private listsClient: TodoListsClient,
    private itemsClient: TodoItemsClient,
    private modalService: BsModalService,
    private listService: TodoListService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private itemService: TodoItemService
  ) {}

  ngOnInit(): void {
    this.itemLists$ = this.listService.itemLists$;
    this.todoList$ = this.listService.lists$;
    this.tags$ = this.itemService.tags$;
    this.itemLists$.pipe(take(1)).subscribe((res) => {
      this.selectedList = res;
    });
  }

  // Lists
  remainingItems(list: TodoListDto): number {
    return list.items.filter((t) => !t.done).length;
  }

  showNewListModal(template: TemplateRef<any>): void {
    this.newListModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('title').focus(), 250);
  }

  newListCancelled(): void {
    this.newListModalRef.hide();
    this.newListEditor = {};
  }

  addList(): void {
    const list = {
      id: 0,
      title: this.newListEditor.title,
      items: [],
    } as TodoListDto;

    this.listsClient.create(list as CreateTodoListCommand).subscribe(
      (result) => {
        list.id = result;
        this.lists.push(list);
        this.selectedList = list;
        this.newListModalRef.hide();
        this.newListEditor = {};
      },
      (error) => {
        const errors = JSON.parse(error.response);

        if (errors && errors.Title) {
          this.newListEditor.error = errors.Title[0];
        }

        setTimeout(() => document.getElementById('title').focus(), 250);
      }
    );
  }
}
