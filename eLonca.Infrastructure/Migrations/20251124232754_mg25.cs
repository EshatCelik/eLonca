using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eLonca.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class mg25 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SaleId",
                table: "StockMovements",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StockMovements_SaleId",
                table: "StockMovements",
                column: "SaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockMovements_Sales_SaleId",
                table: "StockMovements",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockMovements_Sales_SaleId",
                table: "StockMovements");

            migrationBuilder.DropIndex(
                name: "IX_StockMovements_SaleId",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "SaleId",
                table: "StockMovements");
        }
    }
}
