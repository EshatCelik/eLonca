using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eLonca.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg30 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReturnNote",
                table: "SaleItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReturnNote",
                table: "SaleItems");
        }
    }
}
