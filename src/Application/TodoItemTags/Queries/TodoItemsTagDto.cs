using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Todo_App.Application.Common.Mappings;
using Todo_App.Application.TodoLists.Queries.GetTodos;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.TodoItemTags.Queries;
public class TodoItemsTagDto : IMapFrom<TodoItemTag>
{
    public int Id { get; set; }

    public int TodoItemId { get; set; }

    public string? Name { get; set; }

}
