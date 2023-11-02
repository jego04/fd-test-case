import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-todo-pagination-component',
  templateUrl: './todo-pagination.component.html',
  styleUrls: ['./todo-pagination.component.scss'],
})
export class TodoPaginationComponent implements OnInit {
  @Input() pagination: any;
  @Output() selectPage = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  onSelectPage(page: number): void {
    this.selectPage.emit(page);
  }

  onPrevious(): void {
    if (this.pagination.hasPreviousPage)
      this.selectPage.emit(this.pagination.pageNumber - 1);
  }

  onNext(): void {
    if (this.pagination.hasNextPage)
      this.selectPage.emit(this.pagination.pageNumber + 1);
  }

  getPageNumbers(pagination: any): number[] {
    const maxVisibleButtons = environment.defaultPageSize;
    const startPage = Math.max(
      1,
      pagination.pageNumber - Math.floor(maxVisibleButtons / 2)
    );
    const endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisibleButtons - 1
    );

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }
}
