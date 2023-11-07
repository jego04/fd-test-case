using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Todo_App.Application.Common.Interfaces;

namespace Todo_App.Application.TodoItemTags.Queries;
public record GetTodoItemsTagQuery : IRequest<IList<TodoItemsTagDto>>;

public class GetTodoItemsTagQueryHandler : IRequestHandler<GetTodoItemsTagQuery, IList<TodoItemsTagDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    public GetTodoItemsTagQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IList<TodoItemsTagDto>> Handle(GetTodoItemsTagQuery request, CancellationToken cancellationToken)
    {
        return await _context.TodoItemTags.Where(x => x.isDeleted.Equals(false)).ProjectTo<TodoItemsTagDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
    }
}
