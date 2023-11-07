using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Todo_App.Domain.Common;

namespace Todo_App.Application.Common.Interfaces;
public interface ISoftDeleteService 
{
    Task<bool> Delete<T>(DbSet<T> source, int id, CancellationToken cancellationToken) where T : BaseAuditableEntity;
}
