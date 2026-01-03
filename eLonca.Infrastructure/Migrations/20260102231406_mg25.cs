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
                name: "StoreId1",
                table: "StoreCustomers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StoreCustomers_CustomerStoreId",
                table: "StoreCustomers",
                column: "CustomerStoreId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreCustomers_StoreId1",
                table: "StoreCustomers",
                column: "StoreId1");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreCustomers_Stores_CustomerStoreId",
                table: "StoreCustomers",
                column: "CustomerStoreId",
                principalTable: "Stores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreCustomers_Stores_StoreId1",
                table: "StoreCustomers",
                column: "StoreId1",
                principalTable: "Stores",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreCustomers_Stores_CustomerStoreId",
                table: "StoreCustomers");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreCustomers_Stores_StoreId1",
                table: "StoreCustomers");

            migrationBuilder.DropIndex(
                name: "IX_StoreCustomers_CustomerStoreId",
                table: "StoreCustomers");

            migrationBuilder.DropIndex(
                name: "IX_StoreCustomers_StoreId1",
                table: "StoreCustomers");

            migrationBuilder.DropColumn(
                name: "StoreId1",
                table: "StoreCustomers");
        }
    }
}
