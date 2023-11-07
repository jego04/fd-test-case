using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Todo_App.Domain.Entities;
public class TodoItemTag : BaseAuditableEntity
{
    public string? Name { get; set; }

    public int TodoItemId { get; set; } 

}
