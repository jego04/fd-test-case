import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, map, take, tap } from 'rxjs';
import { TodoItemService } from 'src/app/services/todoitem.service';
import { TodoListService } from 'src/app/services/todolist.service';
import {
  CreateTodoItemCommand,
  CreateTodoItemTagCommand,
  PriorityLevelDto,
  TodoItemDto,
  TodoItemsClient,
  TodoItemsTagDto,
  TodoListDto,
  TodoListsClient,
  TodosVm,
  UpdateTodoItemDetailCommand,
  UpdateTodoListCommand,
} from 'src/app/web-api-client';

@Component({
  selector: 'app-todo-items-component',
  templateUrl: './todo-items.component.html',
  styleUrls: ['./todo-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemsComponent implements OnInit {
  debug: boolean = false;
  deleting: boolean = false;
  deleteCountDown: number = 0;
  deleteCountDownInterval: any;
  itemDetailsModalRef: BsModalRef;
  selectedItem: TodoItemDto;
  inputTagVisible: boolean = false;
  @Input() priorityLevels: PriorityLevelDto[];
  @Input() data: Observable<TodosVm>;
  selectedList: TodoListDto;
  @Input() lists: TodoListDto[];
  items$: Observable<TodoItemDto[]>;
  listData$: Observable<TodosVm>;
  listId: number;
  filteredTags: TodoItemsTagDto[];
  tagInput: string;

  itemDetailsFormGroup = this.fb.group({
    id: [null],
    listId: [null],
    priority: [''],
    itemColour: [''],
    reminder: [''],
    note: [''],
  });

  constructor(
    private modalService: BsModalService,
    private itemsClient: TodoItemsClient,
    private itemService: TodoItemService,
    private listsClient: TodoListsClient,
    private listService: TodoListService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.itemService.filteredTags$.pipe(take(1)).subscribe((res) => {
      this.filteredTags = res;
    });
    this.items$ = this.listService.items$;
    this.listData$ = this.listService.lists$;

    this.route.paramMap.subscribe((params) => {
      const id = +params.get('listId');
      this.listService.setSelectedList(id);
      this.listId = id;
    });
  }

  removeTag(id: number) {
    this.itemService.removeTag(id).pipe(take(1)).subscribe();
  }

  addTag() {
    const itemValue = {
      itemId: this.selectedItem.id,
      name: this.tagInput,
    };
    if (!itemValue.name) {
      alert('EMPTY');
    } else {
      this.itemService
        .createTag(itemValue as CreateTodoItemTagCommand)
        .subscribe((res) => {});
    }
    this.toggleInputTag();
  }

  toggleInputTag() {
    this.inputTagVisible = !this.inputTagVisible;
  }

  setColorWhenClicked(color: string) {
    this.itemDetailsFormGroup.get('itemColour').patchValue(color);
  }

  // Items
  showItemDetailsModal(template: TemplateRef<any>, item: TodoItemDto): void {
    this.selectedItem = item;

    this.listData$.pipe(take(1)).subscribe((res) => {
      console.log(res);
      const idx = res.lists.findIndex((f) => f.id == item.listId);
      const value = res.lists[idx].items.find((f) => f.id == item.id);
      this.itemDetailsFormGroup.patchValue(value);
    });

    this.itemService
      .getTagsByItemId(item.id)
      .pipe(take(1))
      .subscribe((res) => {
        this.filteredTags = res;
      });

    this.itemDetailsModalRef = this.modalService.show(template);
    this.itemDetailsModalRef.onHidden.subscribe(() => {
      this.stopDeleteCountDown();
    });
  }

  updateItemDetails(listId: number): void {
    const item = new UpdateTodoItemDetailCommand(
      this.itemDetailsFormGroup.value
    );

    this.listService
      .updateItemDetails(this.selectedItem.id, item, listId)
      .pipe(take(1))
      .subscribe(() => {
        this.itemDetailsModalRef.hide();
        this.itemDetailsFormGroup.reset();
      });
  }

  updateItem(
    item: TodoItemDto,
    pressedEnter: boolean = false,
    titleIdx?: number
  ): void {
    const isNewItem = item.id === 0;
    const isEmpty = item.title.trim();
    if (!isEmpty) {
      this.items$
        .pipe(
          take(1),
          map((r) => r.splice(titleIdx, 1))
        )
        .subscribe();
    }

    if (isEmpty.length > 1 && item.id == 0) {
      this.listService
        .createItem({
          ...item,
          listId: this.listId,
        } as CreateTodoItemCommand)
        .pipe(take(1))
        .subscribe((res) => {
          item.id = res;
        });
    }

    if (item.id != 0)
      this.itemsClient.update(item.id, item).subscribe(
        () => console.log('Update succeeded.'),
        (error) => console.error(error)
      );

    this.selectedItem = null;

    if (isNewItem && pressedEnter) {
      setTimeout(() => this.addItem(), 250);
    }
  }

  deleteItem(item: TodoItemDto, countDown?: boolean) {
    if (countDown) {
      if (this.deleting) {
        this.stopDeleteCountDown();
        return;
      }
      this.deleteCountDown = 3;
      this.deleting = true;
      this.deleteCountDownInterval = setInterval(() => {
        if (this.deleting && --this.deleteCountDown <= 0) {
          this.deleteItem(item, false);
        }
      }, 1000);
      return;
    }
    this.deleting = false;
    if (this.itemDetailsModalRef) {
      this.itemDetailsModalRef.hide();
    }

    this.listService
      .deleteItemInList(this.listId, item.id)
      .pipe(take(1))
      .subscribe(() => {
        if (this.filteredTags.length > 0)
          for (var i = 0; i < this.filteredTags.length; i++) {
            this.removeTag(this.filteredTags[i].id);
          }
      });
  }

  addItem() {
    const item = {
      id: 0,
      listId: this.listId,
      priority: 0,
      title: '',
      itemColour: '',
      done: false,
    } as TodoItemDto;

    this.items$.pipe(take(1)).subscribe((res) => {
      res.push(item);
      const index = res.length - 1;
      this.editItem(item, 'itemTitle' + index);
    });
  }

  editItem(item: TodoItemDto, inputId: string): void {
    this.selectedItem = item;
    setTimeout(() => {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }

  stopDeleteCountDown() {
    clearInterval(this.deleteCountDownInterval);
    this.deleteCountDown = 0;
    this.deleting = false;
  }
}
