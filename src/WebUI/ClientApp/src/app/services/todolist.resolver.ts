import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TodosVm } from '../web-api-client';
import { TodoListService } from './todolist.service';

@Injectable({ providedIn: 'root' })
export class ToDoListResolver implements Resolve<TodosVm> {
  constructor(private listService: TodoListService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<TodosVm> {
    return this.listService.getToDoList();
  }
}
