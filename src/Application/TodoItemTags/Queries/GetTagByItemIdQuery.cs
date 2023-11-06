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
public record GetTagByItemIdQuery : IRequest<IList<TodoItemsTagDto>>
{
    public int ItemId { get; set; }
}

public class GetTagByItemIdQueryHandler : IRequestHandler<GetTagByItemIdQuery, IList<TodoItemsTagDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTagByItemIdQueryHandler(IApplicationDbContext context, IMapper mapper, ICsvFileBuilder fileBuilder)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<IList<TodoItemsTagDto>> Handle(GetTagByItemIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.TodoItemTags.Where(t => t.TodoItemId == request.ItemId && t.isDeleted.Equals(false)).ProjectTo<TodoItemsTagDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
    }
}