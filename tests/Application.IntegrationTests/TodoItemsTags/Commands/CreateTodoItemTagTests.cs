using FluentAssertions;
using NUnit.Framework;
using Todo_App.Application.Common.Exceptions;
using Todo_App.Application.TodoItems.Commands.CreateTodoItem;
using Todo_App.Application.TodoItemTags.Commands.CreateTodoItemTag;
using Todo_App.Application.TodoLists.Commands.CreateTodoList;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.IntegrationTests.TodoItemsTags.Commands;

using static Testing;

public class CreateTodoItemTagTests : BaseTestFixture
{
    [Test]
    public async Task ShouldRequireMinimumFields()
    {
        var command = new CreateTodoItemTagCommand();
        await FluentActions.Invoking(() => SendAsync(command)).Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldRequireValidItemId ()
    {
        var command = new CreateTodoItemTagCommand
        {
            ItemId = 209,
            Name = "Test 1"
        };

        await FluentActions.Invoking(() => SendAsync(command)).Should().ThrowAsync<NotFoundException>();
    }

    [Test]
    public async Task ShouldCreateTodoTagItem()
    {
        var userId = await RunAsDefaultUserAsync();

        var listId = await SendAsync(new CreateTodoListCommand
        {
            Title = "New List 5"
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

        var tag = await FindAsync<TodoItemTag>(tagId);  

        item.Should().NotBeNull();
        item!.ListId.Should().Be(command.ListId);
        item.Title.Should().Be(command.Title);
        item.ItemColour.Should().Be(command.ItemColour);
        item.CreatedBy.Should().Be(userId);
        item.Created.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMilliseconds(10000));
        item.LastModifiedBy.Should().Be(userId);
        item.LastModified.Should().BeCloseTo(DateTime.Now, TimeSpan.FromMilliseconds(10000));

        tag.Should().NotBeNull();
        tag!.Name.Should().Be(tagCommand.Name);
        tag.TodoItemId.Should().Be(itemId);
    }
}
