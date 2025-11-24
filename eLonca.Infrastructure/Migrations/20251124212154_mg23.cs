using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eLonca.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg23 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CustomerDiscount",
                table: "SaleItems",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerDiscount",
                table: "SaleItems");
        }
    }
}
