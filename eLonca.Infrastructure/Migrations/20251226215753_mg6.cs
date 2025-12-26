using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eLonca.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReturnNote",
                table: "SaleItems");

            migrationBuilder.AddColumn<string>(
                name: "ReturnedNote",
                table: "SaleItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReturnedNote",
                table: "SaleItems");

            migrationBuilder.AddColumn<bool>(
                name: "ReturnNote",
                table: "SaleItems",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
