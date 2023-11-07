using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using IdentityModel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Todo_App.Application.Common.Exceptions;
using Todo_App.Application.Common.Interfaces;
using Todo_App.Domain.Common;

namespace Todo_App.Infrastructure.Services;
public class SoftDeleteService : ISoftDeleteService
{

    public async Task<bool> Delete<T>(DbSet<T> source, int id, CancellationToken cancellationToken) where T : BaseAuditableEntity
    {
        var entity = await source.FindAsync(new object[] { id }, cancellationToken: cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException($"Entity of type {typeof(T).Name}", id);

        }

        entity.isDeleted = true;

        return true;
    }
}
