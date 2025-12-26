using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eLonca.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReturned",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "ReturnedDate",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "ReturnedNote",
                table: "SaleItems");

            migrationBuilder.AddColumn<decimal>(
                name: "ReturnedQuantity",
                table: "SaleItems",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReturnedQuantity",
                table: "SaleItems");

            migrationBuilder.AddColumn<bool>(
                name: "IsReturned",
                table: "SaleItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReturnedDate",
                table: "SaleItems",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReturnedNote",
                table: "SaleItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
