using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Session3InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DROP TABLE IF EXISTS public.github_webhook_deliveries CASCADE;
                """);

            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "tenants",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    plan = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    git_hub_org_id = table.Column<long>(type: "bigint", nullable: true),
                    git_hub_app_installation_id = table.Column<long>(type: "bigint", nullable: false),
                    webhook_secret_hash = table.Column<byte[]>(type: "bytea", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    status = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    config_yaml = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tenants", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "repositories",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    full_name = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    architecture_style = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    last_indexed_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_repositories", x => x.id);
                    table.ForeignKey(
                        name: "fk_repositories_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalSchema: "public",
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tenant_metrics",
                schema: "public",
                columns: table => new
                {
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    prs_reviewed = table.Column<int>(type: "integer", nullable: false),
                    violations_found = table.Column<int>(type: "integer", nullable: false),
                    avg_review_ms = table.Column<double>(type: "double precision", nullable: false),
                    token_cost_zar = table.Column<decimal>(type: "numeric(18,6)", precision: 18, scale: 6, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tenant_metrics", x => new { x.tenant_id, x.date });
                    table.ForeignKey(
                        name: "fk_tenant_metrics_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalSchema: "public",
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pr_review_jobs",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    repository_id = table.Column<Guid>(type: "uuid", nullable: false),
                    pr_number = table.Column<int>(type: "integer", nullable: false),
                    github_delivery_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    status = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    completed_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    duration_ms = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_pr_review_jobs", x => x.id);
                    table.ForeignKey(
                        name: "fk_pr_review_jobs_repositories_repository_id",
                        column: x => x.repository_id,
                        principalSchema: "public",
                        principalTable: "repositories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_pr_review_jobs_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalSchema: "public",
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "findings",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    job_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    severity = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    category = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    rule_id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    source = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    file_path = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    line_number = table.Column<int>(type: "integer", nullable: true),
                    message = table.Column<string>(type: "character varying(8192)", maxLength: 8192, nullable: false),
                    was_actioned = table.Column<bool>(type: "boolean", nullable: false),
                    pr_merge_status = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    training_features_json = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_findings", x => x.id);
                    table.ForeignKey(
                        name: "fk_findings_pr_review_jobs_job_id",
                        column: x => x.job_id,
                        principalSchema: "public",
                        principalTable: "pr_review_jobs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_findings_tenants_tenant_id",
                        column: x => x.tenant_id,
                        principalSchema: "public",
                        principalTable: "tenants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "tenants",
                columns: new[] { "id", "config_yaml", "created_at", "git_hub_app_installation_id", "git_hub_org_id", "name", "plan", "status", "webhook_secret_hash" },
                values: new object[] { new Guid("f1111111-1111-1111-1111-111111111111"), "# Billable default — replace github_app_installation_id when GitHub App is installed for this org.", new DateTimeOffset(new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 9000000000001L, null, "Billable", "Growth", "Active", null });

            migrationBuilder.CreateIndex(
                name: "ix_findings_job_id",
                schema: "public",
                table: "findings",
                column: "job_id");

            migrationBuilder.CreateIndex(
                name: "ix_findings_tenant_id_created_at",
                schema: "public",
                table: "findings",
                columns: new[] { "tenant_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_findings_tenant_id_job_id",
                schema: "public",
                table: "findings",
                columns: new[] { "tenant_id", "job_id" });

            migrationBuilder.CreateIndex(
                name: "ix_pr_review_jobs_repository_id",
                schema: "public",
                table: "pr_review_jobs",
                column: "repository_id");

            migrationBuilder.CreateIndex(
                name: "ix_pr_review_jobs_tenant_id_github_delivery_id",
                schema: "public",
                table: "pr_review_jobs",
                columns: new[] { "tenant_id", "github_delivery_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_repositories_tenant_id_full_name",
                schema: "public",
                table: "repositories",
                columns: new[] { "tenant_id", "full_name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenants_git_hub_app_installation_id",
                schema: "public",
                table: "tenants",
                column: "git_hub_app_installation_id",
                unique: true);

            migrationBuilder.Sql(
                """
                CREATE OR REPLACE FUNCTION public.fn_resolve_tenant_by_installation(p_installation_id bigint)
                RETURNS uuid
                LANGUAGE sql
                STABLE
                SET search_path = public
                AS $func$
                    SELECT t.id
                    FROM public.tenants AS t
                    WHERE t.git_hub_app_installation_id = p_installation_id
                    ORDER BY t.created_at
                    LIMIT 1;
                $func$;

                COMMENT ON FUNCTION public.fn_resolve_tenant_by_installation(bigint) IS
                    'Maps GitHub App installation id to tenant. Invoker (table owner) bypasses RLS on tenants while FORCE is not used on tenants; child tables use FORCE RLS.';

                -- Tenants: RLS for future least-privilege roles; table owner bypasses (no FORCE) so installation lookup works before tenant context exists.
                ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
                CREATE POLICY tenants_tenant_ctx ON public.tenants
                    FOR ALL
                    TO PUBLIC
                    USING (id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid)
                    WITH CHECK (id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid);

                ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
                ALTER TABLE public.repositories FORCE ROW LEVEL SECURITY;
                CREATE POLICY repositories_tenant_ctx ON public.repositories
                    FOR ALL
                    TO PUBLIC
                    USING (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid)
                    WITH CHECK (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid);

                ALTER TABLE public.pr_review_jobs ENABLE ROW LEVEL SECURITY;
                ALTER TABLE public.pr_review_jobs FORCE ROW LEVEL SECURITY;
                CREATE POLICY pr_review_jobs_tenant_ctx ON public.pr_review_jobs
                    FOR ALL
                    TO PUBLIC
                    USING (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid)
                    WITH CHECK (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid);

                ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
                ALTER TABLE public.findings FORCE ROW LEVEL SECURITY;
                CREATE POLICY findings_tenant_ctx ON public.findings
                    FOR ALL
                    TO PUBLIC
                    USING (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid)
                    WITH CHECK (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid);

                ALTER TABLE public.tenant_metrics ENABLE ROW LEVEL SECURITY;
                ALTER TABLE public.tenant_metrics FORCE ROW LEVEL SECURITY;
                CREATE POLICY tenant_metrics_tenant_ctx ON public.tenant_metrics
                    FOR ALL
                    TO PUBLIC
                    USING (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid)
                    WITH CHECK (tenant_id = NULLIF(trim(current_setting('app.current_tenant_id', true)), '')::uuid);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DROP POLICY IF EXISTS tenant_metrics_tenant_ctx ON public.tenant_metrics;
                ALTER TABLE public.tenant_metrics NO FORCE ROW LEVEL SECURITY;
                ALTER TABLE public.tenant_metrics DISABLE ROW LEVEL SECURITY;

                DROP POLICY IF EXISTS findings_tenant_ctx ON public.findings;
                ALTER TABLE public.findings NO FORCE ROW LEVEL SECURITY;
                ALTER TABLE public.findings DISABLE ROW LEVEL SECURITY;

                DROP POLICY IF EXISTS pr_review_jobs_tenant_ctx ON public.pr_review_jobs;
                ALTER TABLE public.pr_review_jobs NO FORCE ROW LEVEL SECURITY;
                ALTER TABLE public.pr_review_jobs DISABLE ROW LEVEL SECURITY;

                DROP POLICY IF EXISTS repositories_tenant_ctx ON public.repositories;
                ALTER TABLE public.repositories NO FORCE ROW LEVEL SECURITY;
                ALTER TABLE public.repositories DISABLE ROW LEVEL SECURITY;

                DROP POLICY IF EXISTS tenants_tenant_ctx ON public.tenants;
                ALTER TABLE public.tenants DISABLE ROW LEVEL SECURITY;

                DROP FUNCTION IF EXISTS public.fn_resolve_tenant_by_installation(bigint);
                """);

            migrationBuilder.DropTable(
                name: "findings",
                schema: "public");

            migrationBuilder.DropTable(
                name: "tenant_metrics",
                schema: "public");

            migrationBuilder.DropTable(
                name: "pr_review_jobs",
                schema: "public");

            migrationBuilder.DropTable(
                name: "repositories",
                schema: "public");

            migrationBuilder.DropTable(
                name: "tenants",
                schema: "public");
        }
    }
}
