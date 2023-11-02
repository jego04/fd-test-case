using MediatR;
using Todo_App.Application.Common.Exceptions;
using Todo_App.Application.Common.Interfaces;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.TodoItemTags.Commands.DeleteTodoItemTag;
public record DeleteTodoItemTagCommand(int Id) : IRequest;
public class DeleteTodoItemTagCommandHandler : IRequestHandler<DeleteTodoItemTagCommand>
{
    private readonly IApplicationDbContext _context;
    public DeleteTodoItemTagCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteTodoItemTagCommand request, CancellationToken cancellationToken)
    {
        var data = await _context.TodoItemTags.FindAsync(new object[] {request.Id }, cancellationToken);
       
        if (data == null)
        {
            throw new NotFoundException(nameof(TodoItemTag), request.Id);
        }

        _context.TodoItemTags.Remove(data);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;

    }
}