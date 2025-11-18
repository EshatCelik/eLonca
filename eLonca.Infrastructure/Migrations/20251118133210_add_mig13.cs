using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eLonca.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class add_mig13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stores_Users_ManagerId",
                table: "Stores");

            migrationBuilder.DropIndex(
                name: "IX_Stores_ManagerId",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Stores");

            migrationBuilder.CreateTable(
                name: "StoreUser",
                columns: table => new
                {
                    StoresId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsersId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreUser", x => new { x.StoresId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_StoreUser_Stores_StoresId",
                        column: x => x.StoresId,
                        principalTable: "Stores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StoreUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StoreUser_UsersId",
                table: "StoreUser",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StoreUser");

            migrationBuilder.AddColumn<Guid>(
                name: "ManagerId",
                table: "Stores",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Stores_ManagerId",
                table: "Stores",
                column: "ManagerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Stores_Users_ManagerId",
                table: "Stores",
                column: "ManagerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
