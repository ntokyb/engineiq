using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Session8_Trust : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "dpa_accepted_at",
                schema: "public",
                table: "tenants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "dpa_accepted_ip",
                schema: "public",
                table: "tenants",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "estimated_cost_zar",
                schema: "public",
                table: "pr_review_jobs",
                type: "numeric(18,6)",
                precision: 18,
                scale: 6,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "findings_count",
                schema: "public",
                table: "pr_review_jobs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "input_tokens",
                schema: "public",
                table: "pr_review_jobs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "output_tokens",
                schema: "public",
                table: "pr_review_jobs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                schema: "public",
                table: "tenants",
                keyColumn: "id",
                keyValue: new Guid("f1111111-1111-1111-1111-111111111111"),
                columns: new[] { "dpa_accepted_at", "dpa_accepted_ip" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dpa_accepted_at",
                schema: "public",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "dpa_accepted_ip",
                schema: "public",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "estimated_cost_zar",
                schema: "public",
                table: "pr_review_jobs");

            migrationBuilder.DropColumn(
                name: "findings_count",
                schema: "public",
                table: "pr_review_jobs");

            migrationBuilder.DropColumn(
                name: "input_tokens",
                schema: "public",
                table: "pr_review_jobs");

            migrationBuilder.DropColumn(
                name: "output_tokens",
                schema: "public",
                table: "pr_review_jobs");
        }
    }
}
