import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../services/todolist.service';

@Component({
  selector: 'app-todo-home-component',
  templateUrl: './todo-home.component.html',
  styleUrls: ['./todo-home.component.scss'],
})
export class TodoHomeComponent implements OnInit {
  constructor(private listService: TodoListService) {}

  ngOnInit() {}
}
