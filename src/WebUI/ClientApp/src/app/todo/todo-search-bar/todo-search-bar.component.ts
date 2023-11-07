import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  take,
  takeUntil,
} from 'rxjs';
import { TodoListService } from 'src/app/services/todolist.service';

@Component({
  selector: 'app-todo-search-bar-component',
  templateUrl: './todo-search-bar.component.html',
  styleUrls: ['./todo-search-bar.component.scss'],
})
export class TodoSearchBarComponent implements OnInit {
  searchCtrl = new FormControl('');
  @Input() listId: number;
  @Input() items: any[];
  @Output() filteredItems = new EventEmitter<any[]>();
  _destroy$: Subject<void> = new Subject<void>();
  constructor(
    private listService: TodoListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((searchText) => {
        const id = this.listId === 0 ? undefined : this.listId;
        this.listService
          .getPaginatedItems(id, searchText)
          .pipe(take(1))
          .subscribe();
        //this.filterSearchList(searchText);
      });
  }

  filterSearchList(keyWord: string) {
    const searchTerm = keyWord.toLowerCase().trim();

    if (searchTerm.length === 0) {
      // If the search term is empty, emit the original array
      this.filteredItems.emit(this.items);
      return;
    }

    const filteredByKeyWordList = this.items.filter((item) => {
      // Check if any of the object's properties contain the search term
      for (const property in item) {
        if (item.hasOwnProperty(property)) {
          const value = item[property];
          if (
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm)
          )
            return true;
        }
      }
      return false;
    });

    this.filteredItems.emit(filteredByKeyWordList);
  }
}
