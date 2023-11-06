using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Todo_App.Application.Common.Interfaces;
using Todo_App.Application.Common.Mappings;
using Todo_App.Application.Common.Models;

namespace Todo_App.Application.TodoItems.Queries.GetTodoItemsWithPagination;

public record GetTodoItemsWithPaginationQuery : IRequest<PaginatedList<TodoItemBriefDto>>
{
    public int? ListId { get; init; }
    public string? SearchTxt { get; init; }
    public List<int>? ItemIds { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; }
}

public class GetTodoItemsWithPaginationQueryHandler : IRequestHandler<GetTodoItemsWithPaginationQuery, PaginatedList<TodoItemBriefDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTodoItemsWithPaginationQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<TodoItemBriefDto>> Handle(GetTodoItemsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TodoItems
            .OrderBy(x => x.Title)
            .Where(x => x.isDeleted.Equals(false))
            .ProjectTo<TodoItemBriefDto>(_mapper.ConfigurationProvider);
        
        if (request.ListId.HasValue)
        {
            query = query.Where(i => i.ListId == request.ListId.Value);
        }

        if (request.ItemIds?.Count > 0)
        {
            query = query.Where(f => request.ItemIds.Contains(f.Id));
        }

        if (!string.IsNullOrEmpty(request.SearchTxt))
        {

            query = query.Where(x => x.Title!.Contains(request.SearchTxt.ToLower()) || 
                                x.Note!.Contains(request.SearchTxt.ToLower()));
        }

        return await query.PaginatedListAsync(request.PageNumber, request.PageSize);
    }
}
