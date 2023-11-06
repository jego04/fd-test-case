using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todo_App.Infrastructure.Persistence.Migrations
{
    public partial class AddedisDeleted : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TodoItemTags_TodoItems_TodoItemId",
                table: "TodoItemTags");

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "TodoLists",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "TodoItemId",
                table: "TodoItemTags",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "TodoItemTags",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "TodoItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_TodoItemTags_TodoItems_TodoItemId",
                table: "TodoItemTags",
                column: "TodoItemId",
                principalTable: "TodoItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TodoItemTags_TodoItems_TodoItemId",
                table: "TodoItemTags");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "TodoLists");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "TodoItemTags");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "TodoItems");

            migrationBuilder.AlterColumn<int>(
                name: "TodoItemId",
                table: "TodoItemTags",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_TodoItemTags_TodoItems_TodoItemId",
                table: "TodoItemTags",
                column: "TodoItemId",
                principalTable: "TodoItems",
                principalColumn: "Id");
        }
    }
}
