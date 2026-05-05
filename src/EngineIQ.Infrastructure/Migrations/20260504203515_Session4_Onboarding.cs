using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Session4_Onboarding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "git_hub_app_installation_id",
                schema: "public",
                table: "tenants",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<byte[]>(
                name: "api_key_hash",
                schema: "public",
                table: "tenants",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "contact_email",
                schema: "public",
                table: "tenants",
                type: "character varying(320)",
                maxLength: 320,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "git_hub_install_state",
                schema: "public",
                table: "tenants",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "git_hub_org_login",
                schema: "public",
                table: "tenants",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.UpdateData(
                schema: "public",
                table: "tenants",
                keyColumn: "id",
                keyValue: new Guid("f1111111-1111-1111-1111-111111111111"),
                columns: new[] { "api_key_hash", "contact_email", "git_hub_install_state", "git_hub_org_login" },
                values: new object[] { null, null, null, null });

            migrationBuilder.CreateIndex(
                name: "ix_tenants_git_hub_install_state",
                schema: "public",
                table: "tenants",
                column: "git_hub_install_state",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_tenants_git_hub_install_state",
                schema: "public",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "api_key_hash",
                schema: "public",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "contact_email",
                schema: "public",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "git_hub_install_state",
                schema: "public",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "git_hub_org_login",
                schema: "public",
                table: "tenants");

            migrationBuilder.AlterColumn<long>(
                name: "git_hub_app_installation_id",
                schema: "public",
                table: "tenants",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);
        }
    }
}
