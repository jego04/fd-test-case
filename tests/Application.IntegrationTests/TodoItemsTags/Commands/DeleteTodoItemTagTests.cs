using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using NUnit.Framework;
using Todo_App.Application.Common.Exceptions;
using Todo_App.Application.TodoItems.Commands.CreateTodoItem;
using Todo_App.Application.TodoItems.Commands.DeleteTodoItem;
using Todo_App.Application.TodoItemTags.Commands.CreateTodoItemTag;
using Todo_App.Application.TodoItemTags.Commands.DeleteTodoItemTag;
using Todo_App.Application.TodoLists.Commands.CreateTodoList;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.IntegrationTests.TodoItemsTags.Commands;

using static Testing;
public class DeleteTodoItemTagTests: BaseTestFixture
{
    [Test]
    public async Task ShouldRequireValidTodoItemId()
    {
        var command = new DeleteTodoItemTagCommand(99);

        await FluentActions.Invoking(() =>
            SendAsync(command)).Should().ThrowAsync<NotFoundException>();
    }

    [Test]
    public async Task ShouldDeleteTodoItemTag()
    {

        var listId = await SendAsync(new CreateTodoListCommand
        {
            Title = "List 1"
        });

        var command = new CreateTodoItemCommand
        {
            ListId = listId,
            ItemColour = "#FF5733",
            Title = "Tasks"
        };

        var itemId = await SendAsync(command);

        var tagCommand = new CreateTodoItemTagCommand
        {
            ItemId = itemId,
            Name = "Title 1",
        };

        var tagId = await SendAsync(tagCommand);

        var item = await FindAsync<TodoItem>(itemId);

        await SendAsync(new DeleteTodoItemTagCommand(tagId));

        var tag = await FindAsync<TodoItemTag>(tagId);

        item.Should().NotBeNull();
        tag.Should().BeNull();

    }

    [Test]
    public async Task ShouldSoftDeleteTodoItemTag()
    {
        var listId = await SendAsync(new CreateTodoListCommand
        {
            Title = "New List 9"

        });

        var command = new CreateTodoItemCommand
        {
            ListId = listId,
            ItemColour = "#FF5733",
            Title = "Tasks"
        };

        var itemId = await SendAsync(command);

        var tagCommand = new CreateTodoItemTagCommand
        {
            ItemId = itemId,
            Name = "Title 2",
        };

        var tagId = await SendAsync(tagCommand);

        var tag = await FindAsync<TodoItemTag>(tagId);

        await SendAsync(new SoftDeleteTodoItemTagCommand(tagId));

        tag.Should().NotBeNull();
        tag?.isDeleted.Equals(1);


    }
}
