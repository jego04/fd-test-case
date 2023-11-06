using Microsoft.EntityFrameworkCore;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }
    DbSet<TodoItemTag> TodoItemTags { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    DbSet<T> Set<T>() where T : class;
}
