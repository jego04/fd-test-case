using Todo_App.Application.Common.Mappings;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.TodoItems.Queries.GetTodoItemsWithPagination;

public class TodoItemBriefDto : IMapFrom<TodoItem>
{
    public int Id { get; set; }

    public int? ListId { get; set; }

    public string? Title { get; set; }

    public string? ItemColour { get; set; }

    public DateTime Reminder { get; set; }  

    public string? Note { get; set; }  

    public bool Done { get; set; }
}
