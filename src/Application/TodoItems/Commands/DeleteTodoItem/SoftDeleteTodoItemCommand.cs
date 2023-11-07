using MediatR;
using Todo_App.Application.Common.Interfaces;

namespace Todo_App.Application.TodoItems.Commands.DeleteTodoItem;

public record SoftDeleteTodoItemCommand(int Id): IRequest;
public class SoftDeleteTodoItemCommandHandler : IRequestHandler<SoftDeleteTodoItemCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ISoftDeleteService _softDeleteService;
    public SoftDeleteTodoItemCommandHandler(IApplicationDbContext context, ISoftDeleteService softDeleteService)
    {
        _context = context;
        _softDeleteService = softDeleteService;
    }

    public async Task<Unit> Handle(SoftDeleteTodoItemCommand request, CancellationToken cancellationToken)
    {
        await _softDeleteService.Delete(_context.TodoItems, request.Id, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

