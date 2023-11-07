using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Todo_App.Application.TodoItems.Commands.CreateTodoItem;

namespace Todo_App.Application.TodoItemTags.Commands.CreateTodoItemTag;
public class CreateTodoItemTagCommandValidator: AbstractValidator<CreateTodoItemTagCommand>
{
    public CreateTodoItemTagCommandValidator()
    {
        RuleFor(c => c.Name).NotEmpty().MinimumLength(2);
        RuleFor(v => v.ItemId).NotEmpty().NotNull();
    }
}
