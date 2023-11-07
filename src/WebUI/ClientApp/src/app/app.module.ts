import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TodoHomeComponent } from './todo/todo-home.component';
import { TokenComponent } from './token/token.component';

import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodoItemsComponent } from './todo/todo-items/todo-items.component';
import { TodoListNavComponent } from './todo/todo-list-nav/todo-list-nav.component';
import { TodoListTitleComponent } from './todo/todo-list-title/todo-list.title.component';
import { TodoSearchBarComponent } from './todo/todo-search-bar/todo-search-bar.component';
import { TodoTagsComponent } from './todo/todo-tags/todo-tags.component';
import { TodoPaginationComponent } from './todo/todo-pagination/todo-pagination.component';
import { TodoCalendarComponent } from './todo/todo-calendar/todo-calendar.component';
import { ItemCardComponent } from './home/item-card/item-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    TodoItemsComponent,
    TodoHomeComponent,
    TodoListNavComponent,
    TodoListTitleComponent,
    TodoSearchBarComponent,
    TodoTagsComponent,
    TokenComponent,
    TodoPaginationComponent,
    TodoCalendarComponent,
    ItemCardComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApiAuthorizationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CalendarModule,
    PanelModule,
    ModalModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
