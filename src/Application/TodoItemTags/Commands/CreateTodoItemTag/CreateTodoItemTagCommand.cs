using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Todo_App.Application.Common.Interfaces;
using Todo_App.Domain.Entities;
using Todo_App.Domain.Events;

namespace Todo_App.Application.TodoItemTags.Commands.CreateTodoItemTag;
public record CreateTodoItemTagCommand : IRequest<int>
{
    public int ItemId { get; init; }
    public string? Name {  get; init; }
    
}

public class CreateTodoItemTagCommandHandler : IRequestHandler<CreateTodoItemTagCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateTodoItemTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateTodoItemTagCommand request, CancellationToken cancellationToken)
    {
        var entity = new TodoItemTag
        {
            TodoItemId= request.ItemId,
            Name= request.Name,
        };

        _context.TodoItemTags.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
