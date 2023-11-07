using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Todo_App.Application.Common.Interfaces;

namespace Todo_App.Application.TodoItemTags.Commands.DeleteTodoItemTag;

public record SoftDeleteTodoItemTagCommand(int Id): IRequest;
public class SoftDeleteTodoItemTagCommandHandler : IRequestHandler<SoftDeleteTodoItemTagCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ISoftDeleteService _softDeleteService;
    public SoftDeleteTodoItemTagCommandHandler(IApplicationDbContext context, ISoftDeleteService softDeleteService)
    {
        _context = context;
        _softDeleteService = softDeleteService;
    }
    public async Task<Unit> Handle(SoftDeleteTodoItemTagCommand request, CancellationToken cancellationToken)
    {
        await _softDeleteService.Delete(_context.TodoItemTags, request.Id, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
