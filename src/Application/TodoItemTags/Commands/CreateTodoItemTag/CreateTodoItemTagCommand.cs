using System.ComponentModel.DataAnnotations;
using MediatR;
using Todo_App.Application.Common.Exceptions;
using Todo_App.Application.Common.Interfaces;
using Todo_App.Domain.Entities;

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

        var itemData = await _context.TodoItems.FindAsync(new object[] { request.ItemId }, cancellationToken);

        if (itemData == null)
        {
            throw new NotFoundException(nameof(TodoItemTag), request.ItemId);
        }

        var entity = new TodoItemTag
        {
            TodoItemId= request.ItemId,
            Name= request.Name
        };

        _context.TodoItemTags.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
