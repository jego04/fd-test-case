import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  listOptionsEditor: any = {};
  itemDetailsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;
  listOptionsModalRef: BsModalRef;
  selectedItem: TodoItemDto;
  inputTagVisible: boolean = false;
  @Input() priorityLevels: PriorityLevelDto[];
  @Input() data: Observable<TodosVm>;
  @Input() selectedList: TodoListDto;
  @Input() lists: TodoListDto[];

  filteredTags$: Observable<TodoItemsTagDto[]>;
  tagInput: string;

  itemDetailsFormGroup = this.fb.group({
    id: [null],
    listId: [null],
    priority: [''],
    itemColour: [''],
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
    this.filteredTags$ = this.itemService.filteredTags$;
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
        .subscribe(() => {});
    }
    this.toggleInputTag();
  }

  toggleInputTag() {
    this.inputTagVisible = !this.inputTagVisible;
  }

  updateItemTag() {
    alert('logged');
  }

  setColorWhenClicked(color: string) {
    this.itemDetailsFormGroup.get('itemColour').patchValue(color);
  }

  // Items
  showItemDetailsModal(template: TemplateRef<any>, item: TodoItemDto): void {
    this.selectedItem = item;
    this.itemDetailsFormGroup.patchValue(this.selectedItem);

    this.filteredTags$ = this.itemService.getTagsByItemId(item.id);

    this.itemDetailsModalRef = this.modalService.show(template);
    this.itemDetailsModalRef.onHidden.subscribe(() => {
      this.stopDeleteCountDown();
    });
  }

  updateItemDetails(): void {
    const item = new UpdateTodoItemDetailCommand(
      this.itemDetailsFormGroup.value
    );

    this.listService
      .updateItemDetails(this.selectedItem.id, item)
      .pipe(take(1))
      .subscribe((res) => {
        this.selectedItem.priority = item.priority;
        this.selectedItem.note = item.note;
        this.itemDetailsModalRef.hide();
        this.itemDetailsFormGroup.reset();
      });
  }

  showListOptionsModal(template: TemplateRef<any>) {
    this.listOptionsEditor = {
      id: this.selectedList.id,
      title: this.selectedList.title,
    };

    this.listOptionsModalRef = this.modalService.show(template);
  }

  updateListOptions() {
    const list = this.listOptionsEditor as UpdateTodoListCommand;
    this.listsClient.update(this.selectedList.id, list).subscribe(
      () => {
        (this.selectedList.title = this.listOptionsEditor.title),
          this.listOptionsModalRef.hide();
        this.listOptionsEditor = {};
      },
      (error) => console.error(error)
    );
  }

  confirmDeleteList(template: TemplateRef<any>) {
    this.listOptionsModalRef.hide();
    this.deleteListModalRef = this.modalService.show(template);
  }

  deleteListConfirmed(): void {
    this.listsClient.delete(this.selectedList.id).subscribe(
      () => {
        this.deleteListModalRef.hide();
        this.lists = this.lists.filter((t) => t.id !== this.selectedList.id);
        this.selectedList = this.lists.length ? this.lists[0] : null;
      },
      (error) => console.error(error)
    );
  }

  updateItem(item: TodoItemDto, pressedEnter: boolean = false): void {
    const isNewItem = item.id === 0;

    if (!item.title.trim()) {
      this.deleteItem(item);
      return;
    }

    if (item.id === 0) {
      this.itemsClient
        .create({
          ...item,
          listId: this.selectedList.id,
        } as CreateTodoItemCommand)
        .subscribe(
          (result) => {
            item.id = result;
          },
          (error) => console.error(error)
        );
    } else {
      this.itemsClient.update(item.id, item).subscribe(
        () => console.log('Update succeeded.'),
        (error) => console.error(error)
      );
    }

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

    if (item.id === 0) {
      const itemIndex = this.selectedList.items.indexOf(this.selectedItem);
      this.selectedList.items.splice(itemIndex, 1);
    } else {
      this.itemsClient.delete(item.id).subscribe(
        () =>
          (this.selectedList.items = this.selectedList.items.filter(
            (t) => t.id !== item.id
          )),
        (error) => console.error(error)
      );
    }
  }

  addItem() {
    const item = {
      id: 0,
      listId: this.selectedList.id,
      priority: this.priorityLevels[0].value,
      title: '',
      itemColour: '',
      done: false,
    } as TodoItemDto;

    this.selectedList.items.push(item);
    const index = this.selectedList.items.length - 1;
    this.editItem(item, 'itemTitle' + index);
  }

  editItem(item: TodoItemDto, inputId: string): void {
    this.selectedItem = item;
    setTimeout(() => document.getElementById(inputId).focus(), 100);
  }

  stopDeleteCountDown() {
    clearInterval(this.deleteCountDownInterval);
    this.deleteCountDown = 0;
    this.deleting = false;
  }
}
