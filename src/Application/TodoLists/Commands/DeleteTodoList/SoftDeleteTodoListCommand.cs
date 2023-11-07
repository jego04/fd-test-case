using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Todo_App.Application.Common.Interfaces;

namespace Todo_App.Application.TodoLists.Commands.DeleteTodoList;

public record SoftDeleteTodoListCommand(int Id) : IRequest;

public class SoftDeleteTodoListCommandHandler : IRequestHandler<SoftDeleteTodoListCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ISoftDeleteService _softDeleteService;

    public SoftDeleteTodoListCommandHandler(IApplicationDbContext context, ISoftDeleteService softDeleteService)
    {
        _context = context;
        _softDeleteService = softDeleteService; 
    }

    public async Task<Unit> Handle(SoftDeleteTodoListCommand request, CancellationToken cancellationToken)
    {
        await _softDeleteService.Delete(_context.TodoLists, request.Id, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
