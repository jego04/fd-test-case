import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListService } from '../services/todolist.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(private router: Router, private listService: TodoListService) {}

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  navigateTodo() {
    this.listService
      .getPaginatedItems()
      .pipe(take(1))
      .subscribe(() => {});
    this.listService.setSelectedList(undefined);
  }
}
