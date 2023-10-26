﻿using Microsoft.AspNetCore.Mvc;
using Todo_App.Application.Common.Models;
using Todo_App.Application.TodoItems.Commands.CreateTodoItem;
using Todo_App.Application.TodoItems.Commands.DeleteTodoItem;
using Todo_App.Application.TodoItems.Commands.UpdateTodoItem;
using Todo_App.Application.TodoItems.Commands.UpdateTodoItemDetail;
using Todo_App.Application.TodoItems.Queries.GetTodoItemsWithPagination;
using Todo_App.Application.TodoItemTags.Commands.CreateTodoItemTag;
using Todo_App.Application.TodoItemTags.Queries;

namespace Todo_App.WebUI.Controllers;

public class TodoItemsController : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedList<TodoItemBriefDto>>> GetTodoItemsWithPagination([FromQuery] GetTodoItemsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("Tag")]
    public async Task<ActionResult<IList<TodoItemsTagDto>>> GetTags()
    {
        var data = await Mediator.Send(new GetTodoItemsTagQuery());

        if(data.Count == 0)
        {
            return NoContent();
        }

        return Ok(data);
    }

    [HttpGet("Tag/{id}")]
    public async Task<ActionResult<IList<TodoItemsTagDto>>> GetTagsByItemId(int id)
    {
        var data = await Mediator.Send(new GetTagByItemIdQuery {  ItemId = id } );

        if (data.Count == 0)
        {
            return Ok(new List<TodoItemsTagDto>());
        }

        return Ok(data);
    }

    [HttpPost("Tag")]
    public async Task<ActionResult<int>> Create(CreateTodoItemTagCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateTodoItemCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateTodoItemCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpPut("[action]")]
    public async Task<ActionResult> UpdateItemDetails(int id, UpdateTodoItemDetailCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeleteTodoItemCommand(id));

        return NoContent();
    }
}
