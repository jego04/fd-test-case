import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '../api-authorization/authorize.guard';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TokenComponent } from './token/token.component';
import {
  ToDoListItemResolver,
  ToDoListResolver,
  ToDoPaginatedItemsResolver,
} from './services/todolist.resolver';
import { ToDoItemTagResolver } from './services/todoitem-tag.resolver';
import { TodoHomeComponent } from './todo/todo-home.component';
import { TodoItemsComponent } from './todo/todo-items/todo-items.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { paginatedItems: ToDoPaginatedItemsResolver },
    pathMatch: 'full',
  },
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  {
    path: 'todo',
    resolve: {
      resolvedList: ToDoListResolver,
      paginatedItems: ToDoPaginatedItemsResolver,
      itemTags: ToDoItemTagResolver,
    },
    component: TodoHomeComponent,
    children: [
      {
        path: ':listId',
        resolve: {
          itemsByListId: ToDoListItemResolver,
          list: ToDoListResolver,
          items: ToDoPaginatedItemsResolver,
        },
        component: TodoItemsComponent,
      },
    ],
  },
  { path: 'token', component: TokenComponent, canActivate: [AuthorizeGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
