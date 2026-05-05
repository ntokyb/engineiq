namespace EngineIQ.Infrastructure;

public class PostgresOptions
{
    public const string SectionName = "Postgres";

    /// <summary>PostgreSQL connection string from environment (never log).</summary>
    public string ConnectionString { get; set; } = string.Empty;
}
