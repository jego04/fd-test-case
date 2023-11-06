using FluentAssertions;
using NUnit.Framework;
using Todo_App.Application.Common.Mappings;
using Todo_App.Application.TodoItems.Commands.CreateTodoItem;
using Todo_App.Application.TodoItems.Queries.GetTodoItemsWithPagination;
using Todo_App.Application.TodoItemTags.Commands.CreateTodoItemTag;
using Todo_App.Application.TodoLists.Commands.CreateTodoList;
using Todo_App.Domain.Entities;

namespace Todo_App.Application.IntegrationTests.TodoItems.Queries;

using static Testing;
public class GetPaginatedItemsTests: BaseTestFixture
{
    public static async Task<int> CreateList()
    {
        var command = new CreateTodoListCommand
        {
            Title = "Tasks" + new Guid(Guid.NewGuid().ToString()),
        };

        return await SendAsync(command);
    }

    public async Task<object> PopulateListAndItem(int listIdOne, int listIdTwo)
    {
        var itemsCommand = new List<CreateTodoItemCommand>
        {
            new CreateTodoItemCommand {ListId= listIdOne, Title="Title 1", ItemColour="#FFFFFF"},
            new CreateTodoItemCommand {ListId= listIdOne, Title="Title 2", ItemColour="#FFFFFF"},
            new CreateTodoItemCommand {ListId= listIdOne, Title="Title 3", ItemColour="#FFFFFF"},
            new CreateTodoItemCommand {ListId= listIdOne, Title="Title 4", ItemColour="#FFFFFF"},
            new CreateTodoItemCommand {ListId= listIdTwo, Title="Title 5", ItemColour="#FFFFFF"},
            new CreateTodoItemCommand {ListId= listIdTwo, Title="Title 6", ItemColour="#FFFFFF"},
            new CreateTodoItemCommand {ListId= listIdOne, Title="Title 7", ItemColour="#FFFFFF"},
        };

        foreach (var item in itemsCommand)
        {
            var itemId = await SendAsync(item);
        }

        return (listIdOne, listIdTwo);
    }

    [Test]
    public async Task ShouldReturnItemsInPage()
    {

        var paginationCommand = new GetTodoItemsWithPaginationQuery
        {
            PageNumber = 1,
            PageSize = 5,
        };

        var firstList = await CreateList();
        var secondList = await CreateList();
        await PopulateListAndItem(firstList, secondList);


        var paginated = await SendAsync(paginationCommand);

        paginated.Items.Should().NotBeEmpty();
        paginated.TotalCount.Should().Be(7);
        paginated.PageNumber.Should().Be(1);
        paginated.HasNextPage.Should().BeTrue();
        paginated.HasPreviousPage.Should().BeFalse();

    }

    [Test]
    public async Task ShouldReturnItemsInPage_ByPage()
    {

        var paginationCommand = new GetTodoItemsWithPaginationQuery
        {
            PageNumber = 2,
            PageSize = 5,
        };

        var firstList = await CreateList();
        var secondList = await CreateList();
        await PopulateListAndItem(firstList, secondList);


        var paginated = await SendAsync(paginationCommand);

        paginated.Items.Should().NotBeEmpty();
        paginated.TotalCount.Should().Be(7);
        paginated.PageNumber.Should().Be(2);
        paginated.HasNextPage.Should().BeFalse();
        paginated.HasPreviousPage.Should().BeTrue();

    }

    [Test]
    public async Task ShouldReturnItemsInPage_One_BySearchTerm()
    {
        var firstList = await CreateList();
        var secondList = await CreateList();

        await PopulateListAndItem(firstList, secondList);

        var itemId = await SendAsync(new CreateTodoItemCommand
        {
            ListId = secondList,
            Title = "Test 7",
            ItemColour = "#FFFFFF"
        });

        var paginationCommand = new GetTodoItemsWithPaginationQuery
        {
            PageNumber = 1,
            PageSize = 5,
            SearchTxt = "Test"
        };

        var paginated = await SendAsync(paginationCommand);

        paginated.Items.Should().NotBeEmpty();
        paginated.TotalCount.Should().Be(1);
        paginated.PageNumber.Should().Be(1);
        paginated.HasNextPage.Should().BeFalse();
        paginated.HasPreviousPage.Should().BeFalse();

    }

    [Test]
    public async Task ShouldReturnItemsInPage_Many_BySearchTerm()
    {
        var firstList = await CreateList();
        var secondList = await CreateList();

        await PopulateListAndItem(firstList, secondList);

        var itemId = await SendAsync(new CreateTodoItemCommand { 
            ListId = secondList,
            Title= "Test 7",
            ItemColour= "#FFFFFF"
        });

        var paginationCommand = new GetTodoItemsWithPaginationQuery
        {
            PageNumber = 1,
            PageSize = 5,
            SearchTxt = "7"
        };

        var paginated = await SendAsync(paginationCommand);

        paginated.Items.Should().NotBeEmpty();
        paginated.TotalCount.Should().Be(2);
        paginated.PageNumber.Should().Be(1);
        paginated.HasNextPage.Should().BeFalse();
        paginated.HasPreviousPage.Should().BeFalse();

    }

    [Test]
    public async Task ShouldReturnItemsInPage_ByListId()
    {

        var firstList = await CreateList();
        var secondList = await CreateList();

        await PopulateListAndItem(firstList, secondList);

        var paginationCommand = new GetTodoItemsWithPaginationQuery
        {
            PageNumber = 1,
            PageSize = 5,
            ListId = firstList
        };

        var paginatedById = await SendAsync(paginationCommand);

        paginatedById.Items.Should().NotBeEmpty();
        paginatedById.TotalCount.Should().Be(5);
        paginatedById.PageNumber.Should().Be(1);
        paginatedById.HasNextPage.Should().BeFalse();
        paginatedById.HasPreviousPage.Should().BeFalse();

    }
}
