using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineIQ.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Session5_1_FnResolveExcludeSuspended : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                      AND lower(coalesce(t.status, '')) <> 'suspended'
                    ORDER BY t.created_at
                    LIMIT 1;
                $func$;

                COMMENT ON FUNCTION public.fn_resolve_tenant_by_installation(bigint) IS
                    'Maps GitHub App installation id to tenant (excludes Suspended). Invoker bypasses RLS on tenants while FORCE is not used on tenants.';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                """);
        }
    }
}
